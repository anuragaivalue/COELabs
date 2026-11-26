
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { signJwtToken } from "@/lib/jwt";

// ==========================================
// GOOGLE OAUTH CONFIGURATION
// ==========================================

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim() || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() || "";

// ==========================================
// NEXTAUTH CONFIGURATION
// ==========================================

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  // ==========================================
  // AUTHENTICATION CALLBACKS
  // ==========================================

  callbacks: {
    // ------------------------------------------
    // GOOGLE SIGN-IN & DATABASE SYNCHRONIZATION
    // ------------------------------------------

    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          if (user?.email) {
            // Fresh/new user always defaults to "user" role
            const role = "user";

            // Find existing user
            const existingUser = await prisma.user.findUnique({
              where: {
                email: user.email,
              },
            });

            let dbUserId = existingUser?.id;

            // Create new user if not found
            if (!existingUser) {
              const newUser = await prisma.user.create({
                data: {
                  name: user.name || profile?.name || "Google User",
                  email: user.email,
                  image: user.image || profile?.picture,
                  role: role,
                  provider: "google",
                  emailVerified: new Date(),
                },
              });

              dbUserId = newUser.id;
            } else {
              // Update existing user
              await prisma.user.update({
                where: {
                  email: user.email,
                },
                data: {
                  name: user.name || existingUser.name,
                  image: user.image || existingUser.image,
                  updatedAt: new Date(),
                },
              });
            }

            // Store or update Google OAuth account
            if (dbUserId && account.providerAccountId) {
              await prisma.account.upsert({
                where: {
                  provider_providerAccountId: {
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                  },
                },

                update: {
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  id_token: account.id_token,
                  scope: account.scope,
                  session_state: account.session_state,
                },

                create: {
                  userId: dbUserId,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  id_token: account.id_token,
                  scope: account.scope,
                  session_state: account.session_state,
                },
              });
            }

            // Also store or update user in the existing ivaluecoe 'userlist' table
            try {
              const userEmail = user.email;
              const userName = user.name || profile?.name || "Google User";
              const profileImg = user.image || profile?.picture || "";
              const tokenStr = account.access_token || account.id_token || "";
              const expiryDate = new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0];

              const existingRows = await prisma.$queryRaw`
                SELECT id, userType FROM userlist WHERE email = ${userEmail} LIMIT 1
              `;

              if (!existingRows || existingRows.length === 0) {
                // New / freshly logged-in user: userType is set to 'user'
                await prisma.$executeRaw`
                  INSERT INTO userlist (email, name, userType, provider, profileImage, accessToken, accessTillDate)
                  VALUES (${userEmail}, ${userName}, 'user', 'google', ${profileImg}, ${tokenStr}, ${expiryDate})
                `;
                console.log(
                  `[Database] Successfully inserted fresh Google user into userlist as 'user': ${userEmail}`
                );
              } else {
                // For existing user, preserve their userType or default to 'user'
                const currentUserType = existingRows[0]?.userType || "user";
                await prisma.$executeRaw`
                  UPDATE userlist
                  SET name = ${userName}, userType = ${currentUserType}, provider = 'google', profileImage = ${profileImg}, accessToken = ${tokenStr}
                  WHERE email = ${userEmail}
                `;
                console.log(
                  `[Database] Successfully updated Google user in userlist: ${userEmail}`
                );
              }
            } catch (ulErr) {
              console.error("[Database] Error syncing userlist table:", ulErr);
            }
          }
        } catch (dbError) {
          console.warn(
            "Prisma database sync warning during Google sign-in:",
            dbError.message
          );

          // Continue authentication if database sync fails
        }
      }

      return true;
    },

    // ------------------------------------------
    // JWT TOKEN GENERATION
    // ------------------------------------------

    async jwt({ token, user, account }) {
      if (account && user) {
        token.userId = user.id;
        token.provider = account.provider;
      }

      // Fetch latest userType and details directly from database userlist table
      if (token?.email) {
        try {
          const rows = await prisma.$queryRaw`
            SELECT id, userType, provider FROM userlist WHERE email = ${token.email} LIMIT 1
          `;
          if (rows && rows.length > 0) {
            token.userType = rows[0].userType || "user";
            token.role = rows[0].userType || "user";
            if (rows[0].provider) {
              token.provider = rows[0].provider;
            }
          } else {
            token.userType = token.userType || token.role || "user";
            token.role = token.userType;
          }
        } catch (err) {
          console.warn("[Auth JWT] Could not fetch userType from userlist:", err.message);
          token.userType = token.userType || token.role || "user";
          token.role = token.userType;
        }

        // Generate signed custom JWT containing authorization claims
        try {
          token.jwtToken = signJwtToken({
            sub: token.userId || token.sub,
            email: token.email,
            name: token.name,
            role: token.userType || "user",
            userType: token.userType || "user",
            provider: token.provider || "google",
          });
        } catch (err) {
          console.error("Failed to sign custom JWT in jwt callback:", err);
        }
      }

      return token;
    },

    // ------------------------------------------
    // SESSION MANAGEMENT
    // ------------------------------------------

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId || token.sub;
        session.user.userType = token.userType || token.role || "user";
        session.user.role = token.userType || token.role || "user";
        session.user.provider = token.provider || "google";
        session.token = token.jwtToken;
      }

      return session;
    },
  },

  // ==========================================
  // CUSTOM AUTHENTICATION PAGES
  // ==========================================

  pages: {
    signIn: "/login",
    error: "/login",
  },

  // ==========================================
  // NEXTAUTH SECRET
  // ==========================================

  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
