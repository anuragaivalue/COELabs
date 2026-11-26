import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Next.js Edge Security Middleware
 * Restricts sensitive pages and APIs, enforcing authentication and role-based access control.
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Retrieve and verify the NextAuth JWT token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const userType = token?.userType || token?.role || "user";

  // 1. API Route Protection for /api/admin
  if (pathname.startsWith("/api/admin")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }
    if (userType !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden. Admin privileges required." },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  // 2. Restricted Pages Protection: require active authentication
  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin");

  if (isProtectedPage && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Strict Admin-Only Route Enforcement
  const isAdminPage =
    pathname.startsWith("/dashboard/admin") ||
    pathname.startsWith("/admin");

  if (isAdminPage && userType !== "admin") {
    // Normal users attempting to access admin routes are safely redirected to user dashboard
    const userDashboardUrl = new URL("/dashboard/user", request.url);
    userDashboardUrl.searchParams.set("error", "AccessDenied");
    return NextResponse.redirect(userDashboardUrl);
  }

  // 4. Convenience route /dashboard -> redirects to role-appropriate dashboard
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    if (userType === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard/user", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
