/**
 * Technology Stacks Suite Dataset
 * Covers core technology domains: SOC, IAM, Endpoint, Cloud Security, and AppSec.
 * Powers the Technology Stacks Matrix and Architecture Switcher on /technology-stacks.
 */

export const TECHNOLOGY_DOMAINS = [
  {
    id: "soc",
    slug: "scoControls",
    title: "Security Operations Center (SOC) Stack",
    shortTitle: "SOC & SecOps",
    badge: "Detection Engineering & Response",
    icon: "ShieldAlert",
    tagline: "High-Throughput Telemetry Ingestion, Behavioral Analytics & Autonomous SOAR Playbooks",
    overview:
      "The iValue CoE Security Operations Center (SOC) Stack fuses high-velocity log streaming, petabyte-scale search, user and entity behavior analytics (UEBA), and automated response orchestration into a unified security operations fabric. Validated across hybrid enterprise environments to eliminate alert fatigue and lower MTTD to under 3 minutes.",
    multiplier: "4.2x Faster Mean Time to Containment (MTTC)",
    architectureTier: "Tier-1 Enterprise SecOps Fabric",
    primaryOems: [
      {
        name: "Google Cloud",
        product: "Chronicle SIEM & Mandiant Threat Intelligence",
        role: "Petabyte-Scale Telemetry Analytics",
        logo: "https://cdn.ivaluetv.com/oem/googlecloud.svg"
      },
      {
        name: "Datadog",
        product: "Cloud SIEM, Infrastructure & APM Telemetry",
        role: "Full-Stack Observability & SecOps",
        logo: "/assets/img/oems/datadog.svg",
        logoDark: "/assets/img/oems/datadog-dark.svg"
      },
      {
        name: "Splunk",
        product: "Enterprise Security & Threat Correlation Engine",
        role: "Log Aggregation & Compliance SIEM",
        logo: "https://cdn.ivaluetv.com/oem/splunk.svg"
      },
      {
        name: "SentinelOne",
        product: "Singularity XDR & Storyline Active Response",
        role: "Autonomous Endpoint Telemetry Ingestion",
        logo: "https://cdn.ivaluetv.com/oem/SentinelOne.svg"
      },
      {
        name: "Check Point",
        product: "Quantum Maestro & CloudGuard Threat Telemetry",
        role: "Perimeter Threat Feed Ingestion",
        logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg"
      }
    ],
    matrixControls: [
      {
        controlId: "SOC-01",
        capability: "High-Throughput Telemetry Ingestion (>100k EPS)",
        requirementTier: "Mandatory Core",
        primaryOem: "Google Cloud (Chronicle)",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/googlecloud.svg",
        complementaryOems: ["Datadog", "Confluent", "Splunk"],
        blueprintSpec: "Encrypted Syslog-ng / Cloud PubSub streaming into normalized UDM schema with zero packet drop.",
        complianceRef: "CERT-In 6-Hour Reporting, RBI SOC Directives"
      },
      {
        controlId: "SOC-02",
        capability: "Machine Learning UEBA & Anomaly Profiling",
        requirementTier: "Advanced Detection",
        primaryOem: "Splunk",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/splunk.svg",
        complementaryOems: ["Datadog", "SentinelOne"],
        blueprintSpec: "Dynamic risk scoring based on peer group analysis, geolocation deviations, and off-hours privilege spikes.",
        complianceRef: "SEBI CSCRF Section 3.2, ISO 27001"
      },
      {
        controlId: "SOC-03",
        capability: "Bi-Directional Threat Intelligence Fusion",
        requirementTier: "Mandatory Core",
        primaryOem: "Google Cloud (Mandiant)",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/googlecloud.svg",
        complementaryOems: ["Check Point", "Tenable"],
        blueprintSpec: "Automated ingestion of STIX/TAXII feeds, CERT-In advisories, and curated Mandiant front-line actor profiles.",
        complianceRef: "NCIIPC CII Directives, RBI Threat Sharing"
      },
      {
        controlId: "SOC-04",
        capability: "Autonomous SOAR Playbook Orchestration",
        requirementTier: "Advanced Automation",
        primaryOem: "SentinelOne",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/SentinelOne.svg",
        complementaryOems: ["Check Point", "CyberArk"],
        blueprintSpec: "Sub-second programmatic quarantine of compromised hosts, credential revocation, and perimeter IP blacklisting.",
        complianceRef: "SEBI CSCRF MTTD/MTTR SLAs"
      },
      {
        controlId: "SOC-05",
        capability: "180-Day Immutable Forensic Log Retention",
        requirementTier: "Compliance Mandate",
        primaryOem: "Splunk",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/splunk.svg",
        complementaryOems: ["Google Cloud Coldline", "Virtuozzo HCI"],
        blueprintSpec: "WORM-compliant encrypted cold storage with cryptographic hashing for chain-of-custody audit defense.",
        complianceRef: "CERT-In Log Mandate (180 Days), IT Act 2000"
      }
    ],
    integrationBlueprints: [
      {
        name: "Chronicle + Datadog Real-Time SecOps Pipeline",
        description: "Seamless synchronization of application metrics and security audit events for high-velocity DevOps and SOC teams.",
        oems: ["Google Cloud", "Datadog", "Splunk"],
        timeToDeploy: "2-3 Weeks",
        link: "/stack/scoControls"
      },
      {
        name: "Check Point Quantum + SentinelOne XDR Autonomous Defense",
        description: "Hardware perimeter firewall inspection cross-correlated with endpoint process behavior for instant zero-day isolation.",
        oems: ["Check Point", "SentinelOne"],
        timeToDeploy: "1-2 Weeks",
        link: "/stack/scoControls"
      }
    ]
  },

  {
    id: "iam",
    slug: "iamControls",
    title: "Identity & Access Management (IAM) Stack",
    shortTitle: "Identity & PAM",
    badge: "Zero Trust Identity Governance",
    icon: "KeyRound",
    tagline: "Privileged Access Management (PAM), Adaptive MFA, Session Isolation & Directory Governance",
    overview:
      "A comprehensive Zero-Trust identity framework enforcing strict identity uniqueness, Just-In-Time (JIT) privilege elevation, and cryptographic session isolation. Designed to satisfy rigorous RBI, SEBI CSCRF, and DPDP Act compliance requirements across cloud and on-premises directories.",
    multiplier: "65% Reduction in Privilege Abuse Vectors",
    architectureTier: "Core Trust & GRC Infrastructure",
    primaryOems: [
      {
        name: "CyberArk",
        product: "Privilege Cloud & Endpoint Privilege Manager (EPM)",
        role: "Enterprise Credential Vault & PAM",
        logo: "https://cdn.ivaluetv.com/oem/cyberark.svg"
      },
      {
        name: "Entrust",
        product: "Identity as a Service (IDaaS) & PKI Cryptography",
        role: "Adaptive MFA & Digital Certificates",
        logo: "https://cdn.ivaluetv.com/oem/entrust.png"
      },
      {
        name: "OpenText",
        product: "NetIQ Identity Governance & Administration (IGA)",
        role: "Directory Synchronization & JML Workflows",
        logo: "https://cdn.ivaluetv.com/oem/OpenText_logo.svg"
      },
      {
        name: "RSA",
        product: "SecurID Adaptive Multi-Factor Authentication",
        role: "High-Assurance Hardware Tokens",
        logo: "https://cdn.ivaluetv.com/oem/RSA-Red-Logo_fb8e2b2e.svg"
      }
    ],
    matrixControls: [
      {
        controlId: "IAM-01",
        capability: "Privileged Credential Vaulting & Rotation",
        requirementTier: "Mandatory Core",
        primaryOem: "CyberArk",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/cyberark.svg",
        complementaryOems: ["Thales KMS"],
        blueprintSpec: "Automated password rotation every 24 hours with dual-custody approval and synthetic credentials.",
        complianceRef: "SEBI CSCRF Section 4.1, RBI Master Direction"
      },
      {
        controlId: "IAM-02",
        capability: "Tamper-Proof Session Isolation & Keystroke Auditing",
        requirementTier: "Mandatory Core",
        primaryOem: "CyberArk",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/cyberark.svg",
        complementaryOems: ["OpenText NetIQ"],
        blueprintSpec: "Air-gapped jump hosts with video DVR recording of all SSH, RDP, and database administrative sessions.",
        complianceRef: "RBI Banking Cyber Security Framework"
      },
      {
        controlId: "IAM-03",
        capability: "Phishing-Resistant Adaptive FIDO2 / WebAuthn MFA",
        requirementTier: "Mandatory Core",
        primaryOem: "Entrust",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/entrust.png",
        complementaryOems: ["RSA SecurID", "Yubico"],
        blueprintSpec: "Hardware-bound cryptographic keys and push notifications with biometric confirmation for all admin access.",
        complianceRef: "CERT-In Mandatory Admin MFA Directive"
      },
      {
        controlId: "IAM-04",
        capability: "Automated Joiner-Mover-Leaver (JML) Life-Cycle",
        requirementTier: "Governance Core",
        primaryOem: "OpenText",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/OpenText_logo.svg",
        complementaryOems: ["CyberArk", "Entrust"],
        blueprintSpec: "Real-time HRMS webhook integration de-provisioning user accounts and tokens in under 60 seconds of exit.",
        complianceRef: "DPDP Act 2023, ISO 27001 Annex A.9"
      },
      {
        controlId: "IAM-05",
        capability: "Segregation of Duties (SoD) & Toxic Combination Checks",
        requirementTier: "Advanced Governance",
        primaryOem: "OpenText",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/OpenText_logo.svg",
        complementaryOems: ["CyberArk"],
        blueprintSpec: "Automated rule engines preventing conflicting financial authorization and operational deployment permissions.",
        complianceRef: "SOX 404, SEBI Internal Audit Mandates"
      }
    ],
    integrationBlueprints: [
      {
        name: "CyberArk + Entrust Unified Identity & Access Shield",
        description: "Zero-trust privilege isolation paired with adaptive cloud IDaaS for distributed enterprise workforces.",
        oems: ["CyberArk", "Entrust"],
        timeToDeploy: "3-4 Weeks",
        link: "/stack/iamControls"
      }
    ]
  },

  {
    id: "endpoint",
    slug: "endpointControls",
    title: "Endpoint & Mobile Security Stack",
    shortTitle: "Endpoint & XDR",
    badge: "Autonomous Device Defense",
    icon: "Laptop",
    tagline: "Autonomous EDR/XDR, Threat Rollback, Device Posture & Unified Endpoint Management (UEM)",
    overview:
      "Protects enterprise fleets, laptops, virtual desktops, and rugged field terminals against zero-day malware, memory injections, and credential scraping. Combines AI-driven active response with complete device lifecycle and mobile management.",
    multiplier: "100% Automated Ransomware Rollback",
    architectureTier: "Device & Fleet Defense",
    primaryOems: [
      {
        name: "SentinelOne",
        product: "Singularity Complete EDR / XDR",
        role: "Autonomous Behavioral Threat Rollback",
        logo: "https://cdn.ivaluetv.com/oem/SentinelOne.svg"
      },
      {
        name: "Check Point",
        product: "Harmony Endpoint Defense",
        role: "Anti-Exploit & Phishing Prevention",
        logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg"
      },
      {
        name: "Tenable",
        product: "Nessus Agent Continuous Vulnerability Auditing",
        role: "Endpoint Exposure Assessment",
        logo: "https://cdn.ivaluetv.com/oem/Tenable.svg"
      },
      {
        name: "SOTI",
        product: "MobiControl Fleet & Kiosk Management",
        role: "Rugged IoT & Mobile Device Management (MDM)",
        logo: "https://cdn.ivaluetv.com/oem/SotiLogo.png"
      }
    ],
    matrixControls: [
      {
        controlId: "EDR-01",
        capability: "Kernel-Level Behavioral Process Inspection",
        requirementTier: "Mandatory Core",
        primaryOem: "SentinelOne",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/SentinelOne.svg",
        complementaryOems: ["Check Point"],
        blueprintSpec: "AI behavioral engines executing entirely on-device, functioning seamlessly even when disconnected from cloud.",
        complianceRef: "RBI Endpoint Security Directive, CERT-In"
      },
      {
        controlId: "EDR-02",
        capability: "One-Click Cryptographic VSS Ransomware Rollback",
        requirementTier: "Mandatory Core",
        primaryOem: "SentinelOne",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/SentinelOne.svg",
        complementaryOems: [],
        blueprintSpec: "Automated un-encryption of altered files and registry entries through Shadow Copy snapshot custody.",
        complianceRef: "NCIIPC Critical Infrastructure Defense"
      },
      {
        controlId: "EDR-03",
        capability: "Zero-Day Exploit Memory Defense & Browser Isolation",
        requirementTier: "Advanced Prevention",
        primaryOem: "Check Point",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg",
        complementaryOems: ["SentinelOne"],
        blueprintSpec: "Dynamic sandboxing of web downloads and micro-virtualization of browser tabs to stop drive-by downloads.",
        complianceRef: "SEBI CSCRF Section 5"
      },
      {
        controlId: "EDR-04",
        capability: "Fleet Patch Audit & Continuous Exposure Discovery",
        requirementTier: "Mandatory Core",
        primaryOem: "Tenable",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Tenable.svg",
        complementaryOems: ["SOTI"],
        blueprintSpec: "Passive network scanning and lightweight local agents mapping unpatched CVEs against active exploit weaponization.",
        complianceRef: "CERT-In 15-Day Patch Mandate"
      },
      {
        controlId: "EDR-05",
        capability: "Remote Wipe, Geo-Fencing & Kiosk Lock",
        requirementTier: "Fleet Management",
        primaryOem: "SOTI",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/SotiLogo.png",
        complementaryOems: [],
        blueprintSpec: "Over-the-air cryptographic wipe of enterprise partitions when devices leave designated geographic coordinates.",
        complianceRef: "DPDP Act 2023 Device Custody Rules"
      }
    ],
    integrationBlueprints: [
      {
        name: "SentinelOne Singularity + Tenable Exposure Fabric",
        description: "Unified endpoint vulnerability discovery coupled with instant autonomous threat containment.",
        oems: ["SentinelOne", "Tenable"],
        timeToDeploy: "1-2 Weeks",
        link: "/stack/endpointControls"
      }
    ]
  },

  {
    id: "cloud-security",
    slug: "cloudSecurityControls",
    title: "Cloud Security & CNAPP Stack",
    shortTitle: "Cloud & CNAPP",
    badge: "Cloud-Native Application Protection",
    icon: "Cloud",
    tagline: "CSPM, CWPP, Container Runtime Security, Microsegmentation & Sovereign HCI",
    overview:
      "Enterprise cloud security suite delivering unified governance across AWS, Google Cloud, Azure, and private datacentres. Eliminates cloud misconfigurations, detects container vulnerabilities in CI/CD pipelines, and enforces microsegmentation.",
    multiplier: "92% Reduction in Cloud Attack Surface",
    architectureTier: "Multi-Cloud Governance & Runtime Protection",
    primaryOems: [
      {
        name: "Google Cloud",
        product: "Security Command Center & Mandiant Cloud Threat Defense",
        role: "Multi-Cloud CSPM & SecOps",
        logo: "https://cdn.ivaluetv.com/oem/googlecloud.svg"
      },
      {
        name: "Check Point",
        product: "CloudGuard Network & Workload Protection",
        role: "Cloud Network Firewalls & Microsegmentation",
        logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg"
      },
      {
        name: "Netskope",
        product: "Public Cloud Security & Posture Management",
        role: "Cloud Data Loss Prevention & SASE",
        logo: "https://cdn.ivaluetv.com/oem/Netskope.svg"
      },
      {
        name: "Virtuozzo",
        product: "Hybrid Cloud Infrastructure (HCI) Platform",
        role: "Sovereign Private Cloud Virtualization",
        logo: "/assets/img/oems/virtuozzo.svg",
        logoDark: "/assets/img/oems/virtuozzo-dark.svg"
      }
    ],
    matrixControls: [
      {
        controlId: "CLD-01",
        capability: "Continuous Cloud Security Posture Management (CSPM)",
        requirementTier: "Mandatory Core",
        primaryOem: "Google Cloud",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/googlecloud.svg",
        complementaryOems: ["Check Point CloudGuard"],
        blueprintSpec: "Automated discovery of open S3/GCS buckets, permissive IAM roles, and CIS benchmark deviations across multi-cloud.",
        complianceRef: "RBI Cloud Computing Guidelines, CIS Level 1 & 2"
      },
      {
        controlId: "CLD-02",
        capability: "Container Runtime Threat Detection & Drift Prevention",
        requirementTier: "Mandatory Core",
        primaryOem: "Check Point",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg",
        complementaryOems: ["Google Cloud"],
        blueprintSpec: "eBPF syscall auditing stopping unauthorized process spawns or reverse shells inside Kubernetes pods.",
        complianceRef: "SEBI CSCRF Container Directives"
      },
      {
        controlId: "CLD-03",
        capability: "East-West Cloud Microsegmentation",
        requirementTier: "Advanced Security",
        primaryOem: "Check Point",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg",
        complementaryOems: ["Virtuozzo HCI"],
        blueprintSpec: "Software-defined security perimeters isolating sensitive database tiers from web application layers.",
        complianceRef: "PCI-DSS 4.0 Scope Reduction"
      },
      {
        controlId: "CLD-04",
        capability: "Data Loss Prevention (DLP) across Cloud Storage",
        requirementTier: "Data Privacy",
        primaryOem: "Netskope",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Netskope.svg",
        complementaryOems: ["Google Cloud"],
        blueprintSpec: "Optical character recognition (OCR) and regex scanning identifying unencrypted Aadhaar, PAN, and credit card numbers.",
        complianceRef: "DPDP Act 2023, RBI Data Protection"
      },
      {
        controlId: "CLD-05",
        capability: "Sovereign Private Cloud & Hyperconverged Isolation",
        requirementTier: "Infrastructure",
        primaryOem: "Virtuozzo",
        primaryOemLogo: "/assets/img/oems/virtuozzo.svg",
        primaryOemLogoDark: "/assets/img/oems/virtuozzo-dark.svg",
        complementaryOems: ["Check Point", "Thales"],
        blueprintSpec: "On-premises high-density compute and storage virtualization ensuring zero unauthorized telemetry leaves regional jurisdiction.",
        complianceRef: "Data Sovereignty Mandates (RBI & MEITY)"
      }
    ],
    integrationBlueprints: [
      {
        name: "Google Cloud SCC + Check Point CloudGuard Fabric",
        description: "Unified cloud security posture auditing coupled with automated network microsegmentation.",
        oems: ["Google Cloud", "Check Point"],
        timeToDeploy: "2-3 Weeks",
        link: "/stack/cloudSecurityControls"
      }
    ]
  },

  {
    id: "appsec",
    slug: "applicationSecurity",
    title: "Application Security & WAAP Stack",
    shortTitle: "AppSec & WAAP",
    badge: "Web Application & API Protection",
    icon: "Code",
    tagline: "Next-Gen WAF, API Security, DDoS Mitigation, Bot Defense & DevSecOps SAST/DAST",
    overview:
      "Protects enterprise web portals, mobile banking backends, and critical APIs against OWASP Top 10 vulnerabilities, credential stuffing, and volumetric DDoS attacks. Integrates security testing directly into CI/CD pipelines.",
    multiplier: "99.99% Availability Under DDoS Stress",
    architectureTier: "Layer 7 Web & API Security",
    primaryOems: [
      {
        name: "Imperva",
        product: "Cloud WAF, Advanced Bot Protection & API Security",
        role: "WAAP & Layer-7 Application Defense",
        logo: "https://cdn.ivaluetv.com/oem/imperva.png"
      },
      {
        name: "Cloudflare",
        product: "Global Edge WAF, Anti-DDoS & Bot Management",
        role: "Edge Security & Low-Latency CDN",
        logo: "https://cdn.ivaluetv.com/oem/cloudflare.jpg"
      },
      {
        name: "OpenText",
        product: "Fortify Static & Dynamic Application Security Testing",
        role: "DevSecOps SAST / DAST Code Auditing",
        logo: "https://cdn.ivaluetv.com/oem/OpenText_logo.svg"
      },
      {
        name: "Akamai",
        product: "App & API Protector with Proactive DDoS Mitigation",
        role: "Global Edge WAAP Defense",
        logo: "https://cdn.ivaluetv.com/oem/akamai-logo.svg"
      }
    ],
    matrixControls: [
      {
        controlId: "APP-01",
        capability: "OWASP Top 10 Web Application Firewall (WAF)",
        requirementTier: "Mandatory Core",
        primaryOem: "Imperva",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/imperva.png",
        complementaryOems: ["Cloudflare", "Akamai"],
        blueprintSpec: "Zero-latency Layer 7 inspection blocking SQL injections, cross-site scripting (XSS), and zero-day payload exploits.",
        complianceRef: "PCI-DSS 4.0 Requirement 6.4, RBI WAAP"
      },
      {
        controlId: "APP-02",
        capability: "API Discovery & Schema Conformance Auditing",
        requirementTier: "Mandatory Core",
        primaryOem: "Imperva",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/imperva.png",
        complementaryOems: ["Cloudflare"],
        blueprintSpec: "Automatic discovery of shadow and zombie APIs with strict OpenAPI / Swagger schema validation.",
        complianceRef: "SEBI CSCRF API Security Standard"
      },
      {
        controlId: "APP-03",
        capability: "Volumetric & Application-Layer Anti-DDoS",
        requirementTier: "Mandatory Core",
        primaryOem: "Cloudflare",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/cloudflare.jpg",
        complementaryOems: ["Akamai", "Imperva"],
        blueprintSpec: "Global Anycast edge scrubbing with capacity exceeding 150 Tbps, mitigating Layer 3/4 and Layer 7 attacks in seconds.",
        complianceRef: "CERT-In Critical Services Uptime Mandate"
      },
      {
        controlId: "APP-04",
        capability: "Anti-Scraping & Credential Stuffing Bot Management",
        requirementTier: "Advanced Defense",
        primaryOem: "Cloudflare",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/cloudflare.jpg",
        complementaryOems: ["Imperva"],
        blueprintSpec: "Behavioral telemetry and CAPTCHA-less fingerprinting stopping automated credential testing without customer friction.",
        complianceRef: "RBI Anti-Fraud Directives"
      },
      {
        controlId: "APP-05",
        capability: "CI/CD DevSecOps SAST & DAST Code Vulnerability Scans",
        requirementTier: "Shift-Left Security",
        primaryOem: "OpenText (Fortify)",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/OpenText_logo.svg",
        complementaryOems: [],
        blueprintSpec: "Automated source code scanning in GitLab/GitHub pipelines failing builds when critical vulnerabilities are introduced.",
        complianceRef: "ISO 27001 Secure SDLC Mandates"
      }
    ],
    integrationBlueprints: [
      {
        name: "Imperva WAAP + OpenText Fortify DevSecOps Architecture",
        description: "Continuous code-level vulnerability testing coupled with edge WAAP runtime shielding for high-frequency web apps.",
        oems: ["Imperva", "OpenText"],
        timeToDeploy: "2-3 Weeks",
        link: "/stack/applicationSecurity"
      }
    ]
  }
];

export function getTechnologyDomainById(id) {
  if (!id) return null;
  return TECHNOLOGY_DOMAINS.find(
    (d) => d.id.toLowerCase() === id.toLowerCase() || d.slug.toLowerCase() === id.toLowerCase()
  );
}

export default TECHNOLOGY_DOMAINS;
