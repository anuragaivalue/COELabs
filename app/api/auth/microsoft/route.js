import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { returnUrl = "/" } = body;

    // Simulate Microsoft Entra ID (Azure AD) OAuth token exchange & tenant validation
    await new Promise((resolve) => setTimeout(resolve, 500));

    const userProfile = {
      id: `usr_ms_${Math.random().toString(36).substring(2, 9)}`,
      email: "user@ivaluegroup.com",
      name: "Microsoft Authenticated User",
      role: "user",
      provider: "microsoft_entra_id",
      tenantId: "ivalue-corporate-tenant",
      authenticatedAt: new Date().toISOString()
    };

    const token = `iv_ms_${Buffer.from(JSON.stringify(userProfile)).toString("base64")}`;

    // Synchronize Microsoft login into userlist table
    try {
      const userEmail = userProfile.email;
      const userName = userProfile.name;
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const existingRows = await prisma.$queryRaw`
        SELECT id, userType FROM userlist WHERE email = ${userEmail} LIMIT 1
      `;

      if (!existingRows || existingRows.length === 0) {
        // Fresh/new user login -> userType is 'user'
        await prisma.$executeRaw`
          INSERT INTO userlist (email, name, userType, provider, profileImage, accessToken, accessTillDate)
          VALUES (${userEmail}, ${userName}, 'user', 'microsoft', '', ${token}, ${expiryDate})
        `;
      } else {
        const currentUserType = existingRows[0]?.userType || "user";
        await prisma.$executeRaw`
          UPDATE userlist
          SET name = ${userName}, userType = ${currentUserType}, provider = 'microsoft', accessToken = ${token}
          WHERE email = ${userEmail}
        `;
      }
    } catch (syncErr) {
      console.warn("Could not sync Microsoft user to userlist:", syncErr.message);
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "Microsoft Single Sign-On successful.",
        user: userProfile,
        token,
        redirectUrl: returnUrl
      },
      { status: 200 }
    );

    response.cookies.set("ivalue_auth_token", token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    return response;
  } catch (error) {
    console.error("Microsoft auth error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to authenticate via Microsoft Entra ID. Please try again."
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  // Direct redirect handler if invoked via GET (?provider=microsoft)
  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get("returnUrl") || "/";

  // Simulate Microsoft OAuth redirection handshake
  const userProfile = {
    id: `usr_ms_${Math.random().toString(36).substring(2, 9)}`,
    email: "user@ivaluegroup.com",
    name: "Microsoft Corporate User",
    role: "Solutions Architect",
    provider: "microsoft_entra_id",
    tenantId: "ivalue-corporate-tenant",
    authenticatedAt: new Date().toISOString()
  };

  const token = `iv_ms_${Buffer.from(JSON.stringify(userProfile)).toString("base64")}`;

  const response = NextResponse.redirect(new URL(returnUrl, request.url));
  response.cookies.set("ivalue_auth_token", token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  return response;
}
