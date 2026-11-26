import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SiteBackground } from "@/components/ui/site-background";
import { ParticleBackground } from "@/components/ui/particle-background";

export const metadata = {
  title: "iValue Group | Center of Excellence (COE) - Multistack Solutions",
  description:
    "Empowering digital transformation with unified multistack solutions, pre-validated blueprints, and hands-on PoC lab environments across Cloud, Security, IAM, and Compliance.",
  icons: {
    icon: "/assets/img/favicon.png",
    shortcut: "/assets/img/favicon.png",
    apple: "/assets/img/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=search"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-neutral-800 selection:text-white dark:selection:bg-neutral-200 dark:selection:text-neutral-900 relative">
        <ThemeProvider>
          <AuthProvider>
            <SiteBackground />
            <ParticleBackground />
            <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
