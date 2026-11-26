"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  // NextAuth active session check
  const { data: session, status } = useSession();

  // Track active authentication provider
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [actionErrorMsg, setActionErrorMsg] = useState("");
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");

  // Derive error message from query params if NextAuth redirected with error
  const errorParam = searchParams.get("error");
  let queryErrorMsg = "";
  if (errorParam) {
    if (errorParam === "OAuthSignin" || errorParam === "OAuthCallback") {
      queryErrorMsg = "Google Sign-In was cancelled or failed to verify credentials.";
    } else if (errorParam === "AccessDenied") {
      queryErrorMsg = "Access denied. Please use an authorized Google account.";
    } else if (errorParam === "Configuration") {
      queryErrorMsg = "Google OAuth is not configured yet. Please check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.";
    } else {
      queryErrorMsg = `Authentication error (${errorParam}). Please try again.`;
    }
  }

  const displayErrorMsg = actionErrorMsg || queryErrorMsg;
  const displaySuccessMsg =
    actionSuccessMsg ||
    (status === "authenticated" && session?.user
      ? `Signed in as ${session.user.name || session.user.email}. Redirecting...`
      : "");

  // Helper to determine destination based on userType/role
  const getDestinationByRole = (roleOrType, targetReturnUrl) => {
    const isAdmin = roleOrType === "admin";
    if (!targetReturnUrl || targetReturnUrl === "/" || targetReturnUrl === "/login") {
      return isAdmin ? "/dashboard/admin" : "/dashboard/user";
    }
    // Security check: non-admin attempting to access admin route is diverted to user dashboard
    if (targetReturnUrl.startsWith("/dashboard/admin") && !isAdmin) {
      return "/dashboard/user";
    }
    return targetReturnUrl;
  };

  // Sync NextAuth authenticated session to localStorage and handle role-based redirection
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      try {
        if (session.token) {
          localStorage.setItem("ivalue_auth_token", session.token);
        }
        localStorage.setItem("ivalue_auth_user", JSON.stringify(session.user));
      } catch {
        // Ignore localStorage restrictions
      }

      const userType = session.user.userType || session.user.role || "user";
      const targetDestination = getDestinationByRole(userType, returnUrl);

      const timer = setTimeout(() => {
        router.push(targetDestination);
      }, 700);
      return () => clearTimeout(timer);
    }

    // Check pre-existing token in localStorage if unauthenticated
    if (status === "unauthenticated") {
      try {
        const storedToken = localStorage.getItem("ivalue_auth_token");
        const storedUser = localStorage.getItem("ivalue_auth_user");
        if (storedToken && storedUser) {
          const parsed = JSON.parse(storedUser);
          const userType = parsed.userType || parsed.role || "user";
          const targetDestination = getDestinationByRole(userType, returnUrl);

          const timer = setTimeout(() => {
            router.push(targetDestination);
          }, 800);
          return () => clearTimeout(timer);
        }
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [session, status, router, returnUrl]);

  // Handle Microsoft Sign-In (?provider=microsoft)
  const handleMicrosoftLogin = async (e) => {
    e.preventDefault();
    if (loadingProvider) return;

    setActionErrorMsg("");
    setActionSuccessMsg("");
    setLoadingProvider("microsoft");

    try {
      const res = await fetch("/api/auth/microsoft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnUrl }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionErrorMsg(data.message || "Failed to authenticate with Microsoft. Please try again.");
        setLoadingProvider(null);
        return;
      }

      setActionSuccessMsg("Microsoft Single Sign-On verified. Redirecting...");

      if (typeof window !== "undefined") {
        localStorage.setItem("ivalue_auth_token", data.token);
        localStorage.setItem("ivalue_auth_user", JSON.stringify(data.user));
      }

      const userType = data.user.userType || data.user.role || "user";
      const targetDestination = getDestinationByRole(userType, returnUrl);

      setTimeout(() => {
        router.push(targetDestination);
      }, 800);
    } catch (err) {
      console.error("Microsoft login error:", err);
      setActionErrorMsg("Failed to initiate Microsoft Single Sign-On. Please try again.");
      setLoadingProvider(null);
    }
  };

  // Handle Google Sign-In with NextAuth (OAuth 2.0 + JWT + Prisma MySQL DB)
  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    if (loadingProvider) return;

    setActionErrorMsg("");
    setActionSuccessMsg("");
    setLoadingProvider("google");

    try {
      // Role-aware callbackUrl: /dashboard routes admin to /dashboard/admin and user to /dashboard/user
      const callbackTarget =
        !returnUrl || returnUrl === "/" || returnUrl === "/login"
          ? "/dashboard"
          : returnUrl;

      await signIn("google", {
        callbackUrl: callbackTarget,
      });
    } catch (err) {
      console.error("Google login error:", err);
      setActionErrorMsg("Failed to initiate Google Sign-In. Please check your credentials.");
      setLoadingProvider(null);
    }
  };

  const isAnyLoading = loadingProvider !== null || status === "loading";

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-foreground transition-colors duration-900 w-full overflow-x-hidden">
      <Navbar />

      {/* Scoped Strict Icon Constraints */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .login-btn-icon,
            .login-btn-icon svg {
              width: 18px !important;
              height: 18px !important;
              min-width: 18px !important;
              min-height: 18px !important;
              max-width: 18px !important;
              max-height: 18px !important;
              display: block !important;
              flex-shrink: 0 !important;
            }
          `
        }}
      />

      <main id="main" className="flex-1 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient Gradient Backgrounds matching MAIN site structure */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.12),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.06),transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.10),transparent_60%)]" />

        {/* Login Section Container */}
        <section className="w-full py-16 sm:py-24 px-4 sm:px-6 relative z-10 flex flex-col items-center justify-center my-auto">
          <div className="w-full max-w-[500px] mx-auto">
            {/* Glass Card mirroring MAIN site structure */}
            <div className="w-full rounded-2xl sm:rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white/95 dark:bg-[#141416] p-8 sm:p-10 shadow-2xl backdrop-blur-xl transition-all duration-300">
              
              {/* Exact Heading from MAIN site */}
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-3 text-center font-display">
                Sign In
              </h2>

              {/* Exact Subtitle from MAIN site */}
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 mb-8 text-center font-sans">
                Choose your authentication method to access iValue{" "}
                <span className="text-amber-700 dark:text-amber-400 font-semibold">CoE</span>
              </p>

              {/* Feedback States */}
              {displayErrorMsg && !isAnyLoading && (
                <div className="mb-6 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50/80 dark:bg-red-500/10 p-3.5 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-400 animate-in fade-in-50 duration-200">
                  <AlertCircle
                    className="w-4 h-4 min-w-[16px] min-h-[16px] text-red-600 dark:text-red-400 shrink-0 mt-0.5"
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span className="leading-snug">{displayErrorMsg}</span>
                </div>
              )}

              {displaySuccessMsg && !isAnyLoading && (
                <div className="mb-6 rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-500/10 p-3.5 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in-50 duration-200">
                  <CheckCircle2
                    className="w-4 h-4 min-w-[16px] min-h-[16px] text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span className="leading-snug font-medium">{displaySuccessMsg}</span>
                </div>
              )}

              {/* Login Options Container */}
              <div className="flex flex-col gap-3">
                
                {/* Microsoft Login Button */}
                <button
                  type="button"
                  onClick={handleMicrosoftLogin}
                  disabled={isAnyLoading}
                  aria-disabled={isAnyLoading}
                  className={`h-11 sm:h-12 w-full inline-flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium tracking-wide transition-all duration-200 cursor-pointer no-underline overflow-hidden select-none ${
                    loadingProvider === "microsoft"
                      ? "ring-2 ring-amber-500 border-amber-500 bg-amber-50/60 dark:bg-amber-500/15 text-amber-900 dark:text-amber-200"
                      : isAnyLoading
                      ? "border-neutral-200 dark:border-white/10 opacity-40 bg-neutral-50 dark:bg-neutral-900 text-neutral-400 pointer-events-none"
                      : "border-neutral-200/90 dark:border-white/15 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 hover:border-amber-500/70 dark:hover:border-amber-400/70 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/80 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  {loadingProvider === "microsoft" ? (
                    <>
                      <Loader2
                        className="w-4 h-4 min-w-[16px] min-h-[16px] animate-spin text-amber-600 dark:text-amber-400 shrink-0"
                        style={{ width: "16px", height: "16px" }}
                      />
                      <span className="truncate whitespace-nowrap">Signing in with Microsoft...</span>
                    </>
                  ) : (
                    <>
                      {/* Microsoft 4-Color Icon */}
                      <span
                        className="login-btn-icon inline-flex items-center justify-center shrink-0"
                        style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px", maxWidth: "18px", maxHeight: "18px" }}
                      >
                        <svg
                          width="18"
                          height="18"
                          className="shrink-0 block"
                          style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px", maxWidth: "18px", maxHeight: "18px" }}
                          viewBox="0 0 21 21"
                          fill="none"
                        >
                          <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                          <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                          <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                          <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                        </svg>
                      </span>
                      <span className="truncate whitespace-nowrap">Sign in with Microsoft</span>
                    </>
                  )}
                </button>

                {/* Google Login Button (NextAuth Google Provider) */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isAnyLoading}
                  aria-disabled={isAnyLoading}
                  className={`h-11 sm:h-12 w-full inline-flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium tracking-wide transition-all duration-200 cursor-pointer no-underline overflow-hidden select-none ${
                    loadingProvider === "google"
                      ? "ring-2 ring-amber-500 border-amber-500 bg-amber-50/60 dark:bg-amber-500/15 text-amber-900 dark:text-amber-200"
                      : isAnyLoading
                      ? "border-neutral-200 dark:border-white/10 opacity-40 bg-neutral-50 dark:bg-neutral-900 text-neutral-400 pointer-events-none"
                      : "border-neutral-200/90 dark:border-white/15 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 hover:border-amber-500/70 dark:hover:border-amber-400/70 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/80 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  {loadingProvider === "google" ? (
                    <>
                      <Loader2
                        className="w-4 h-4 min-w-[16px] min-h-[16px] animate-spin text-amber-600 dark:text-amber-400 shrink-0"
                        style={{ width: "16px", height: "16px" }}
                      />
                      <span className="truncate whitespace-nowrap">Signing in with Google...</span>
                    </>
                  ) : (
                    <>
                      {/* Official Google 4-Color Icon */}
                      <span
                        className="login-btn-icon inline-flex items-center justify-center shrink-0"
                        style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px", maxWidth: "18px", maxHeight: "18px" }}
                      >
                        <svg
                          width="18"
                          height="18"
                          className="shrink-0 block"
                          style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px", maxWidth: "18px", maxHeight: "18px" }}
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                      </span>
                      <span className="truncate whitespace-nowrap">Sign in with Google</span>
                    </>
                  )}
                </button>

              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#111113]">
          <Loader2 className="size-8 animate-spin text-amber-600" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
