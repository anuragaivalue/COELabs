import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AboutSections } from "@/components/about/about-sections";

export const metadata = {
  title: "About Us | iValue Center of Excellence (CoE)",
  description:
    "Explore iValue Group's Center of Excellence: Asia's premier multi-vendor cybersecurity, hybrid cloud, and sovereign infrastructure validation testbed.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-foreground transition-colors duration-900">
      <Navbar />
      <main className="flex-1">
        <AboutSections />
      </main>
      <Footer />
    </div>
  );
}
