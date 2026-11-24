import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FullCardSelection } from "@/components/sections/barrel-carousel-section";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsStrip } from "@/components/sections/stats-strip";
import { AsymmetricBento } from "@/components/sections/asymmetric-bento";
import { OemShowcase } from "@/components/sections/oem-showcase";
import { SpecializedBento } from "@/components/sections/specialized-bento";
import { AudienceBenefits } from "@/components/sections/audience-benefits";
import { StacksExplorer } from "@/components/sections/stacks-explorer";
import { AcceleratorsSection } from "@/components/sections/accelerators-section";
import { InsightsSection } from "@/components/sections/insights-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ScrollEffects } from "@/components/ui/scroll-effects";
import { AmbientTelemetry } from "@/components/ui/ambient-telemetry";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-clip bg-transparent text-foreground transition-colors duration-900">
      <ScrollEffects />
      <Navbar />

      {/* Interactive Outer Side Gutters: Ambient Telemetry & Navigation Orbit */}
      {/* <AmbientTelemetry /> */}

      <main className="flex-1">
        {/* 1. Hero Section with dynamic tag search */}
        <HeroSection />
        {/* 0. Full Card Selection Section */}
        <FullCardSelection />



        {/* 2 & 3. COE Success Over 2+ Years & COE Engagement (with 1s count-up animations) */}
        <StatsStrip />

        {/* 4. Asymmetric Bento Grid (Modern 12-col interactive showcase filling empty space) */}
        <AsymmetricBento />

        {/* 5. OEM's Directory with snappy auto-scroll carousel */}
        <OemShowcase />

        {/* 6. Specialized Stacks */}
        <SpecializedBento />

        {/* 7. iVCoE Advantages (Enterprises, Partners, OEMs) */}
        <AudienceBenefits />

        {/* 8. iValue Stacks (34 Complete Stacks with search & deep dive modals) */}
        <StacksExplorer />

        {/* 9. Accelerators (Revenue Multipliers) */}
        <AcceleratorsSection />

        {/* 10. Cyber Security News */}
        <InsightsSection />

        {/* 11. Contact Us & Interactive Map */}
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
