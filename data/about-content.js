export const aboutStats = [
  {
    id: "oem-partners",
    value: 75,
    suffix: "+",
    label: "Global OEM Partners",
    description: "Integrated Tier-1 cybersecurity, networking, IAM, and cloud infrastructure vendors."
  },
  {
    id: "blueprints",
    value: 120,
    suffix: "+",
    label: "Pre-Validated Blueprints",
    description: "Multi-vendor architectures mapped to NIST, ISO 27001, PCI-DSS, and CIS Controls."
  },
  {
    id: "uptime",
    value: 99.99,
    suffix: "%",
    label: "Lab Availability Uptime",
    description: "24/7 high-availability compute, dedicated simulation racks, and continuous synthetic tests."
  },
  {
    id: "specialists",
    value: 150,
    suffix: "+",
    label: "Certified Solutions Architects",
    description: "Multi-domain certified specialists across Cloud, SOC, ZTNA, IAM, and DevSecOps."
  }
];

export const pillars = [
  {
    id: "proof-of-value",
    number: "01",
    tag: "Pre-Procurement",
    title: "Proof of Value Pre-RFP",
    shortTitle: "Proof of Value",
    subtitle: "De-risk capital investments before issuing commercial RFPs.",
    description:
      "Enterprise architectures should never be purchased on paper claims. The iValue CoE enables enterprises to simulate realistic enterprise traffic, test boundary conditions, and rigorously benchmark interoperability against legacy stacks before formal procurement.",
    features: [
      "Real-world synthetic workload & throughput injection",
      "Objective multi-vendor benchmarking without vendor lock-in",
      "Holistic TCO & ROI financial modeling validation",
      "Granular gap analysis against target enterprise standards"
    ],
    metric: "40% Faster RFP Scoping",
    accent: "from-amber-500/20 to-orange-500/10"
  },
  {
    id: "multi-oem-interoperability",
    number: "02",
    tag: "Certified Engineering",
    title: "Certified Multi-OEM Interoperability",
    shortTitle: "Interoperability",
    subtitle: "Eliminate technology silos with certified multi-vendor blueprints.",
    description:
      "Modern cybersecurity cannot function in isolated brand silos. We engineer and stress-test cohesive multi-stack solutions—unifying endpoint detection, identity governance, zero-trust network access, and cloud workload protection under single-pane observability.",
    features: [
      "Cross-vendor API orchestration and automated playbooks",
      "Unified telemetry ingestion across SIEM, SOAR, and XDR",
      "Zero Trust continuous verification across hybrid environments",
      "Pre-tested vendor co-existence and backward compatibility"
    ],
    metric: "100% Interoperability Guarantee",
    accent: "from-blue-500/20 to-cyan-500/10"
  },
  {
    id: "simulation-lab",
    number: "03",
    tag: "Live Testbed",
    title: "High-Fidelity Simulation Lab",
    shortTitle: "Simulation Lab",
    subtitle: "Enterprise-grade cyber range and sovereign cloud simulation.",
    description:
      "Our state-of-the-art physical and virtualized facilities provide isolated sandbox environments, bare-metal hardware appliances, and direct interconnects to all major hyperscalers, recreating complex enterprise topologies without risk to production.",
    features: [
      "Isolated cyber range for adversary emulation & red-teaming",
      "Hardware HSM, PKI, and cryptographic vault benchmarking",
      "Bare-metal compute clusters and virtualized hypervisors",
      "Direct low-latency pipes to AWS, Microsoft Azure, and GCP"
    ],
    metric: "Zero Production Risk",
    accent: "from-emerald-500/20 to-teal-500/10"
  },
  {
    id: "partner-enablement",
    number: "04",
    tag: "Channel Acceleration",
    title: "Partner Ecosystem Enablement",
    shortTitle: "Partner Enablement",
    subtitle: "Empowering channel partners with live demonstration capabilities.",
    description:
      "We bridge the capability divide for system integrators and value-added resellers. By providing on-demand access to live PoC testbeds, architecture masterclasses, and co-selling advisory, we empower partners to win higher-margin enterprise engagements.",
    features: [
      "Dedicated multi-tenant demo pods with rapid provisioning",
      "Hands-on architectural enablement and technical bootcamps",
      "Joint technical defense and complex RFP response modules",
      "Value-added solution packaging over commodity resale"
    ],
    metric: "3.2x Partner Deal Velocity",
    accent: "from-purple-500/20 to-pink-500/10"
  }
];

