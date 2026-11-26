import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/user/requests
 * Fetches lab access requests submitted by the logged-in user.
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in." },
        { status: 401 }
      );
    }

    const userEmail = session.user.email.trim();

    // Query user's requests joined with content
    const rawRequests = await prisma.$queryRaw`
      SELECT r.id, r.userName, r.userEmail, r.organizationName, r.countryName, r.timezone,
             r.comments, r.contentID, r.contentIdKey, r.requestedDate, r.startDate, r.endDate,
             r.userAccessKeys, r.otp, r.otpTime, r.status, r.adminComment,
             c.oem as oemName, c.head as solutionTitle, c.oemImage, c.accessCredentials, c.accessSteps
      FROM requesteduserlist r
      LEFT JOIN content c ON CAST(r.contentID AS CHAR) = CAST(c.id AS CHAR)
      WHERE LOWER(r.userEmail) = LOWER(${userEmail})
      ORDER BY r.id DESC
    `;

    // Calculate user request stats
    const totalRequests = rawRequests.length;
    let pendingCount = 0;
    let approvedCount = 0;
    let expiredCount = 0;
    let rejectedCount = 0;

    for (const r of rawRequests) {
      const s = (r.status || "").toLowerCase();
      if (s === "requested") pendingCount++;
      else if (s.includes("approved")) approvedCount++;
      else if (s === "expiry" || s === "expired") expiredCount++;
      else if (s === "rejected") rejectedCount++;
    }

    return NextResponse.json({
      success: true,
      requests: rawRequests,
      stats: {
        total: totalRequests,
        pending: pendingCount,
        approved: approvedCount,
        expired: expiredCount,
        rejected: rejectedCount,
      },
    });
  } catch (error) {
    console.error("User Requests GET API Error:", error);
    return NextResponse.json(
      { success: false, message: "Database query error: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/requests
 * Submits a new lab request for an OEM product.
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      contentID,
      startDate = "",
      endDate = "",
      timezone = "IST (UTC+05:30) • Kolkata, New Delhi, Mumbai, Bengaluru",
      comments = "",
      organizationName = "",
      countryName = "India",
      accessPurpose = "Evaluation", // "Demo" | "Evaluation"
    } = body;

    // Validate mandatory fields
    const missing = [];
    if (!contentID) missing.push("contentID");
    if (!startDate?.trim()) missing.push("startDate");
    if (!endDate?.trim()) missing.push("endDate");
    if (!timezone?.trim()) missing.push("timezone");
    if (!organizationName?.trim()) missing.push("organizationName");
    if (!countryName?.trim()) missing.push("countryName");
    if (!comments?.trim()) missing.push("comments");
    if (!accessPurpose?.trim()) missing.push("accessPurpose");

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Please fill all required fields: ${missing.join(", ")}`,
          missingFields: missing,
        },
        { status: 400 }
      );
    }

    // Validate that startDate is at least 2 days ahead of today
    const now = new Date();
    const minStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
    minStart.setHours(0, 0, 0, 0);

    const startParts = startDate.trim().split("-").map(Number);
    const endParts = endDate.trim().split("-").map(Number);

    if (startParts.length === 3) {
      const parsedStart = new Date(startParts[0], startParts[1] - 1, startParts[2]);
      parsedStart.setHours(0, 0, 0, 0);
      if (parsedStart < minStart) {
        return NextResponse.json(
          {
            success: false,
            message: "Preferred start date must be at least 2 days ahead of the present date.",
            field: "startDate",
          },
          { status: 400 }
        );
      }

      if (endParts.length === 3) {
        const parsedEnd = new Date(endParts[0], endParts[1] - 1, endParts[2]);
        parsedEnd.setHours(0, 0, 0, 0);
        if (parsedEnd < parsedStart) {
          return NextResponse.json(
            {
              success: false,
              message: "Preferred end date must be on or after the start date.",
              field: "endDate",
            },
            { status: 400 }
          );
        }
      }
    }

    const targetContent = await prisma.content.findUnique({
      where: { id: Number(contentID) },
    });

    if (!targetContent) {
      return NextResponse.json(
        { success: false, message: "Target product solution does not exist." },
        { status: 404 }
      );
    }

    // Determine user display info
    const userName = session.user.name || "Authenticated User";
    const userEmail = session.user.email.trim();
    const finalOrg = organizationName.trim();
    const finalCountry = countryName.trim();

    // Format today's date (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];
    const finalStartDate = startDate.trim() || today;
    const finalEndDate = endDate.trim();

    // Format purpose with comments
    const purposeTag = accessPurpose ? `[Purpose: ${accessPurpose}] ` : "";
    const finalComments = `${purposeTag}${comments.trim()}`;

    // Create record in requesteduserlist
    const created = await prisma.requesteduserlist.create({
      data: {
        userName,
        userEmail,
        organizationName: finalOrg,
        countryName: finalCountry,
        timezone,
        comments: finalComments,
        contentID: String(targetContent.id),
        contentIdKey: targetContent.idKey || "",
        requestedDate: today,
        startDate: finalStartDate,
        endDate: finalEndDate,
        userAccessKeys: "",
        otp: "",
        otpTime: "",
        status: "requested",
        adminComment: "",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Request for "${targetContent.head}" successfully submitted!`,
      requestId: created.id,
      request: created,
    });
  } catch (error) {
    console.error("User Requests POST API Error:", error);
    return NextResponse.json(
      { success: false, message: "Submission failed: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/requests?id=123
 * Allows users to reverse/cancel their decision and withdraw their lab request.
 */
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    const targetId = Number(idParam);

    if (!idParam || isNaN(targetId)) {
      return NextResponse.json(
        { success: false, message: "Valid request ID is required." },
        { status: 400 }
      );
    }

    const userEmail = session.user.email.trim().toLowerCase();

    // Verify request belongs to the authenticated user
    const existing = await prisma.requesteduserlist.findUnique({
      where: { id: targetId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Request record not found." },
        { status: 404 }
      );
    }

    if (existing.userEmail.trim().toLowerCase() !== userEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden: You cannot cancel another user's request.",
        },
        { status: 403 }
      );
    }

    // Delete the request from requesteduserlist
    await prisma.requesteduserlist.delete({
      where: { id: targetId },
    });

    return NextResponse.json({
      success: true,
      message: `Request #${targetId} was successfully cancelled and withdrawn.`,
    });
  } catch (error) {
    console.error("User Requests DELETE API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel request: " + error.message },
      { status: 500 }
    );
  }
}

