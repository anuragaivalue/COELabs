import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/user/profile
 * Retrieves authenticated user's profile details from userlist table.
 * Includes name, email, account type (userType), access validation date (accessTillDate),
 * and permission metadata (non-editable if standard user, editable if admin).
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in." },
        { status: 401 }
      );
    }

    const userEmail = session.user.email.trim();

    // Query profile from userlist table
    const rows = await prisma.$queryRaw`
      SELECT id, email, name, userType, provider, profileImage, accessToken, accessTillDate
      FROM userlist
      WHERE LOWER(email) = LOWER(${userEmail})
      LIMIT 1
    `;

    let profileData = rows && rows.length > 0 ? rows[0] : null;

    // If user record doesn't exist yet in userlist, create or fallback from session
    if (!profileData) {
      const defaultDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const userName = session.user.name || "Authenticated User";
      const userType = session.user.userType || session.user.role || "user";
      const provider = session.user.provider || "google";
      const profileImg = session.user.image || "";

      try {
        await prisma.$executeRaw`
          INSERT INTO userlist (email, name, userType, provider, profileImage, accessToken, accessTillDate)
          VALUES (${userEmail}, ${userName}, ${userType}, ${provider}, ${profileImg}, '', ${defaultDate})
        `;

        const freshRows = await prisma.$queryRaw`
          SELECT id, email, name, userType, provider, profileImage, accessToken, accessTillDate
          FROM userlist
          WHERE LOWER(email) = LOWER(${userEmail})
          LIMIT 1
        `;
        profileData = freshRows && freshRows.length > 0 ? freshRows[0] : null;
      } catch (insertErr) {
        console.warn("[Profile GET] Auto-insert into userlist warning:", insertErr.message);
      }
    }

    // Role and Admin permission check
    const currentRole = (
      profileData?.userType ||
      session.user.userType ||
      session.user.role ||
      "user"
    ).toLowerCase();
    const isAdmin = currentRole === "admin";

    // Activity stats for user
    let totalRequests = 0;
    let approvedCount = 0;
    let pendingCount = 0;

    try {
      const requests = await prisma.$queryRaw`
        SELECT status FROM requesteduserlist
        WHERE LOWER(userEmail) = LOWER(${userEmail})
      `;
      totalRequests = requests.length;
      for (const r of requests) {
        const s = (r.status || "").toLowerCase();
        if (s.includes("approved")) approvedCount++;
        else if (s === "requested") pendingCount++;
      }
    } catch (statsErr) {
      console.warn("[Profile GET] Stats query warning:", statsErr.message);
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: profileData?.id || 1,
        name: profileData?.name || session.user.name || "User",
        email: profileData?.email || userEmail,
        userType: profileData?.userType || currentRole,
        accessTillDate: profileData?.accessTillDate || "2026-12-31",
        provider: profileData?.provider || session.user.provider || "google",
        profileImage: profileData?.profileImage || session.user.image || "",
        isAdmin,
      },
      stats: {
        totalRequests,
        approvedRequests: approvedCount,
        pendingRequests: pendingCount,
      },
    });
  } catch (error) {
    console.error("[Profile GET API] Error:", error);
    return NextResponse.json(
      { success: false, message: "Database error fetching profile: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/profile
 * Updates user profile attributes (name, userType, accessTillDate).
 * Strictly enforced: Non-admin users cannot edit profile attributes (returns 403).
 * Admins are authorized to update profile attributes.
 */
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in." },
        { status: 401 }
      );
    }

    const callerEmail = session.user.email.trim();

    // Verify caller role directly from userlist
    const callerRows = await prisma.$queryRaw`
      SELECT userType FROM userlist WHERE LOWER(email) = LOWER(${callerEmail}) LIMIT 1
    `;
    const callerRole = (
      callerRows[0]?.userType ||
      session.user.userType ||
      session.user.role ||
      "user"
    ).toLowerCase();

    if (callerRole !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Permission Denied: Standard user accounts cannot edit profile attributes. Please contact an Administrator for access modifications.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      userType,
      accessTillDate,
      targetEmail,
    } = body;

    const emailToUpdate = (targetEmail || callerEmail).trim();

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Name cannot be empty." },
        { status: 400 }
      );
    }

    // Update in userlist table
    await prisma.$executeRaw`
      UPDATE userlist
      SET name = ${name.trim()},
          userType = ${userType ? userType.trim() : "user"},
          accessTillDate = ${accessTillDate ? accessTillDate.trim() : "2026-12-31"}
      WHERE LOWER(email) = LOWER(${emailToUpdate})
    `;

    // Also update name in NextAuth user table if row exists
    try {
      await prisma.user.updateMany({
        where: { email: emailToUpdate },
        data: {
          name: name.trim(),
          role: userType ? userType.trim() : undefined,
          updatedAt: new Date(),
        },
      });
    } catch {}

    // Fetch updated record
    const updatedRows = await prisma.$queryRaw`
      SELECT id, email, name, userType, provider, profileImage, accessToken, accessTillDate
      FROM userlist
      WHERE LOWER(email) = LOWER(${emailToUpdate})
      LIMIT 1
    `;

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      profile: updatedRows && updatedRows.length > 0 ? updatedRows[0] : null,
    });
  } catch (error) {
    console.error("[Profile PUT API] Error:", error);
    return NextResponse.json(
      { success: false, message: "Database error updating profile: " + error.message },
      { status: 500 }
    );
  }
}
