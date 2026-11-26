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
 * GET /api/admin/requested-users
 * Fetches user requests joined with content (for OEM name, solution title, and OEM logo)
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

    // Fetch all requested users joined with content
    const rawRequests = await prisma.$queryRaw`
      SELECT r.id, r.userName, r.userEmail, r.organizationName, r.countryName, r.timezone,
             r.comments, r.contentID, r.contentIdKey, r.requestedDate, r.startDate, r.endDate,
             r.userAccessKeys, r.otp, r.otpTime, r.status, r.adminComment,
             c.oem as oemName, c.head as solutionTitle, c.oemImage
      FROM requesteduserlist r
      LEFT JOIN content c ON CAST(r.contentID AS CHAR) = CAST(c.id AS CHAR)
      ORDER BY r.id DESC
    `;

    // Calculate system statistics
    const totalRequests = rawRequests.length;
    let pendingCount = 0;
    let approvedCount = 0;
    let expiredCount = 0;
    let rejectedCount = 0;
    const oemSet = new Set();

    for (const r of rawRequests) {
      const s = (r.status || "").toLowerCase();
      if (s === "requested") pendingCount++;
      else if (s.includes("approved")) approvedCount++;
      else if (s === "expiry" || s === "expired") expiredCount++;
      else if (s === "rejected") rejectedCount++;

      if (r.oemName) oemSet.add(r.oemName);
    }

    // Apply search and filters
    let filtered = rawRequests;

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
        return idMatch || nameMatch || emailMatch || orgMatch || countryMatch || oemMatch || solutionMatch || commentsMatch;
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
        totalUnfiltered: totalRequests,
        page,
        limit,
        totalPages,
      },
      stats: {
        total: totalRequests,
        pending: pendingCount,
        approved: approvedCount,
        expired: expiredCount,
        rejected: rejectedCount,
      },
      availableOems: Array.from(oemSet).sort(),
    });
  } catch (error) {
    console.error("Admin Requested Users GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Database query error: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/requested-users
 * Updates status, adminComment, startDate, endDate, userAccessKeys (supports single or batch)
 */
export async function PATCH(request) {
  try {
    const authCheck = await verifyAdminSession();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: authCheck.status }
      );
    }

    const body = await request.json();
    const { ids, id, requestId, status, adminComment, startDate, endDate, userAccessKeys } = body;
    
    let targetIds = [];
    if (Array.isArray(ids) && ids.length > 0) {
      targetIds = ids.map(Number).filter((n) => !isNaN(n) && n > 0);
    } else {
      const singleId = Number(id || requestId);
      if (singleId && !isNaN(singleId)) targetIds = [singleId];
    }

    if (targetIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Valid request ID(s) required." },
        { status: 400 }
      );
    }

    const newStatus = status !== undefined ? String(status).trim() : "Approved with VDI";
    const newComment = adminComment !== undefined ? String(adminComment).trim() : "";
    const newStart = startDate !== undefined ? String(startDate).trim() : null;
    const newEnd = endDate !== undefined ? String(endDate).trim() : null;

    let updatedCount = 0;
    for (const tid of targetIds) {
      // Check existing to preserve or generate keys
      const existing = await prisma.$queryRaw`
        SELECT userAccessKeys, adminComment, startDate, endDate FROM requesteduserlist WHERE id = ${tid} LIMIT 1
      `;
      if (!Array.isArray(existing) || existing.length === 0) continue;

      const current = existing[0];
      let keysToUse = userAccessKeys !== undefined ? String(userAccessKeys).trim() : current.userAccessKeys;
      if (newStatus === "Approved with VDI" && (!keysToUse || keysToUse.trim() === "")) {
        keysToUse = "vdi_" + Math.random().toString(36).substring(2, 12) + Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
      }

      const defaultComment = newStatus === "Approved with VDI"
        ? "Approved by admin with VDI access."
        : newStatus === "Rejected"
        ? "Declined by Administrator."
        : newStatus === "Expiry"
        ? "Access timeline concluded (Expired session)."
        : (current.adminComment || "");

      const commentToUse = newComment || defaultComment;
      const startToUse = newStart || current.startDate;
      const endToUse = newEnd || current.endDate;

      await prisma.$executeRaw`
        UPDATE requesteduserlist
        SET status = ${newStatus},
            adminComment = ${commentToUse},
            startDate = ${startToUse},
            endDate = ${endToUse},
            userAccessKeys = ${keysToUse}
        WHERE id = ${tid}
      `;
      updatedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updatedCount} request(s) to "${newStatus}".`,
      updatedCount,
    });
  } catch (error) {
    console.error("Admin Requested Users PATCH Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update requested user(s): " + error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/requested-users
 * Soft-deletes (archives) requests by moving them from requesteduserlist into deletedrequesteduser (supports single or batch)
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
        // body may be empty
      }
    }

    if (targetIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Valid request ID(s) required for archiving." },
        { status: 400 }
      );
    }

    const adminEmail = authCheck.session?.user?.email || "admin@ivalue.co.in";
    let archivedCount = 0;

    for (const tid of targetIds) {
      // 1. Archive to deletedrequesteduser
      await prisma.$executeRaw`
        INSERT INTO deletedrequesteduser (
          id, userName, userEmail, organizationName, countryName, timezone,
          comments, contentID, contentIdKey, requestedDate, startDate, endDate,
          userAccessKeys, otp, otpTime, status, adminComment, deletedAt, deletedBy
        )
        SELECT
          id, userName, userEmail, organizationName, countryName, timezone,
          comments, contentID, contentIdKey, requestedDate, startDate, endDate,
          userAccessKeys, otp, otpTime, status, adminComment, NOW(), ${adminEmail}
        FROM requesteduserlist
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
          adminComment = VALUES(adminComment),
          deletedAt = NOW(),
          deletedBy = VALUES(deletedBy)
      `;

      // 2. Remove from requesteduserlist
      await prisma.$executeRaw`
        DELETE FROM requesteduserlist WHERE id = ${tid}
      `;
      archivedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully archived ${archivedCount} request(s) to Archived Users.`,
      archivedCount,
    });
  } catch (error) {
    console.error("Admin Requested Users DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to archive request(s): " + error.message },
      { status: 500 }
    );
  }
}
