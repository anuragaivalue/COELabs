/**
 * OEM Ecosystem Content & Value Proposition Dataset
 * Powers the top OEM Intro section and bottom Closing CTA on /oem
 */

export const oemIntroContent = {
  badge: "Certified Technology Ecosystem",
  title: "Leading Technology OEM Partners",
  subtitle:
    "Discover certified global OEMs powering the iValue Center of Excellence solution stacks. Pre-integrated, multi-brand blueprints tested in live lab environments.",
  
  // 3 Core Value Propositions for Technology OEMs
  valueProps: [
    {
      id: "lab-interoperability",
      title: "Lab Interoperability",
      tagline: "Live Multi-Vendor Testbeds",
      description:
        "Prove your technology operates flawlessly in enterprise-grade, bare-metal clusters alongside leading perimeter, identity, and cloud stacks.",
      badge: "Pre-RFP Validation",
      icon: "Cpu",
      metric: "100% Lab Verified",
      metricSub: "Zero Integration Glitches",
      features: [
        "Pre-integrated API telemetry & syslog pipelines",
        "Isolated cyber range for attack surface defense",
        "Bare-metal clusters with multi-cloud interconnects",
        "Deterministic benchmark & stress-testing reports"
      ]
    },
    {
      id: "joint-gtm",
      title: "Joint GTM (Go-to-Market)",
      tagline: "Channel Velocity & Commercial Scale",
      description:
        "Directly connect your product portfolio to tier-1 enterprise customers, system integrators, and 6,000+ certified channel partners.",
      badge: "Regional Expansion",
      icon: "TrendingUp",
      metric: "6,000+ Partners",
      metricSub: "Across India, SAARC & SEA",
      features: [
        "Executive POC briefings in state-of-the-art CoE facilities",
        "Co-branded demand generation & joint architecture briefs",
        "Pre-sales technical enablement for partner engineering teams",
        "Fast-tracked commercial procurement & distribution"
      ]
    },
    {
      id: "enterprise-blueprints",
      title: "Enterprise Blueprints",
      tagline: "Production-Grade Solution Stacks",
      description:
        "Co-engineer validated multi-OEM blueprints that address complex enterprise mandates across Zero Trust, SASE, Cloud SecOps, and Data Governance.",
      badge: "Turnkey Architectures",
      icon: "Layers",
      metric: "40+ Blueprints",
      metricSub: "Audited & Certified",
      features: [
        "Validated reference architectures with Terraform baselines",
        "Regulatory compliance mappings (DPDP, RBI, ISO 27001)",
        "Pre-calculated TCO & multi-currency financial models",
        "One-click hands-on sandbox provisioning for prospects"
      ]
    }
  ],

  // Key Ecosystem Telemetry
  stats: [
    { label: "Global OEM Partners", value: "25+" },
    { label: "Lab-Verified Solutions", value: "62+" },
    { label: "Channel Partner Reach", value: "6,000+" },
    { label: "Pre-RFP Lab Uptime", value: "99.98%" }
  ],

  // Closing Section Data
  closing: {
    badge: "Scale with iValue CoE",
    // Exact headline required by spec
    headline: "Build Once. Sell Everywhere. Scale with iValue CoE.",
    subheadline:
      "Join the world's premier cybersecurity and enterprise cloud infrastructure OEMs. Co-engineer multi-vendor blueprints, eliminate customer POC friction, and accelerate regional pipeline conversion.",
    primaryCta: {
      label: "Apply for OEM Partnership",
      href: "/contact?type=oem_partnership"
    },
    secondaryCta: {
      label: "Explore Solutions Marketplace",
      href: "/portal/marketplace#solutions-stack"
    },
    proofPoints: [
      "Zero-cost laboratory validation for certified OEM partners",
      "Direct GTM alignment with regional enterprise sales teams",
      "Featured placement in customer-facing CoE Briefing Centers"
    ]
  }
};

export default oemIntroContent;
