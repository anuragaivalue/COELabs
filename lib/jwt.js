import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "fallback_coelabs_jwt_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Signs a JSON Web Token (JWT) with user claims for authentication & authorization.
 * @param {object} payload - Claims object { sub, email, name, role, provider, ... }
 * @param {object} options - Additional jwt.sign options
 * @returns {string} Signed JWT string
 */
export function signJwtToken(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    ...options,
  });
}

/**
 * Verifies and decodes a JSON Web Token (JWT).
 * @param {string} token - Signed JWT string
 * @returns {object|null} Decoded payload or null if invalid/expired
 */
export function verifyJwtToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
}
