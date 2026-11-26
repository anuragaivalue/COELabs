import { getToken } from "next-auth/jwt";
import { verifyJwtToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

/**
 * Middleware/helper function to verify JWT authentication and enforce role-based authorization.
 *
 * @param {Request} request - Next.js Request object
 * @param {Array<string>} [allowedRoles=[]] - List of authorized roles (e.g. ['admin', 'Enterprise Solutions Architect']).
 *                                            If empty, any valid authenticated user is authorized.
 * @returns {Promise<{ authorized: boolean, user?: object, response?: NextResponse }>}
 */
export async function authorizeRequest(request, allowedRoles = []) {
  try {
    // 1. Check NextAuth JWT session cookie
    const nextAuthToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (nextAuthToken) {
      const userRole = nextAuthToken.role || "user";
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return {
          authorized: false,
          response: NextResponse.json(
            { success: false, message: "Forbidden: Insufficient privileges." },
            { status: 403 }
          ),
        };
      }
      return { authorized: true, user: nextAuthToken };
    }

    // 2. Check Bearer Authorization header for custom JWT
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const rawToken = authHeader.substring(7);
      const decoded = verifyJwtToken(rawToken);

      if (decoded) {
        const userRole = decoded.role || "user";
        if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
          return {
            authorized: false,
            response: NextResponse.json(
              { success: false, message: "Forbidden: Insufficient privileges." },
              { status: 403 }
            ),
          };
        }
        return { authorized: true, user: decoded };
      }
    }

    // 3. Unauthorized
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized: Missing or invalid authentication token." },
        { status: 401 }
      ),
    };
  } catch (error) {
    console.error("Authorization check error:", error);
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: "Internal server error during authorization check." },
        { status: 500 }
      ),
    };
  }
}
