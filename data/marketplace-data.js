/**
 * iValue Center of Excellence - Marketplace Multi-OEM Stacks Dataset
 * Curated multi-vendor solution architectures with OEM tags, target verticals,
 * architecture descriptions, compliance controls, and executive summaries.
 */

export const MARKETPLACE_STACKS = [
  {
    id: "zero-trust-hybrid-defense",
    slug: "zero-trust-hybrid-defense",
    title: "Zero Trust Hybrid Defense Stack",
    shortTitle: "Zero Trust Defense",
    category: "Quantum & Network Security",
    targetVerticals: ["BFSI", "Fintech", "Enterprise IT", "Government"],
    tagline: "Unified perimeter, identity verification, continuous posture checking, and microsegmentation.",
    executiveSummary:
      "Engineered for highly regulated institutions, this blueprint eliminates implicit trust across campus, datacentre, and multi-cloud domains. By fusing Check Point perimeter inspection, CyberArk credential isolation, and Netskope SASE, enterprise security teams achieve continuous identity-first enforcement with sub-second threat containment.",
    architectureDescription:
      "A comprehensive multi-tier defense architecture integrating hardware-accelerated quantum firewalls at the perimeter, zero-trust network access (ZTNA) at the edge, and just-in-time privileged access gating for internal service endpoints. Traffic telemetry is continuously correlated with endpoint posture metrics before granting cryptographic workload access.",
    oems: [
      {
        name: "Check Point",
        role: "Quantum Perimeter Firewall & Zero-Day Threat Prevention",
        logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg",
        tier: "Strategic Global OEM"
      },
      {
        name: "CyberArk",
        role: "Privileged Access Security & Secrets Management",
        logo: "https://cdn.ivaluetv.com/oem/cyberark.svg",
        tier: "Strategic Global OEM"
      },
      {
        name: "Netskope",
        role: "Security Service Edge (SSE) & Cloud ZTNA",
        logo: "https://cdn.ivaluetv.com/oem/Netskope.svg",
        tier: "Certified Alliance Partner"
      },
      {
        name: "SentinelOne",
        role: "Singularity Autonomous Endpoint Detection & Rollback",
        logo: "https://cdn.ivaluetv.com/oem/SentinelOne.svg",
        tier: "Certified Alliance Partner"
      }
    ],
    controlReferences: [
      "IAM-02 Privileged Access Session Vaulting",
      "IAM-04 Adaptive Contextual MFA",
      "SOC-01 High-Volume Telemetry Ingestion",
      "SOC-04 Autonomous SOAR Playbooks",
      "SEC-09 Microsegmentation & Workload Isolation"
    ],
    complianceFrameworks: ["SEBI CSCRF", "RBI CSF", "CERT-In Directive", "DPDP Act 2023", "ISO 27001"],
    readinessStatus: "Production Certified",
    labValidated: true,
    benchmarkMultiplier: "4.5x faster incident containment"
  },
  {
    id: "cloud-secops-observability",
    slug: "cloud-secops-observability",
    title: "Cloud-Native SecOps & Observability Stack",
    shortTitle: "SecOps Observability",
    category: "Security Operations (SOC)",
    targetVerticals: ["Digital Natives", "SaaS Providers", "Fintech", "Telecom"],
    tagline: "Petabyte-scale telemetry correlation, real-time APM observability, and automated threat hunting.",
    executiveSummary:
      "Transforms raw distributed infrastructure telemetry into actionable security intelligence. Integrating Datadog cloud infrastructure monitoring with Google Cloud Chronicle and Splunk SIEM, this stack enables SecOps and DevOps teams to detect lateral movement, zero-day exfiltration, and service anomalies across complex Kubernetes and serverless environments in under 3 minutes.",
    architectureDescription:
      "Continuous streaming ingestion of VPC flow logs, cloud audit trails, container runtimes, and application metrics through Confluent Kafka pipelines into Chronicle's petabyte-scale search engine. Real-time correlation against Mandiant threat intelligence feeds generates contextualized security alerts mapped to the MITRE ATT&CK matrix.",
    oems: [
      {
        name: "Datadog",
        role: "Cloud Infrastructure APM, Synthetics & SecOps Telemetry",
        logo: "/assets/img/oems/datadog.svg",
        logoDark: "/assets/img/oems/datadog-dark.svg",
        tier: "Strategic Global OEM"
      },
      {
        name: "Google Cloud",
        role: "Chronicle Petabyte-Scale SIEM & Mandiant Threat Intelligence",
        logo: "https://cdn.ivaluetv.com/oem/googlecloud.svg",
        tier: "Strategic Global OEM"
      },
      {
        name: "Splunk",
        role: "Enterprise Security Information & Event Management (SIEM)",
        logo: "https://cdn.ivaluetv.com/oem/splunk.svg",
        tier: "Certified Alliance Partner"
      },
      {
        name: "Confluent",
        role: "Apache Kafka Event Ingestion & Real-Time Security Pipelines",
        logo: "https://cdn.ivaluetv.com/oem/Confluent.png",
        tier: "Technology Alliance"
      }
    ],
    controlReferences: [
      "SOC-01 High-Volume Telemetry Ingestion",
      "SOC-02 UEBA & Anomaly Correlation",
      "SOC-03 MITRE ATT&CK Mapping",
      "SOC-05 Threat Intelligence Fusion",
      "CLD-03 Container Runtime Threat Detection"
    ],
    complianceFrameworks: ["CERT-In 6-Hour Reporting", "RBI SOC SLA Guidelines", "SOC 2 Type II", "PCI-DSS 4.0"],
    readinessStatus: "Production Certified",
    labValidated: true,
    benchmarkMultiplier: "68% reduction in MTTD & alert fatigue"
  },
  {
    id: "mission-critical-db-resiliency",
    slug: "mission-critical-db-resiliency",
    title: "Mission-Critical Enterprise Database & Resiliency Stack",
    shortTitle: "Enterprise Database",
    category: "Cloud & Infrastructure",
    targetVerticals: ["BFSI", "Public Sector", "Healthcare", "Core Manufacturing"],
    tagline: "High-availability enterprise Postgres, hyperconverged cloud storage, and hardware key custody.",
    executiveSummary:
      "A sovereign, open-architecture database platform designed for Tier-1 core banking, transaction ledgers, and critical public infrastructure. Powered by EDB Postgres Advanced Server on Virtuozzo's ultra-dense hyperconverged infrastructure, with Thales hardware security modules (HSM) safeguarding cryptographic master keys.",
    architectureDescription:
      "Active-active synchronous database clustering with automated failover (< 5 seconds RTO, 0 RPO) running atop Virtuozzo hybrid virtualization. Database tablespaces and sensitive transaction logs are encrypted in flight and at rest using Thales Luna HSM cryptographic key custodianship.",
    oems: [
      {
        name: "EDB",
        role: "Enterprise PostgreSQL Database Engine with Oracle Compatibility",
        logo: "/assets/img/oems/edb.svg",
        logoDark: "/assets/img/oems/edb-dark.svg",
        tier: "Strategic Global OEM"
      },
      {
        name: "Virtuozzo",
        role: "High-Density Hyperconverged Cloud Compute & Storage",
        logo: "/assets/img/oems/virtuozzo.svg",
        logoDark: "/assets/img/oems/virtuozzo-dark.svg",
        tier: "Certified Alliance Partner"
      },
      {
        name: "Thales",
        role: "Hardware Security Modules (HSM) & Key Management (KMS)",
        logo: "https://cdn.ivaluetv.com/oem/thales.png",
        tier: "Certified Alliance Partner"
      }
    ],
    controlReferences: [
      "DAT-01 Transparent Database Encryption (TDE)",
      "DAT-04 Hardware HSM Master Key Custodianship",
      "INF-02 Automated Sub-Minute Failover Clustering",
      "INF-05 Immutable Air-Gapped Backup Snapshots"
    ],
    complianceFrameworks: ["RBI Core Banking Guidelines", "DPDP Act 2023", "SEBI CSCRF", "ISO 22301 (BCP)"],
    readinessStatus: "Production Certified",
    labValidated: true,
    benchmarkMultiplier: "99.999% uptime with 40% TCO savings"
  },
  {
    id: "exposure-management-threat-emulation",
    slug: "exposure-management-threat-emulation",
    title: "Continuous Exposure Management & Threat Emulation Stack",
    shortTitle: "Exposure & Emulation",
    category: "Exposure Management",
    targetVerticals: ["BFSI", "Defense & Aerospace", "Energy & Power", "Healthcare"],
    tagline: "Proactive adversary emulation, continuous attack surface discovery, and predictive risk scoring.",
    executiveSummary:
      "Shifts enterprise security posture from passive vulnerability patching to active adversary deterrence. By synthesizing Tenable One exposure management with Gambit Cyber threat emulation, CISOs receive validated evidence of exploitable attack paths before adversaries can weaponize them.",
    architectureDescription:
      "Continuous external attack surface management (EASM) scans correlate with internal vulnerability telemetry and Gambit Cyber automated breach and attack simulation (BAS) agents. Attack paths are modeled against live Active Directory and cloud IAM graphs to highlight critical choke points.",
    oems: [
      {
        name: "Tenable",
        role: "Tenable One Exposure Management & Nessus Vulnerability Scanning",
        logo: "https://cdn.ivaluetv.com/oem/Tenable.svg",
        tier: "Strategic Global OEM"
      },
      {
        name: "Gambit Cyber",
        role: "Adversary Emulation, Breach Simulation & Threat Telemetry",
        logo: "/assets/img/oems/gambit-cyber.svg",
        logoDark: "/assets/img/oems/gambit-cyber-dark.svg",
        tier: "Certified Alliance Partner"
      },
      {
        name: "SentinelOne",
        role: "Autonomous Endpoint Forensics & Deep Visibility Querying",
        logo: "https://cdn.ivaluetv.com/oem/SentinelOne.svg",
        tier: "Certified Alliance Partner"
      }
    ],
    controlReferences: [
      "EXP-01 External Attack Surface Discovery",
      "EXP-03 Automated Breach & Attack Simulation (BAS)",
      "EXP-05 Risk-Weighted Vulnerability Prioritization",
      "SOC-03 MITRE ATT&CK Validation"
    ],
    complianceFrameworks: ["CERT-In Vulnerability Remediation Mandate", "SEBI CSCRF CTEM Directive", "RBI VAPT"],
    readinessStatus: "Production Certified",
    labValidated: true,
    benchmarkMultiplier: "73% faster high-risk vulnerability remediation"
  },
  {
    id: "identity-governance-digital-trust",
    slug: "identity-governance-digital-trust",
    title: "Identity Governance & Digital Trust Architecture",
    shortTitle: "Digital Trust & PKI",
    category: "Identity & Access Management",
    targetVerticals: ["BFSI", "Insurance", "Pharmaceuticals", "Government"],
    tagline: "High-assurance digital certificates, automated e-Sign, and identity lifecycle governance.",
    executiveSummary:
      "Establishes cryptographically verified digital trust across workforce, customer, and partner interactions. Combining Entrust certificate authorities and PKI key custody with eMudhra paperless signature workflows and OpenText NetIQ governance, this stack satisfies strict paperless compliance mandates without sacrificing operational velocity.",
    architectureDescription:
      "Automated SSL/TLS and code-signing certificate lifecycle management backed by hardware root CAs. Employee and customer transactions leverage legally binding digital signatures integrated with adaptive multi-factor authentication (MFA) and granular entitlement certification.",
    oems: [
      {
        name: "Entrust",
        role: "Enterprise PKI, Certificate Lifecycle & Cloud IDaaS",
        logo: "https://cdn.ivaluetv.com/oem/entrust.png",
        tier: "Strategic Global OEM"
      },
      {
        name: "eMudhra",
        role: "Digital Signature Workflows (eMsigner) & CertiNext",
        logo: "/assets/img/oems/emudhra.png",
        tier: "Certified Alliance Partner"
      },
      {
        name: "OpenText",
        role: "NetIQ Identity Governance & Administration (IGA)",
        logo: "https://cdn.ivaluetv.com/oem/OpenText_logo.svg",
        tier: "Certified Alliance Partner"
      },
      {
        name: "RSA",
        role: "SecurID Adaptive Multi-Factor Authentication",
        logo: "https://cdn.ivaluetv.com/oem/RSA-Red-Logo_fb8e2b2e.svg",
        tier: "Technology Alliance"
      }
    ],
    controlReferences: [
      "IAM-01 Single Identity Truth & Directory Uniqueness",
      "IAM-03 Automated Joiner-Mover-Leaver (JML) Workflows",
      "PKI-01 Automated TLS/SSL Certificate Lifecycle",
      "PKI-04 Legally Binding Paperless e-Signature Integration"
    ],
    complianceFrameworks: ["IT Act 2000 (Digital Signatures)", "DPDP Act 2023", "SEBI CSCRF", "RBI Master Direction"],
    readinessStatus: "Production Certified",
    labValidated: true,
    benchmarkMultiplier: "90% reduction in manual identity audit audits"
  },
  {
    id: "bfsi-resilience-fraud-defense",
    slug: "bfsi-resilience-fraud-defense",
    title: "BFSI High-Resilience Financial Core & Fraud Defense Stack",
    shortTitle: "BFSI Core Resilience",
    category: "Verticals & BFSI",
    targetVerticals: ["Retail Banks", "Payment Gateways", "NBFCs", "Stock Exchanges"],
    tagline: "Ultra-low latency financial perimeter, real-time database activity monitoring, and anti-fraud scoring.",
    executiveSummary:
      "Architected specifically for high-frequency financial transactions and payment clearing houses. Integrates Check Point quantum network security, Imperva database firewalls (DAM), CyberArk vaulting, and EDB transaction databases into a unified, high-resilience architecture resilient against advanced banking malware and rogue insider threats.",
    architectureDescription:
      "Layered defense model placing DDoS mitigation and application firewalls at the public API gateway, real-time database query inspection (DAM) at the data layer, and ephemeral privileged session tokens for administrative maintenance. Every financial transaction is scored against behavioral anomaly baselines.",
    oems: [
      {
        name: "Check Point",
        role: "Quantum Maestro Scalable Perimeter & Data Center Defense",
        logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg",
        tier: "Strategic Global OEM"
      },
      {
        name: "Imperva",
        role: "Database Activity Monitoring (DAM) & Web App Firewall (WAF)",
        logo: "https://cdn.ivaluetv.com/oem/imperva.png",
        tier: "Strategic Global OEM"
      },
      {
        name: "CyberArk",
        role: "Privileged Access Management & Session Isolation",
        logo: "https://cdn.ivaluetv.com/oem/cyberark.svg",
        tier: "Strategic Global OEM"
      },
      {
        name: "EDB",
        role: "Enterprise PostgreSQL Core Transaction Database",
        logo: "/assets/img/oems/edb.svg",
        logoDark: "/assets/img/oems/edb-dark.svg",
        tier: "Strategic Global OEM"
      }
    ],
    controlReferences: [
      "BFSI-01 Core Banking System Perimeter Isolation",
      "BFSI-02 Database Activity Monitoring (DAM) for Financial Records",
      "BFSI-03 Sub-Second Payment Transaction Fraud Scoring",
      "IAM-02 Dual-Control Privileged Session Auditing"
    ],
    complianceFrameworks: ["RBI Cybersecurity Framework for Banks", "SEBI CSCRF", "NPCI Guidelines", "PCI-DSS 4.0"],
    readinessStatus: "Production Certified",
    labValidated: true,
    benchmarkMultiplier: "100% compliance audit readiness with zero downtime"
  }
];

export function getMarketplaceStacks() {
  return MARKETPLACE_STACKS;
}

export function getStackBySlug(slug) {
  if (!slug) return null;
  return MARKETPLACE_STACKS.find(
    (s) => s.slug.toLowerCase() === slug.toLowerCase() || s.id.toLowerCase() === slug.toLowerCase()
  );
}

export function getStacksByOem(oemName) {
  if (!oemName) return [];
  const q = oemName.toLowerCase().trim();
  return MARKETPLACE_STACKS.filter((s) =>
    s.oems.some((o) => o.name.toLowerCase().includes(q))
  );
}

export default MARKETPLACE_STACKS;
