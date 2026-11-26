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
    return { authorized: false, status: 401, message: "Unauthorized: Please sign in." };
  }

  const role = session.user.userType || session.user.role;
  if (role !== "admin") {
    return { authorized: false, status: 403, message: "Forbidden: Admin privileges required." };
  }

  return { authorized: true, session };
}

/**
 * GET /api/admin/users
 * Supports: pagination (page, limit), search (q), filter (role, provider), sorting
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
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limitParam = searchParams.get("limit");
    const isAll = limitParam === "all";
    const limit = isAll ? 1000 : Math.max(1, parseInt(limitParam || "10", 10));
    const search = (searchParams.get("search") || searchParams.get("q") || "").trim().toLowerCase();
    const roleFilter = (searchParams.get("role") || "").trim().toLowerCase();
    const providerFilter = (searchParams.get("provider") || "").trim().toLowerCase();

    // Fetch all users from the userlist table to compute live stats and apply filtering
    const allUsers = await prisma.$queryRaw`
      SELECT id, email, name, userType, provider, profileImage, accessToken, accessTillDate
      FROM userlist
      ORDER BY id DESC
    `;

    // Calculate system statistics from live database
    const totalUsers = allUsers.length;
    const adminCount = allUsers.filter((u) => (u.userType || "").toLowerCase() === "admin").length;
    const regularUserCount = totalUsers - adminCount;
    const googleCount = allUsers.filter((u) => (u.provider || "").toLowerCase() === "google").length;
    const msCount = allUsers.filter((u) => (u.provider || "").toLowerCase() === "microsoft").length;
    const otherProviderCount = totalUsers - googleCount - msCount;

    // Apply in-memory search and filters
    let filteredUsers = allUsers;

    if (search) {
      filteredUsers = filteredUsers.filter((u) => {
        const idMatch = String(u.id).includes(search);
        const nameMatch = (u.name || "").toLowerCase().includes(search);
        const emailMatch = (u.email || "").toLowerCase().includes(search);
        return idMatch || nameMatch || emailMatch;
      });
    }

    if (roleFilter && roleFilter !== "all") {
      filteredUsers = filteredUsers.filter((u) => (u.userType || "").toLowerCase() === roleFilter);
    }

    if (providerFilter && providerFilter !== "all") {
      filteredUsers = filteredUsers.filter((u) => (u.provider || "").toLowerCase() === providerFilter);
    }

    // Pagination slice
    const totalFiltered = filteredUsers.length;
    const totalPages = isAll ? 1 : Math.ceil(totalFiltered / limit) || 1;
    const offset = (page - 1) * limit;
    const paginatedUsers = isAll ? filteredUsers : filteredUsers.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      users: paginatedUsers,
      pagination: {
        total: totalFiltered,
        totalUnfiltered: totalUsers,
        page,
        limit,
        totalPages,
      },
      stats: {
        total: totalUsers,
        admins: adminCount,
        regularUsers: regularUserCount,
        googleCount,
        msCount,
        otherProviderCount,
      },
    });
  } catch (error) {
    console.error("Admin Users GET API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users from database." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Adds a new user to the userlist table
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
    const { name, email, userType = "user", provider = "credentials", accessTillDate = "", profileImage = "" } = body;

    if (!email || !name) {
      return NextResponse.json(
        { success: false, message: "Name and Email are required fields." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanRole = userType === "admin" ? "admin" : "user";
    const cleanProvider = (provider || "credentials").trim().toLowerCase();
    const cleanDate = (accessTillDate || "").trim();
    const cleanImage = (profileImage || "").trim();
    const generatedToken = "tok_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

    // Check if email already exists in userlist
    const existing = await prisma.$queryRaw`
      SELECT id FROM userlist WHERE email = ${cleanEmail} LIMIT 1
    `;

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { success: false, message: `A user with email "${cleanEmail}" already exists.` },
        { status: 409 }
      );
    }

    // Insert new user into userlist
    await prisma.$executeRaw`
      INSERT INTO userlist (email, name, userType, provider, profileImage, accessToken, accessTillDate)
      VALUES (${cleanEmail}, ${cleanName}, ${cleanRole}, ${cleanProvider}, ${cleanImage}, ${generatedToken}, ${cleanDate})
    `;

    // Fetch the newly inserted user
    const created = await prisma.$queryRaw`
      SELECT id, email, name, userType, provider, profileImage, accessToken, accessTillDate
      FROM userlist
      WHERE email = ${cleanEmail}
      ORDER BY id DESC
      LIMIT 1
    `;

    return NextResponse.json({
      success: true,
      message: `User "${cleanName}" (${cleanRole}) created successfully.`,
      user: created[0] || null,
    }, { status: 201 });
  } catch (error) {
    console.error("Admin Users POST API Error:", error);
    return NextResponse.json(
      { success: false, message: "Database error creating new user: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users
 * Fully updates an existing user in userlist
 */
