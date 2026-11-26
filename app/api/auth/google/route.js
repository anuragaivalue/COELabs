import { NextResponse } from "next/server";

export async function GET(request) {
  // Redirect directly to NextAuth Google Sign-in flow
  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get("returnUrl") || "/";
  const callbackUrl = encodeURIComponent(returnUrl);

  return NextResponse.redirect(
    new URL(`/api/auth/signin/google?callbackUrl=${callbackUrl}`, request.url)
  );
}

export async function POST(request) {
  // For API callers initiating Google OAuth, return the redirect URL
  try {
    const body = await request.json().catch(() => ({}));
    const { returnUrl = "/" } = body;
    const callbackUrl = encodeURIComponent(returnUrl);

    return NextResponse.json({
      success: true,
      message: "Redirecting to NextAuth Google OAuth provider.",
      redirectUrl: `/api/auth/signin/google?callbackUrl=${callbackUrl}`,
    });
  } catch (error) {
    console.error("Google auth route error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process Google auth request." },
      { status: 500 }
    );
  }
}
