import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Verify if the requesting session belongs to an authenticated Admin
 */
async function verifyAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { authorized: false, status: 401, message: "Unauthorized: Sign in required." };
  }

  const role = session.user.userType || session.user.role;
  if (role !== "admin") {
    return { authorized: false, status: 403, message: "Forbidden: Admin privileges required." };
  }

  return { authorized: true, session };
}

/**
 * GET /api/admin/archived-users
 * Fetches archived requests from deletedrequesteduser joined with content
 */
export async function GET(request) {
  try {
    const authCheck = await verifyAdminSession();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: authCheck.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || searchParams.get("q") || "").trim().toLowerCase();
    const statusFilter = (searchParams.get("status") || "all").trim().toLowerCase();
    const oemFilter = (searchParams.get("oem") || "all").trim().toLowerCase();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limitParam = searchParams.get("limit");
    const isAll = limitParam === "all";
    const limit = isAll ? 1000 : Math.max(1, parseInt(limitParam || "10", 10));

    // Fetch all archived users joined with content
    const rawArchived = await prisma.$queryRaw`
      SELECT d.id, d.userName, d.userEmail, d.organizationName, d.countryName, d.timezone,
             d.comments, d.contentID, d.contentIdKey, d.requestedDate, d.startDate, d.endDate,
             d.userAccessKeys, d.otp, d.otpTime, d.status, d.adminComment,
             d.deletedAt, d.deletedBy,
             c.oem as oemName, c.head as solutionTitle, c.oemImage
      FROM deletedrequesteduser d
      LEFT JOIN content c ON CAST(d.contentID AS CHAR) = CAST(c.id AS CHAR)
      ORDER BY d.deletedAt DESC, d.id DESC
    `;

    // Calculate system statistics
    const totalArchived = rawArchived.length;
    let pendingCount = 0;
    let approvedCount = 0;
    let expiredCount = 0;
    let rejectedCount = 0;
    const oemSet = new Set();

    for (const r of rawArchived) {
      const s = (r.status || "").toLowerCase();
      if (s === "requested") pendingCount++;
      else if (s.includes("approved")) approvedCount++;
      else if (s === "expiry" || s === "expired") expiredCount++;
      else if (s === "rejected") rejectedCount++;

      if (r.oemName) oemSet.add(r.oemName);
    }

    // Apply search and filters
    let filtered = rawArchived;

    if (search) {
      filtered = filtered.filter((r) => {
        const idMatch = String(r.id).includes(search);
        const nameMatch = (r.userName || "").toLowerCase().includes(search);
        const emailMatch = (r.userEmail || "").toLowerCase().includes(search);
        const orgMatch = (r.organizationName || "").toLowerCase().includes(search);
        const countryMatch = (r.countryName || "").toLowerCase().includes(search);
        const oemMatch = (r.oemName || "").toLowerCase().includes(search);
        const solutionMatch = (r.solutionTitle || "").toLowerCase().includes(search);
        const commentsMatch = (r.comments || "").toLowerCase().includes(search);
        const deletedByMatch = (r.deletedBy || "").toLowerCase().includes(search);
        return (
          idMatch ||
          nameMatch ||
          emailMatch ||
          orgMatch ||
          countryMatch ||
          oemMatch ||
          solutionMatch ||
          commentsMatch ||
          deletedByMatch
        );
      });
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((r) => {
        const s = (r.status || "").toLowerCase();
        if (statusFilter === "requested") return s === "requested";
        if (statusFilter === "approved") return s.includes("approved");
        if (statusFilter === "expiry" || statusFilter === "expired") return s === "expiry" || s === "expired";
        if (statusFilter === "rejected") return s === "rejected";
        return s === statusFilter;
      });
    }

    if (oemFilter && oemFilter !== "all") {
      filtered = filtered.filter((r) => (r.oemName || "").toLowerCase() === oemFilter);
    }

    // Pagination
    const totalFiltered = filtered.length;
    const totalPages = isAll ? 1 : Math.ceil(totalFiltered / limit) || 1;
    const offset = (page - 1) * limit;
    const paginated = isAll ? filtered : filtered.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      requests: paginated,
      pagination: {
        total: totalFiltered,
        totalUnfiltered: totalArchived,
        page,
        limit,
        totalPages,
      },
      stats: {
        total: totalArchived,
        pending: pendingCount,
        approved: approvedCount,
        expired: expiredCount,
        rejected: rejectedCount,
      },
      availableOems: Array.from(oemSet).sort(),
    });
  } catch (error) {
    console.error("Admin Archived Users GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Database query error: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/archived-users
 * Restores archived request(s) from deletedrequesteduser back to requesteduserlist (supports single or batch)
 */
export async function POST(request) {
  try {
    const authCheck = await verifyAdminSession();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: authCheck.status }
      );
    }

    const body = await request.json();
    let targetIds = [];
    if (Array.isArray(body.ids) && body.ids.length > 0) {
      targetIds = body.ids.map(Number).filter((n) => !isNaN(n) && n > 0);
    } else {
      const singleId = Number(body.id || body.requestId);
      if (singleId && !isNaN(singleId)) targetIds = [singleId];
    }

    if (targetIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Valid request ID(s) required for restoration." },
        { status: 400 }
      );
    }

    let restoredCount = 0;
    for (const tid of targetIds) {
      // 1. Restore into requesteduserlist
      await prisma.$executeRaw`
        INSERT INTO requesteduserlist (
          id, userName, userEmail, organizationName, countryName, timezone,
          comments, contentID, contentIdKey, requestedDate, startDate, endDate,
          userAccessKeys, otp, otpTime, status, adminComment
        )
        SELECT
          id, userName, userEmail, organizationName, countryName, timezone,
          comments, contentID, contentIdKey, requestedDate, startDate, endDate,
          userAccessKeys, otp, otpTime, status, adminComment
        FROM deletedrequesteduser
        WHERE id = ${tid}
        ON DUPLICATE KEY UPDATE
          userName = VALUES(userName),
          userEmail = VALUES(userEmail),
          organizationName = VALUES(organizationName),
          countryName = VALUES(countryName),
          timezone = VALUES(timezone),
          comments = VALUES(comments),
          contentID = VALUES(contentID),
          contentIdKey = VALUES(contentIdKey),
          requestedDate = VALUES(requestedDate),
          startDate = VALUES(startDate),
          endDate = VALUES(endDate),
          userAccessKeys = VALUES(userAccessKeys),
          otp = VALUES(otp),
          otpTime = VALUES(otpTime),
          status = VALUES(status),
          adminComment = VALUES(adminComment)
      `;

      // 2. Delete from deletedrequesteduser
      await prisma.$executeRaw`
        DELETE FROM deletedrequesteduser WHERE id = ${tid}
      `;
      restoredCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully restored ${restoredCount} application(s) to Requested Users.`,
      restoredCount,
    });
  } catch (error) {
    console.error("Admin Archived Users POST (Restore) Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to restore application(s): " + error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/archived-users
 * Permanently purges record(s) from deletedrequesteduser (supports single or batch)
 */
export async function DELETE(request) {
  try {
    const authCheck = await verifyAdminSession();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: authCheck.status }
      );
    }

    const { searchParams } = new URL(request.url);
    let targetIds = [];
    const idsParam = searchParams.get("ids");
    if (idsParam) {
      targetIds = idsParam.split(",").map(Number).filter((n) => !isNaN(n) && n > 0);
    } else {
      const idParam = searchParams.get("id") || searchParams.get("requestId");
      if (idParam) {
        const parsed = Number(idParam);
        if (!isNaN(parsed) && parsed > 0) targetIds = [parsed];
      }
    }

    if (targetIds.length === 0) {
      try {
        const body = await request.json();
        if (Array.isArray(body.ids)) {
          targetIds = body.ids.map(Number).filter((n) => !isNaN(n) && n > 0);
        } else if (body.id || body.requestId) {
          const parsed = Number(body.id || body.requestId);
          if (!isNaN(parsed) && parsed > 0) targetIds = [parsed];
        }
      } catch {
        // body could be empty
      }
    }

    if (targetIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Valid request ID(s) required for permanent deletion." },
        { status: 400 }
      );
    }

    let purgedCount = 0;
    for (const tid of targetIds) {
      await prisma.$executeRaw`
        DELETE FROM deletedrequesteduser WHERE id = ${tid}
      `;
      purgedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully purged ${purgedCount} application(s) from archive.`,
      purgedCount,
    });
  } catch (error) {
    console.error("Admin Archived Users DELETE (Purge) Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to permanently purge record(s): " + error.message },
      { status: 500 }
    );
  }
}
