import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { returnUrl = "/" } = body;

    // Simulate Google Workspace / Google Cloud Identity OAuth token exchange
    await new Promise((resolve) => setTimeout(resolve, 500));

    const userProfile = {
      id: `usr_goog_${Math.random().toString(36).substring(2, 9)}`,
      email: "user@ivaluegroup.com",
      name: "Google Workspace Authenticated User",
      role: "Enterprise Solutions Architect",
      provider: "google_workspace",
      domain: "ivaluegroup.com",
      authenticatedAt: new Date().toISOString()
    };

    const token = `iv_goog_${Buffer.from(JSON.stringify(userProfile)).toString("base64")}`;

    const response = NextResponse.json(
      {
        success: true,
        message: "Google Workspace Single Sign-On successful.",
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
    console.error("Google auth error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to authenticate via Google Workspace. Please try again."
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  // Direct redirect handler if invoked via GET (?provider=google)
  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get("returnUrl") || "/";

  // Simulate Google Workspace OAuth redirection handshake
  const userProfile = {
    id: `usr_goog_${Math.random().toString(36).substring(2, 9)}`,
    email: "user@ivaluegroup.com",
    name: "Google Workspace User",
    role: "Enterprise Solutions Architect",
    provider: "google_workspace",
    domain: "ivaluegroup.com",
    authenticatedAt: new Date().toISOString()
  };

  const token = `iv_goog_${Buffer.from(JSON.stringify(userProfile)).toString("base64")}`;

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
