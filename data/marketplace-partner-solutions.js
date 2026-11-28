/**
 * iValue Center of Excellence - Partner & Multi-OEM Integrated Stacks
 * Detailed joint architectures with certified OEM partners, target verticals,
 * deep architectural blueprints, control mappings, and executive summaries.
 */

export const PARTNER_SOLUTIONS = [
  {
    solutionId: "partner-stack-01",
    name: "Hybrid Cloud Telemetry & Observability Fabric",
    partnerStack: "Datadog + Google Cloud + Splunk",
    category: "Cloud Observability & SecOps",
    targetVerticals: ["Fintech", "E-Commerce", "SaaS Providers", "Banking"],
    tagline: "End-to-end full-stack telemetry, distributed tracing, and petabyte-scale security correlation.",
    executiveSummary:
      "Modern hybrid enterprises require continuous observability across application performance, microservices, and security posture. This partner blueprint synthesizes Datadog APM and real-time container metrics with Google Cloud Chronicle's massive analytics pipeline, giving executive leadership complete visibility into system health and zero-day threat activity without operational silos.",
    architectureDescription:
      "Agent-based and eBPF-driven telemetry collectors route distributed traces, application logs, and system metrics to Datadog's APM engine for microservice latency optimization. Concurrently, security event streams are piped via encrypted Pub/Sub queues to Chronicle SIEM, where automated detection rules cross-reference active IOCs against Google Mandiant threat intelligence.",
    oemPartners: [
      {
        name: "Datadog",
        role: "Full-Stack APM, Real User Monitoring (RUM) & Infrastructure Metrics",
        logo: "/assets/img/oems/datadog.svg",
        logoDark: "/assets/img/oems/datadog-dark.svg",
        certifiedVersion: "v7.50+ Cloud Enterprise"
      },
      {
        name: "Google Cloud",
        role: "Chronicle SecOps Platform & Mandiant Threat Feed Ingestion",
        logo: "https://cdn.ivaluetv.com/oem/googlecloud.svg",
        certifiedVersion: "Chronicle Enterprise Tier"
      },
      {
        name: "Splunk",
        role: "Compliance Auditing, Log Archival & Cold Storage Retention",
        logo: "https://cdn.ivaluetv.com/oem/splunk.svg",
        certifiedVersion: "Splunk Enterprise Security 7.x"
      }
    ],
    controlReferences: [
      "SOC-01 High-Volume Normalized Telemetry Ingestion",
      "SOC-02 Machine Learning User & Entity Behavior Analytics",
      "CLD-01 Multi-Cloud Infrastructure Configuration Auditing",
      "AUD-03 180-Day Immutable Log Retention (CERT-In Compliant)"
    ],
    targetOutcomes: [
      "Sub-minute Root Cause Analysis (RCA) for complex microservice outages",
      "Full compliance with CERT-In 6-hour security incident notification mandates",
      "65% reduction in cross-cloud data egress fees via localized telemetry filtering"
    ],
    deploymentTimeline: "2-3 Weeks (Pre-Configured Helm & Terraform Baselines)",
    estimatedRoiMultiplier: "3.8x faster incident triage and 50% lower MTTR"
  },
  {
    solutionId: "partner-stack-02",
    name: "Sovereign Enterprise Database & Resilient Cloud Platform",
    partnerStack: "EDB + Virtuozzo + Thales",
    category: "Cloud & Database Infrastructure",
    targetVerticals: ["BFSI", "Public Sector", "Healthcare", "Defense"],
    tagline: "Oracle-compatible Postgres clustering with ultra-dense hyperconverged virtualization and FIPS 140-2 HSM.",
    executiveSummary:
      "Designed for enterprises seeking database independence, data sovereignty, and hardware-grade cryptographic key control. By deploying EDB Postgres Advanced Server on Virtuozzo's software-defined hyperconverged infrastructure with Thales Luna HSM encryption, organizations escape proprietary database licensing locks while ensuring continuous compliance with DPDP and RBI mandates.",
    architectureDescription:
      "High-availability EDB Postgres clusters utilizing streaming replication, connection pooling (PgBouncer), and automated failover (EDB Failover Manager). The underlying compute and NVMe storage are virtualized through Virtuozzo Hybrid Server, delivering sub-millisecond I/O latency. All encryption keys for Transparent Data Encryption (TDE) are custodied inside dedicated Thales HSM hardware vaults.",
    oemPartners: [
      {
        name: "EDB",
        role: "Enterprise Postgres Advanced Server with Built-In Oracle Compatibility",
        logo: "/assets/img/oems/edb.svg",
        logoDark: "/assets/img/oems/edb-dark.svg",
        certifiedVersion: "EPAS v16 Enterprise"
      },
      {
        name: "Virtuozzo",
        role: "High-Performance Hyperconverged Cloud Infrastructure (HCI)",
        logo: "/assets/img/oems/virtuozzo.svg",
        logoDark: "/assets/img/oems/virtuozzo-dark.svg",
        certifiedVersion: "Virtuozzo Hybrid Cloud 7.5"
      },
      {
        name: "Thales",
        role: "CipherTrust Key Management & Luna Hardware Security Modules (HSM)",
        logo: "https://cdn.ivaluetv.com/oem/thales.png",
        certifiedVersion: "CipherTrust Manager v2.14"
      }
    ],
    controlReferences: [
      "DAT-01 Hardware-Enforced Transparent Database Encryption",
      "DAT-04 Dual-Control Cryptographic Key Custodianship (FIPS 140-2)",
      "INF-02 Automated High-Availability Synchronous Failover (<5s RTO)",
      "GOV-01 Data Sovereignty & On-Premises Geographic Pinning"
    ],
    targetOutcomes: [
      "Up to 70% reduction in commercial database licensing fees",
      "Guaranteed RPO=0 and RTO < 5 seconds for critical financial ledgers",
      "Full compliance with RBI data localisation directives and DPDP Act 2023"
    ],
    deploymentTimeline: "3-4 Weeks (Turnkey CoE Architecture Blueprint)",
    estimatedRoiMultiplier: "5.2x Total Cost of Ownership (TCO) advantage"
  },
  {
    solutionId: "partner-stack-03",
    name: "Autonomous Attack Surface Reduction & Adversary Emulation",
    partnerStack: "Tenable + Gambit Cyber + SentinelOne",
    category: "Exposure Management & Threat Emulation",
    targetVerticals: ["BFSI", "Critical Infrastructure", "Energy & Power", "Aviation"],
    tagline: "Continuous attack surface visibility, automated breach simulation, and self-healing endpoint containment.",
    executiveSummary:
      "Enterprise attack surfaces expand faster than manual penetration testing can validate. This multi-OEM blueprint integrates Tenable One's comprehensive exposure discovery with Gambit Cyber's automated adversary emulation and SentinelOne's Singularity XDR. It delivers quantifiable risk reduction metrics to the board while empowering security operations to neutralize attack paths preemptively.",
    architectureDescription:
      "Tenable One discovers internal and external exposed assets, analyzing cloud configurations, active directory vulnerabilities, and unpatched firmware. Gambit Cyber's autonomous attack simulation engine safely detonates realistic adversary tactics against discovered endpoints to test defensive efficacy. Any validated exposure triggers automated SentinelOne containment policies.",
    oemPartners: [
      {
        name: "Tenable",
        role: "Tenable One Exposure Management Platform & Nessus Core",
        logo: "https://cdn.ivaluetv.com/oem/Tenable.svg",
        certifiedVersion: "Tenable One Enterprise"
      },
      {
        name: "Gambit Cyber",
        role: "Automated Breach & Attack Simulation (BAS) Telemetry",
        logo: "/assets/img/oems/gambit-cyber.svg",
        logoDark: "/assets/img/oems/gambit-cyber-dark.svg",
        certifiedVersion: "Gambit Adversary Platform v3.2"
      },
      {
        name: "SentinelOne",
        role: "Singularity Complete XDR with Storyline Active Response",
        logo: "https://cdn.ivaluetv.com/oem/SentinelOne.svg",
        certifiedVersion: "Singularity Agent 23.4"
      }
    ],
    controlReferences: [
      "EXP-01 Continuous External Attack Surface Discovery (EASM)",
      "EXP-03 Safe Automated Adversary Emulation (BAS)",
      "EXP-05 Contextual Risk-Based Vulnerability Remediation Priority",
      "EDR-02 Kernel-Level Process Isolation & Cryptographic Rollback"
    ],
    targetOutcomes: [
      "Continuous verification of SOC detection efficacy against MITRE ATT&CK TTPs",
      "Prioritized vulnerability remediation focusing exclusively on weaponized paths",
      "Immediate board-level cyber resilience metrics aligned with SEBI CSCRF"
    ],
    deploymentTimeline: "1-2 Weeks (Automated SaaS & Sensor Deployment)",
    estimatedRoiMultiplier: "4.1x faster vulnerability remediation velocity"
  },
  {
    solutionId: "partner-stack-04",
    name: "Enterprise Zero Trust Access & Privileged Identity Vault",
    partnerStack: "Check Point + CyberArk + Netskope",
    category: "Identity & Zero Trust Security",
    targetVerticals: ["Banking", "Government", "Telecom", "Large Enterprise"],
    tagline: "Contextual zero trust network access, isolated privileged sessions, and cloud CASB protection.",
    executiveSummary:
      "Hybrid work and distributed cloud workloads demand a zero-trust model where every user, device, and API request is explicitly verified. This integrated architecture combines Check Point Quantum perimeters, CyberArk Privileged Access Manager, and Netskope Next-Gen SASE to ensure zero unauthorized credential proliferation or lateral privilege escalation.",
    architectureDescription:
      "Workforce and third-party vendor traffic is evaluated at the edge by Netskope ZTNA based on real-time device posture and user behavioral risk. Administrative access to sensitive servers and databases requires Just-in-Time approval via CyberArk, with complete encrypted session recording. Check Point Quantum firewalls enforce dynamic microsegmentation across internal data centres.",
    oemPartners: [
      {
        name: "Check Point",
        role: "Quantum Next-Generation Firewalls & Microsegmentation",
        logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg",
        certifiedVersion: "Quantum R81.20 Take 65"
      },
      {
        name: "CyberArk",
        role: "Privilege Cloud & Endpoint Privilege Manager (EPM)",
        logo: "https://cdn.ivaluetv.com/oem/cyberark.svg",
        certifiedVersion: "CyberArk Privilege Cloud 14.x"
      },
      {
        name: "Netskope",
        role: "Next-Gen Secure Web Gateway (SWG) & Cloud CASB",
        logo: "https://cdn.ivaluetv.com/oem/Netskope.svg",
        certifiedVersion: "Netskope Cloud Director v112"
      }
    ],
    controlReferences: [
      "IAM-02 Privileged Session Isolation & Keystroke Recording",
      "IAM-04 Risk-Adaptive Multi-Factor Authentication",
      "NET-01 Dynamic Zero Trust Network Access (ZTNA)",
      "DLP-02 Cloud Access Security Broker (CASB) Content Inspection"
    ],
    targetOutcomes: [
      "Zero unmanaged privileged credentials on developer and admin endpoints",
      "Elimination of legacy inbound VPN vulnerabilities and open listening ports",
      "Complete compliance with CERT-In admin MFA and SEBI CSCRF access controls"
    ],
    deploymentTimeline: "3-4 Weeks (Full Enterprise Implementation)",
    estimatedRoiMultiplier: "6.5x reduction in credential-based attack surface"
  }
];

export function getPartnerSolutions() {
  return PARTNER_SOLUTIONS;
}

export function getPartnerSolutionById(id) {
  if (!id) return null;
  return PARTNER_SOLUTIONS.find(
    (s) => s.solutionId.toLowerCase() === id.toLowerCase()
  );
}

export default PARTNER_SOLUTIONS;