export async function PUT(request) {
  try {
    const authCheck = await verifyAdminSession();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: authCheck.status }
      );
    }

    const body = await request.json();
    const { id, userId, name, email, userType, provider, accessTillDate, profileImage } = body;
    const targetId = Number(id || userId);

    if (!targetId || isNaN(targetId)) {
      return NextResponse.json(
        { success: false, message: "Valid user ID is required." },
        { status: 400 }
      );
    }

    // Fetch existing user to ensure they exist
    const existing = await prisma.$queryRaw`
      SELECT id, email, name FROM userlist WHERE id = ${targetId} LIMIT 1
    `;

    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json(
        { success: false, message: `User with ID #${targetId} not found.` },
        { status: 404 }
      );
    }

    const cleanEmail = (email || existing[0].email).trim().toLowerCase();
    const cleanName = (name || existing[0].name).trim();
    const cleanRole = userType === "admin" ? "admin" : "user";
    const cleanProvider = (provider || "google").trim().toLowerCase();
    const cleanDate = accessTillDate !== undefined ? String(accessTillDate).trim() : "";
    const cleanImage = profileImage !== undefined ? String(profileImage).trim() : "";

    // Execute update query
    await prisma.$executeRaw`
      UPDATE userlist
      SET name = ${cleanName},
          email = ${cleanEmail},
          userType = ${cleanRole},
          provider = ${cleanProvider},
          accessTillDate = ${cleanDate},
          profileImage = ${cleanImage}
      WHERE id = ${targetId}
    `;

    return NextResponse.json({
      success: true,
      message: `User #${targetId} (${cleanName}) updated successfully.`,
      user: {
        id: targetId,
        name: cleanName,
        email: cleanEmail,
        userType: cleanRole,
        provider: cleanProvider,
        accessTillDate: cleanDate,
        profileImage: cleanImage,
      },
    });
  } catch (error) {
    console.error("Admin Users PUT API Error:", error);
    return NextResponse.json(
      { success: false, message: "Database error updating user: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users
 * Quick partial update (e.g. changing userType directly)
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
    const { userId, id, userType, accessTillDate } = body;
    const targetId = Number(userId || id);

    if (!targetId) {
      return NextResponse.json(
        { success: false, message: "User ID is required." },
        { status: 400 }
      );
    }

    if (userType && ["admin", "user"].includes(userType)) {
      await prisma.$executeRaw`
        UPDATE userlist
        SET userType = ${userType}
        WHERE id = ${targetId}
      `;
      return NextResponse.json({
        success: true,
        message: `User #${targetId} role updated to "${userType}".`,
      });
    }

    if (accessTillDate !== undefined) {
      await prisma.$executeRaw`
        UPDATE userlist
        SET accessTillDate = ${String(accessTillDate).trim()}
        WHERE id = ${targetId}
      `;
      return NextResponse.json({
        success: true,
        message: `User #${targetId} access date updated.`,
      });
    }

    return NextResponse.json(
      { success: false, message: "No valid update fields specified." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Admin Users PATCH API Error:", error);
    return NextResponse.json(
      { success: false, message: "Database update error: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users
 * Removes single user or batch of users from userlist
 * Supports: query param `?id=123`, body `{ id: 123 }`, or body `{ ids: [1, 2, 3] }`
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
    const idParam = searchParams.get("id") || searchParams.get("userId");
    let targetIds = [];

    if (idParam) {
      const parsed = Number(idParam);
      if (!isNaN(parsed) && parsed > 0) targetIds.push(parsed);
    }

    try {
      const body = await request.json();
      if (Array.isArray(body?.ids)) {
        for (const rawId of body.ids) {
          const num = Number(rawId);
          if (!isNaN(num) && num > 0 && !targetIds.includes(num)) {
            targetIds.push(num);
          }
        }
      } else if (body?.id || body?.userId) {
        const singleId = Number(body.id || body.userId);
        if (!isNaN(singleId) && singleId > 0 && !targetIds.includes(singleId)) {
          targetIds.push(singleId);
        }
      }
    } catch {
      // body might not be JSON or might be omitted when query param is used
    }

    if (targetIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Valid user ID or list of IDs is required for deletion." },
        { status: 400 }
      );
    }

    // Safety check: Prevent admin from deleting their own active logged-in account
    const currentAdminEmail = authCheck.session?.user?.email?.toLowerCase();

    // Fetch existing records from userlist
    const usersToDelete = await prisma.userlist.findMany({
      where: { id: { in: targetIds } },
    });

    if (usersToDelete.length === 0) {
      return NextResponse.json(
        { success: false, message: "No matching users found to delete." },
        { status: 404 }
      );
    }

    // Filter out active admin account
    const safeUsers = usersToDelete.filter(
      (u) => !currentAdminEmail || (u.email || "").toLowerCase() !== currentAdminEmail
    );

    if (safeUsers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Action Blocked: You cannot delete your own active administrator account.",
        },
        { status: 400 }
      );
    }

    const safeIds = safeUsers.map((u) => u.id);

    const deleteResult = await prisma.userlist.deleteMany({
      where: { id: { in: safeIds } },
    });

    const wasAdminSkipped = usersToDelete.length > safeUsers.length;
    const count = deleteResult.count;

    return NextResponse.json({
      success: true,
      count,
      message: `${count} user(s) permanently deleted.${
        wasAdminSkipped ? " (Your active account was protected and excluded)." : ""
      }`,
    });
  } catch (error) {
    console.error("Admin Users DELETE API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user(s): " + error.message },
      { status: 500 }
    );
  }
}