export const leadership = [
  {
    name: "Shrikant Shitole",
    role: "Chief Executive Officer (CEO)",
    experience: "28+ Years Experience",
    bio: "Pioneering enterprise growth, regional expansion, and strategic OEM alliances across APAC and Middle East markets, establishing iValue as the authoritative aggregator for transformative cybersecurity technologies.",
    specialties: ["Strategic OEM Alliances", "Enterprise Strategy", "Global Market Scaling"],
    avatar: "SS",
    color: "bg-amber-500/10 text-amber-700 dark:text-orange-400 border-amber-500/30"
  },
  {
    name: "Krishna Raj Sharma",
    role: "Director & Chief Technology Officer (CTO)",
    experience: "25+ Years Experience",
    bio: "A visionary technologist leading the engineering architecture of the Center of Excellence, specializing in multi-cloud governance, high-resilience infrastructure, and sovereign cryptography.",
    specialties: ["Multi-Cloud Security", "Zero Trust Architecture", "Cryptographic Infrastructure"],
    avatar: "KS",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30"
  },
  {
    name: "Ramesh Shanmugam",
    role: "Executive Director & Head of Solutions Architecture",
    experience: "22+ Years Experience",
    bio: "Directing iValue's technical advisory practice, cross-vendor solution validations, and complex enterprise migration frameworks for leading BFSI, Telecom, and Government entities.",
    specialties: ["SOC & Incident Response", "SASE & ZTNA Deployment", "Regulatory Compliance (PCI/ISO)"],
    avatar: "RS",
    color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
  },
  {
    name: "Malini Rao",
    role: "Vice President, Cybersecurity & PoC Engineering",
    experience: "20+ Years Experience",
    bio: "Global cybersecurity veteran orchestrating the CoE live testbeds, adversary simulation ranges, threat hunting frameworks, and continuous OEM technology interoperability programs.",
    specialties: ["Adversary Emulation", "Threat Modeling", "Cloud Native Defense"],
    avatar: "MR",
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30"
  }
];

export const labCapabilities = [
  {
    id: "bare-metal",
    title: "Bare-Metal Compute & Storage Clusters",
    badge: "Compute & Virtualization",
    description:
      "Enterprise-grade high-density server nodes, multi-hypervisor fabrics (VMware ESXi, Nutanix AHV, KVM), and ultra-fast NVMe storage tiers engineered to mirror large-scale corporate data centers.",
    specs: [
      "Dual Intel Xeon Platinum & AMD EPYC High-Density Racks",
      "Over 12 Terabytes of ECC DDR5 High-Speed Memory",
      "Sub-millisecond NVMe All-Flash Distributed SAN Fabric",
      "Air-gapped L2/L3 Network Topologies with Programmable Spine-Leaf"
    ],
    icon: "Server"
  },
  {
    id: "cyber-range",
    title: "Isolated Cyber Range & Adversary Sandboxes",
    badge: "Security & Simulation",
    description:
      "Safe, fully isolated testing arenas to execute weaponized attack scenarios, automated MITRE ATT&CK adversary emulation, and live breach-and-attack simulations without collateral risk.",
    specs: [
      "Dynamic synthetic enterprise network traffic generation",
      "Automated MITRE ATT&CK adversary emulation playbooks",
      "Decoy honeygrid infrastructure & deceptive counter-telemetry",
      "High-speed line-rate packet capture and digital forensics suite"
    ],
    icon: "ShieldAlert"
  },
  {
    id: "hsm-vaults",
    title: "Hardware HSM & Key Management Vaults",
    badge: "Cryptography & PKI",
    description:
      "FIPS 140-2 Level 3 certified physical Hardware Security Modules and centralized enterprise KMS architectures, facilitating quantum-safe encryption, tokenization, and code-signing PoCs.",
    specs: [
      "FIPS 140-2 Level 3 physical HSM appliances for cryptographic isolation",
      "Centralized multi-cloud Key Management Service (KMS) validation",
      "Post-quantum cryptography (PQC) readiness & algorithm stress testing",
      "Database column-level encryption & high-performance tokenization"
    ],
    icon: "KeyRound"
  },
  {
    id: "multi-cloud",
    title: "Multi-Cloud Hybrid Interconnects",
    badge: "Cloud & Connectivity",
    description:
      "Dedicated high-bandwidth, low-latency direct connections linking the physical CoE lab directly into AWS, Microsoft Azure, Google Cloud, and sovereign regional clouds.",
    specs: [
      "Direct AWS Direct Connect & Azure ExpressRoute multi-gigabit pipes",
      "Google Cloud Dedicated Interconnect with failover mesh",
      "SD-WAN multi-path dynamic routing with QoS policy enforcement",
      "Micro-segmented virtual routing instances (VRF) per PoC tenant"
    ],
    icon: "CloudCog"
  }
];

const aboutContent = {
  aboutStats,
  pillars,
  leadership,
  labCapabilities
};

export default aboutContent;
