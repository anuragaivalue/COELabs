/**
 * Comprehensive Vertical Domain Multi-Stack Architecture & Regulatory Matrix Dataset
 * Covers 7 critical enterprise industries:
 * 1. BFSI (Banking, Financial Services & Insurance)
 * 2. Manufacturing (Industry 4.0 & OT/ICS)
 * 3. Energy & Power (Critical Infrastructure & Smart Grids)
 * 4. Insurance (Underwriting, Policyholder Data & Claims)
 * 5. Pharma & Life Sciences (GxP, Clinical Trials & Drug Production)
 * 6. Healthcare (Hospitals, Telehealth & EHR Records)
 * 7. Government & Defense (Sovereign Infrastructure & Public Sector)
 */

export const REGULATORY_STANDARDS = [
  "All",
  "RBI",
  "HIPAA",
  "NCIIPC",
  "SEBI CSCRF",
  "DPDP",
  "IEC 62443",
];

export const VERTICAL_DOMAINS = [
  {
    id: "bfsi",
    name: "Banking, Financial Services & Insurance (BFSI)",
    shortTitle: "BFSI",
    icon: "Landmark",
    badge: "Tier-1 Ultra Resilient",
    regulatoryAuthority: "Reserve Bank of India (RBI), SEBI, NPCI, PCI-SSC",
    complianceStandards: ["RBI", "SEBI CSCRF", "DPDP", "PCI-DSS"],
    summary:
      "Mission-critical security architecture engineered for zero-downtime banking, core transactional integrity, API banking security, and sovereign DPDP compliance.",
    targetWorkloads:
      "Core Banking Engines (CBS), Swift/RTGS Gateways, Payment Switches, Lending APIs, Internet/Mobile Banking",
    labValidationTelemetry:
      "Tested for sub-millisecond HSM cryptographic signing, zero-data loss active-active database replication, and automated RBI compliance reporting.",
    stats: {
      criticalControls: 8,
      certifiedBlueprints: 3,
      oemIntegrations: 7,
      auditReadiness: "100%",
    },
    matrixControls: [
      {
        controlId: "BFSI-CTL-01",
        capability: "High-Throughput Cryptographic Key & PIN Orchestration",
        regulatoryStandard: "RBI",
        regulatoryMandate:
          "RBI Master Direction on IT Governance Section 4.2 & PCI-DSS 4.0 Req 3.5 (FIPS 140-3 Level 3 HSM Protection)",
        enforcementLevel: "Mandatory Core",
        primaryOem: "Entrust",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/entrust.png",
        complementaryOems: ["CyberArk", "Check Point"],
        blueprintSpec:
          "Enterprise nShield HSM cluster providing hardware-isolated asymmetric signing, automated cryptographic key lifecycle, and dual-custody authorization for transaction clearing.",
        auditProof:
          "Tamper-evident audit logs, automated PIN-block encryption validation, zero cleartext key exposure in memory dumps.",
      },
      {
        controlId: "BFSI-CTL-02",
        capability: "Privileged Access Security & Session Recording for CBS",
        regulatoryStandard: "RBI",
        regulatoryMandate:
          "RBI Cyber Security Framework Annexure 1 (Strict PAM for Core Banking Database & Switch Administrators)",
        enforcementLevel: "Mandatory Core",
        primaryOem: "CyberArk",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/cyberark.svg",
        complementaryOems: ["Entrust", "Splunk"],
        blueprintSpec:
          "Zero-trust credential vaulting with biometric just-in-time (JIT) access approval, continuous keystroke recording, and automated password rotation every 4 hours.",
        auditProof:
          "Cryptographically signed MP4 video session replays, keystroke command logs, automated privilege escalation telemetry.",
      },
      {
        controlId: "BFSI-CTL-03",
        capability: "Financial API Security & DDoS Shield for Open Banking",
        regulatoryStandard: "SEBI CSCRF",
        regulatoryMandate:
          "SEBI CSCRF Clause 6.4 & RBI Open Banking Directive (Continuous API Threat Protection & Rate Limiting)",
        enforcementLevel: "High Priority",
        primaryOem: "Check Point",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg",
        complementaryOems: ["Arista Networks", "Google Cloud"],
        blueprintSpec:
          "Inline AI-powered Web Application and API Protection (WAAP) detecting OWASP API Top 10 vulnerabilities, BOLA/BFLA exploits, and layer-7 volumetric floods.",
        auditProof:
          "Real-time schema validation reports, blocked credential stuffing logs, synthetic API latency SLA benchmarks under 4ms.",
      },
      {
        controlId: "BFSI-CTL-04",
        capability: "Customer Financial Data Discovery & Consent Redaction",
        regulatoryStandard: "DPDP",
        regulatoryMandate:
          "Digital Personal Data Protection (DPDP) Act 2023 Sec 6 & 8 (Notice, Consent & Purpose-Bound Data Minimization)",
        enforcementLevel: "Audit Essential",
        primaryOem: "Forcepoint",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/forcepoint.svg",
        complementaryOems: ["EDB", "Entrust"],
        blueprintSpec:
          "Context-aware Enterprise DLP identifying PAN, Aadhaar, account numbers, and credit scores across email, endpoints, and cloud repositories with automatic tokenization.",
        auditProof:
          "Automated Data Principal consent ledger, egress exfiltration block records, masked data exports in transit.",
      },
      {
        controlId: "BFSI-CTL-05",
        capability: "Continuous Vulnerability & Threat Exposure Assessment",
        regulatoryStandard: "SEBI CSCRF",
        regulatoryMandate:
          "SEBI CSCRF Annexure B (Mandatory Continuous Attack Surface Exposure & Threat Remediation SLAs)",
        enforcementLevel: "Mandatory Core",
        primaryOem: "Tenable",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Tenable.svg",
        complementaryOems: ["CyberArk", "Splunk"],
        blueprintSpec:
          "Tenable.io integrated with Active Directory and cloud substrates to quantify vulnerability risk scores (VPR) and track 24-hour remediation for critical CVEs.",
        auditProof:
          "Automated executive exposure scorecards, SLA tracking dashboards, verifiable zero-day patch validation records.",
      },
      {
        controlId: "BFSI-CTL-06",
        capability: "Enterprise Sovereign Relational Database with Zero-Data-Loss",
        regulatoryStandard: "RBI",
        regulatoryMandate:
          "RBI Master Direction on Outsourcing & Data Localization (Data Residency & High-Availability Banking DB)",
        enforcementLevel: "Mandatory Core",
        primaryOem: "EDB",
        primaryOemLogo: "/assets/img/oems/edb.svg",
        complementaryOems: ["Virtuozzo", "Entrust"],
        blueprintSpec:
          "EDB Postgres Advanced Server with Transparent Data Encryption (TDE), active-active multi-datacenter replication, and extreme transaction isolation.",
        auditProof:
          "RPO=0 failover telemetry test reports, audit log tamper seals, hardware-encrypted disk volume verification.",
      },
    ],
    blueprints: [
      {
        title: "RBI-Compliant Core Banking Zero-Trust Fortress",
        description:
          "End-to-end integration combining Entrust nShield HSM, CyberArk Privileged Access, and Check Point Quantum firewalls for high-throughput transactional protection.",
        primaryOems: ["Entrust", "CyberArk", "Check Point", "EDB"],
        complianceTags: ["RBI Master Direction", "PCI-DSS 4.0", "ISO 27001"],
        labStatus: "Verified Physical Testbed",
        blueprintSlug: "bfsi-zero-trust-fortress",
      },
      {
        title: "DPDP Data Guardian for Retail Financial Services",
        description:
          "Automated customer financial data discovery, consent logging, and DLP blocking across branch endpoints, hybrid clouds, and mobile app APIs.",
        primaryOems: ["Forcepoint", "Tenable", "Google Cloud"],
        complianceTags: ["DPDP Act 2023", "SEBI CSCRF"],
        labStatus: "Validated Turnkey Stack",
        blueprintSlug: "bfsi-dpdp-guardian",
      },
    ],
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Industry 4.0",
    shortTitle: "Manufacturing",
    icon: "Factory",
    badge: "OT / ICS Industrial Grade",
    regulatoryAuthority: "NCIIPC, IEC/ISA-62443, ISO 27001 Annex A.12",
    complianceStandards: ["IEC 62443", "NCIIPC", "DPDP"],
    summary:
      "Purdue Model-aligned industrial cybersecurity protecting OT/SCADA systems, PLC controllers, and smart factory robotic cells against ransomware and unauthorized physical disruption.",
    targetWorkloads:
      "SCADA Servers, Distributed Control Systems (DCS), Programmable Logic Controllers (PLC), Industrial IoT Sensors, MES Platforms",
    labValidationTelemetry:
      "Tested for industrial protocol anomaly inspection (Modbus, Profinet, DNP3), air-gapped secure jump host isolation, and zero PLC scan disruption.",
    stats: {
      criticalControls: 7,
      certifiedBlueprints: 2,
      oemIntegrations: 6,
      auditReadiness: "100%",
    },
    matrixControls: [
      {
        controlId: "MFG-CTL-01",
        capability: "Industrial Network Segmentation & Purdue Model Micro-Perimeter",
        regulatoryStandard: "IEC 62443",
        regulatoryMandate:
          "IEC 62443-3-3 Requirement SR 5.2 (Network Segmentation between IT Level 4 and OT Level 3/2)",
        enforcementLevel: "Mandatory Core",
        primaryOem: "Check Point",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg",
        complementaryOems: ["Arista Networks", "Tenable"],
        blueprintSpec:
          "Ruggedized Industrial Security Gateways with deep packet inspection (DPI) for Modbus TCP, OPC UA, and IEC 60870-5-104 preventing lateral IT-to-OT malware spillover.",
        auditProof:
          "Zone and Conduit traffic flow matrices, blocked unauthorized cross-zone PLC write commands, sub-millisecond OT packet jitter logs.",
      },
      {
        controlId: "MFG-CTL-02",
        capability: "Continuous OT Asset Discovery & Industrial Exposure Management",
        regulatoryStandard: "NCIIPC",
        regulatoryMandate:
          "NCIIPC Guidelines for Critical Information Infrastructure Protection (Automated OT Asset Telemetry)",
        enforcementLevel: "High Priority",
        primaryOem: "Tenable",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Tenable.svg",
        complementaryOems: ["CyberArk", "Splunk"],
        blueprintSpec:
          "Tenable.ot passive network sniffing combined with safe active queries to inventory PLCs, RTUs, and firmware versions without risking production halting.",
        auditProof:
          "Complete Purdue model asset inventory, detected out-of-date firmware CVEs, continuous risk scoring per assembly line.",
      },
      {
        controlId: "MFG-CTL-03",
        capability: "Zero-Trust Remote Access for Third-Party Machine Vendors",
        regulatoryStandard: "IEC 62443",
        regulatoryMandate:
          "IEC 62443-2-4 Clause 4.1.3 (Secure Supplier Access & Ephemeral Credential Brokering)",
        enforcementLevel: "Mandatory Core",
        primaryOem: "CyberArk",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/cyberark.svg",
        complementaryOems: ["Check Point", "Entrust"],
        blueprintSpec:
          "Agentless browser-based jump host access for OEM maintenance engineers with biometric MFA, ephemeral session isolation, and full video audit trail.",
        auditProof:
          "Time-stamped session video recordings, zero stored static vendor passwords, automated revocation on maintenance window expiry.",
      },
      {
        controlId: "MFG-CTL-04",
        capability: "Smart Factory Edge Compute Virtualization & Disaster Recovery",
        regulatoryStandard: "NCIIPC",
        regulatoryMandate:
          "NCIIPC Resiliency Framework Section 7 (Factory Floor High-Availability & 15-Minute Recovery)",
        enforcementLevel: "High Priority",
        primaryOem: "Virtuozzo",
        primaryOemLogo: "/assets/img/oems/virtuozzo.svg",
        complementaryOems: ["EDB", "Arista Networks"],
        blueprintSpec:
          "Hyper-converged lightweight edge cluster running manufacturing execution systems (MES) with automatic failover and local snapshot backups.",
        auditProof:
          "Edge node failover test logs, sub-second VM migration records, automated continuous snapshot validation.",
      },
    ],
    blueprints: [
      {
        title: "Purdue Model IT/OT Zero-Trust Interconnect",
        description:
          "Complete air-gapped micro-segmentation and third-party vendor access control protecting SCADA environments from ransomware.",
        primaryOems: ["Check Point", "CyberArk", "Tenable"],
        complianceTags: ["IEC 62443-3-3", "NCIIPC", "ISO 27001"],
        labStatus: "Verified Physical Testbed",
        blueprintSlug: "mfg-purdue-zero-trust",
      },
    ],
  },
  {
    id: "energy-power",
    name: "Energy, Power & Critical Infrastructure",
    shortTitle: "Energy & Power",
    icon: "Zap",
    badge: "Sovereign Critical Infrastructure",
    regulatoryAuthority: "NCIIPC, Central Electricity Authority (CEA) Cyber Security Regulations",
    complianceStandards: ["NCIIPC", "IEC 62443", "DPDP"],
    summary:
      "Hardened cybersecurity architectures designed specifically for power grid substations, renewable energy solar/wind farms, and smart metering (AMI) infrastructures.",
    targetWorkloads:
      "Energy Management Systems (EMS), Substation Automation (IEC 61850), Smart Meter Headend Systems (HES), AMI Networks",
    labValidationTelemetry:
      "Tested for GOOSE/SV protocol protection, hardware-isolated cryptographic key storage for smart meters, and 24x7 sovereign SOC telemetry.",
    stats: {
      criticalControls: 6,
      certifiedBlueprints: 2,
      oemIntegrations: 5,
      auditReadiness: "100%",
    },
    matrixControls: [
      {
        controlId: "ENG-CTL-01",
        capability: "Substation Protection & IEC 61850 Protocol Integrity",
        regulatoryStandard: "NCIIPC",
        regulatoryMandate:
          "NCIIPC Guidelines for Critical Information Infrastructure & CEA Cyber Security Regulations 2021 Clause 5.1",
        enforcementLevel: "Mandatory Core",
        primaryOem: "Check Point",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg",
        complementaryOems: ["Arista Networks", "Tenable"],
        blueprintSpec:
          "Ruggedized, utility-grade security appliances blocking malicious GOOSE, SV, and MMS packets while maintaining strict microsecond timing synchronization.",
        auditProof:
          "Packet-level substation firewall inspection logs, verified zero false positive tripping, CEA audit compliance records.",
      },
      {
        controlId: "ENG-CTL-02",
        capability: "Smart Metering (AMI) Cryptographic Key Lifecycle Vault",
        regulatoryStandard: "NCIIPC",
        regulatoryMandate:
          "CEA Technical Specifications for Smart Meters & NCIIPC Cryptographic Key Handling Directive",
        enforcementLevel: "Mandatory Core",
        primaryOem: "Entrust",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/entrust.png",
        complementaryOems: ["CyberArk", "EDB"],
        blueprintSpec:
          "Dedicated Hardware Security Module (HSM) cluster storing symmetric and asymmetric keys for millions of smart meters, generating secure DLMS/COSEM keys.",
        auditProof:
          "FIPS 140-3 Level 3 physical tamper detection evidence, automated key derivation throughput exceeding 10,000 keys/sec.",
      },
      {
        controlId: "ENG-CTL-03",
        capability: "Air-Gapped Substation Operator Privileged Access Control",
        regulatoryStandard: "NCIIPC",
        regulatoryMandate:
          "NCIIPC Control Objective 9 (Strict Credential Vaulting & Two-Person Integrity for Grid Control)",
        enforcementLevel: "Strict Sovereign Control",
        primaryOem: "CyberArk",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/cyberark.svg",
        complementaryOems: ["Check Point", "Entrust"],
        blueprintSpec:
          "Hardened on-premises PAM deployment supporting air-gapped dual-authorization workflows for grid switching and breaker tripping commands.",
        auditProof:
          "Complete video audit of grid control operations, dual-sign authorization certificates, immutable audit vault records.",
      },
      {
        controlId: "ENG-CTL-04",
        capability: "Ultra-Low Latency Telemetry Fabric for Smart Grid Subnet",
        regulatoryStandard: "IEC 62443",
        regulatoryMandate:
          "IEC 62443-3-2 Security Risk Assessment & High Availability Data Diode Communication",
        enforcementLevel: "High Priority",
        primaryOem: "Arista Networks",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Arista-networks-logo.svg.png",
        complementaryOems: ["Check Point", "Virtuozzo"],
        blueprintSpec:
          "Non-blocking, deep-buffer switching infrastructure with hardware-based PTP (IEEE 1588) microsecond time stamping and wire-speed ACL micro-segmentation.",
        auditProof:
          "Deterministic packet delivery telemetry, zero packet drop logs during burst grid telemetry simulations.",
      },
    ],
    blueprints: [
      {
        title: "National Grid Sovereign Protection Architecture",
        description:
          "Utility-hardened multi-OEM blueprint combining Check Point ICS appliances, Entrust AMI HSMs, and CyberArk PAM for full CEA regulatory compliance.",
        primaryOems: ["Check Point", "Entrust", "CyberArk", "Arista Networks"],
        complianceTags: ["CEA Cyber Regulations", "NCIIPC", "IEC 61850"],
        labStatus: "Verified Physical Testbed",
        blueprintSlug: "energy-sovereign-grid",
      },
    ],
  },
  {
    id: "insurance",
    name: "Insurance & Underwriting",
    shortTitle: "Insurance",
    icon: "ShieldCheck",
    badge: "Policyholder Data Shield",
    regulatoryAuthority: "Insurance Regulatory and Development Authority of India (IRDAI), DPDP Act",
    complianceStandards: ["RBI", "DPDP", "SEBI CSCRF"],
    summary:
      "Enterprise security stacks safeguarding sensitive policyholder health histories, claims processing pipelines, fraud detection ML models, and insurance distribution portals.",
    targetWorkloads:
      "Policy Administration Systems (PAS), Underwriting Portals, Telematics Ingestion, Claims Verification Engines",
    labValidationTelemetry:
      "Tested for automated PII identification in medical underwriting files, IRDAI security checklist automation, and end-to-end encrypted policy archives.",
    stats: {
      criticalControls: 6,
      certifiedBlueprints: 2,
      oemIntegrations: 5,
      auditReadiness: "100%",
    },
    matrixControls: [
      {
        controlId: "INS-CTL-01",
        capability: "Policyholder Medical & Financial Data Loss Prevention",
        regulatoryStandard: "DPDP",
        regulatoryMandate:
          "DPDP Act 2023 Sec 8 & IRDAI Information and Cyber Security Guidelines Clause 12 (Data Protection)",
        enforcementLevel: "Mandatory Core",
        primaryOem: "Forcepoint",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/forcepoint.svg",
        complementaryOems: ["Entrust", "Google Cloud"],
        blueprintSpec:
          "Automated DLP inspection analyzing scanned PDF claims, health test reports, and financial KYC documents with real-time OCR and redaction.",
        auditProof:
          "Zero policyholder leak verification logs, automated compliance reports generated directly for IRDAI auditors.",
      },
      {
        controlId: "INS-CTL-02",
        capability: "Underwriting Application & Agent Portal Zero-Day Defense",
        regulatoryStandard: "SEBI CSCRF",
        regulatoryMandate:
          "IRDAI Cyber Security Guidelines Clause 15 & SEBI CSCRF Interoperability Guidelines",
        enforcementLevel: "High Priority",
        primaryOem: "Check Point",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg",
        complementaryOems: ["CyberArk", "Arista Networks"],
        blueprintSpec:
          "Next-Gen Threat Prevention with automated sandboxing and SSL/TLS deep inspection protecting underwriting portals against bot-driven fraudulent submissions.",
        auditProof:
          "Malware prevention telemetry, sandboxed detonation reports, zero-trust perimeter access logs.",
      },
      {
        controlId: "INS-CTL-03",
        capability: "Core Insurance Database Replication & TDE Encryption",
        regulatoryStandard: "RBI",
        regulatoryMandate:
          "IRDAI Business Continuity & Disaster Recovery Directive Clause 7 (RPO < 5 mins, RTO < 30 mins)",
        enforcementLevel: "Mandatory Core",
        primaryOem: "EDB",
        primaryOemLogo: "/assets/img/oems/edb.svg",
        complementaryOems: ["Virtuozzo", "Entrust"],
        blueprintSpec:
          "Enterprise EDB Postgres with hardware-accelerated Transparent Data Encryption, synchronous standby clustering, and continuous point-in-time recovery.",
        auditProof:
          "Simulated disaster failover logs, verified encrypted table spaces, audit logs sealed with cryptographic signatures.",
      },
      {
        controlId: "INS-CTL-04",
        capability: "Continuous Exposure & Compliance Auditing for Agent Ecosystem",
        regulatoryStandard: "DPDP",
        regulatoryMandate:
          "IRDAI Annual Security Audit & Third-Party Vendor Security Management Directive",
        enforcementLevel: "Audit Essential",
        primaryOem: "Tenable",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Tenable.svg",
        complementaryOems: ["Splunk", "CyberArk"],
        blueprintSpec:
          "Continuous vulnerability scanning across corporate underwriting servers, partner APIs, and agent web portals with prioritized remediation roadmaps.",
        auditProof:
          "Executive audit summaries, automated third-party risk posture scores, continuous CIS benchmark adherence reports.",
      },
    ],
    blueprints: [
      {
        title: "IRDAI-Compliant Claims & Policy Security Fabric",
        description:
          "Integrated data loss prevention, web application defense, and encrypted database architecture safeguarding confidential policyholder records.",
        primaryOems: ["Forcepoint", "Check Point", "EDB"],
        complianceTags: ["IRDAI Guidelines", "DPDP Act 2023", "ISO 27001"],
        labStatus: "Verified Turnkey Stack",
        blueprintSlug: "ins-claims-security-fabric",
      },
    ],
  },
  {
    id: "pharma",
    name: "Pharma, Life Sciences & Biotech",
    shortTitle: "Pharma",
    icon: "Pill",
    badge: "GxP & FDA Validated",
    regulatoryAuthority: "US FDA (21 CFR Part 11), WHO GxP, CDSCO, DPDP",
    complianceStandards: ["HIPAA", "DPDP", "FDA 21 CFR"],
    summary:
      "Strict data integrity and cyber-physical security matrices designed for clinical trial data, intellectual property formulations, and automated cleanroom batch manufacturing.",
    targetWorkloads:
      "Laboratory Information Management Systems (LIMS), Electronic Batch Records (EBR), Clinical Trial Repositories, Chromatography Data Systems",
    labValidationTelemetry:
      "Tested for electronic signature audit trails (21 CFR Part 11), air-gapped cleanroom jump hosts, and immutable intellectual property protection.",
    stats: {
      criticalControls: 6,
      certifiedBlueprints: 2,
      oemIntegrations: 5,
      auditReadiness: "100%",
    },
    matrixControls: [
      {
        controlId: "PHR-CTL-01",
        capability: "Immutable Electronic Signatures & Data Integrity for LIMS",
        regulatoryStandard: "HIPAA",
        regulatoryMandate:
          "US FDA 21 CFR Part 11 Subpart B & HIPAA Security Rule 45 CFR § 164.312(c)(1) (Data Integrity Controls)",
        enforcementLevel: "Mandatory Core",
        primaryOem: "Entrust",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/entrust.png",
        complementaryOems: ["EDB", "CyberArk"],
        blueprintSpec:
          "FIPS 140-3 Level 3 Hardware Security Module providing digital signing ceremonies, time-stamping authority (TSA), and non-repudiation for batch release certificates.",
        auditProof:
          "Cryptographically sealed batch record hashes, automated audit trail validation, FDA-ready electronic signature certificates.",
      },
      {
        controlId: "PHR-CTL-02",
        capability: "Intellectual Property & Drug Formulation Exfiltration Shield",
        regulatoryStandard: "DPDP",
        regulatoryMandate:
          "DPDP Act 2023 Sec 8 & Trade Secret Protection Directives for Life Sciences R&D",
        enforcementLevel: "Mandatory Core",
        primaryOem: "Forcepoint",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/forcepoint.svg",
        complementaryOems: ["Check Point", "Google Cloud"],
        blueprintSpec:
          "Precision DLP fingerprints analyzing proprietary chemical structures, molecular sequencing data, and clinical trial participant identifiers across R&D endpoints.",
        auditProof:
          "Immediate exfiltration block notifications, automated file tagging logs, forensic incident correlation records.",
      },
      {
        controlId: "PHR-CTL-03",
        capability: "Cleanroom & Lab Instrument Jump Host Privilege Security",
        regulatoryStandard: "HIPAA",
        regulatoryMandate:
          "GxP Annex 11 (Computerised Systems) Clause 9 & HIPAA Security Rule (Administrative Safeguards)",
        enforcementLevel: "High Priority",
        primaryOem: "CyberArk",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/cyberark.svg",
        complementaryOems: ["Entrust", "Check Point"],
        blueprintSpec:
          "Privileged access session management for validated lab workstations and cleanroom PLC interfaces with multi-factor biometric approval and continuous screen recording.",
        auditProof:
          "Tamper-proof MP4 video session logs, dual-approval workflow tickets, automated credential cycling post-maintenance.",
      },
      {
        controlId: "PHR-CTL-04",
        capability: "Continuous Vulnerability Scanning for Validated Computer Systems",
        regulatoryStandard: "HIPAA",
        regulatoryMandate:
          "FDA Guidance on Cybersecurity for Medical Devices & GxP Continuous System Maintenance",
        enforcementLevel: "Audit Essential",
        primaryOem: "Tenable",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Tenable.svg",
        complementaryOems: ["Splunk", "Check Point"],
        blueprintSpec:
          "Non-intrusive exposure assessment tailored for validated GxP environments, ensuring vulnerability detection without invalidating software compliance certifications.",
        auditProof:
          "Validated system scan reports, zero operational disruption attestations, change-control change ticket integrations.",
      },
    ],
    blueprints: [
      {
        title: "FDA 21 CFR Part 11 & GxP Compliant Validation Architecture",
        description:
          "Hardware-rooted electronic signatures, zero-trust cleanroom access, and DLP exfiltration prevention for pharmaceutical manufacturing plants.",
        primaryOems: ["Entrust", "CyberArk", "Forcepoint", "EDB"],
        complianceTags: ["FDA 21 CFR Part 11", "GxP Annex 11", "HIPAA"],
        labStatus: "Verified Physical Testbed",
        blueprintSlug: "pharma-gxp-validation-stack",
      },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare, Hospitals & Telehealth",
    shortTitle: "Healthcare",
    icon: "Stethoscope",
    badge: "HIPAA & Patient Privacy",
    regulatoryAuthority: "HIPAA (HHS), NABH Digital Health Standards, DPDP Act 2023",
    complianceStandards: ["HIPAA", "DPDP", "NCIIPC"],
    summary:
      "Enterprise security architecture protecting electronic health records (EHR), connected medical IoT devices (IoMT), diagnostic imaging archives (PACS), and telemedicine pipelines.",
    targetWorkloads:
      "EHR/EMR Platforms, PACS Imaging Repositories, Hospital Information Systems (HIS), Patient Portals, Connected Infusion Pumps",
    labValidationTelemetry:
      "Tested for IoMT medical device isolation, automated DICOM image encryption, and 100% HIPAA technical safeguards compliance.",
    stats: {
      criticalControls: 7,
      certifiedBlueprints: 2,
      oemIntegrations: 6,
      auditReadiness: "100%",
    },
    matrixControls: [
      {
        controlId: "HLT-CTL-01",
        capability: "Protected Health Information (ePHI) Encryption at Rest & Transit",
        regulatoryStandard: "HIPAA",
        regulatoryMandate:
          "HIPAA Security Rule 45 CFR § 164.312(a)(2)(iv) & § 164.312(e)(2)(ii) (Encryption & Decryption)",
        enforcementLevel: "Mandatory Core",
        primaryOem: "Entrust",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/entrust.png",
        complementaryOems: ["EDB", "Forcepoint"],
        blueprintSpec:
          "Centralized KeyControl key management orchestrating AES-256 encryption across PACS image archives, EHR database tables, and patient portal databases.",
        auditProof:
          "Key rotation audit certificates, verified zero-plaintext database dumps, cryptographically sealed disaster recovery backups.",
      },
      {
        controlId: "HLT-CTL-02",
        capability: "Internet of Medical Things (IoMT) Micro-Segmentation",
        regulatoryStandard: "HIPAA",
        regulatoryMandate:
          "HIPAA Security Rule § 164.312(e)(1) (Transmission Security & Isolation of Life-Critical Devices)",
        enforcementLevel: "Mandatory Core",
        primaryOem: "Check Point",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg",
        complementaryOems: ["Arista Networks", "Tenable"],
        blueprintSpec:
          "Zero-Trust Network Architecture dynamically placing patient monitors, infusion pumps, and MRI scanners into strictly isolated micro-segments with protocol inspection.",
        auditProof:
          "Micro-segment firewall pass/drop logs, blocked unauthorized lateral SMB/RDP scans, verified 100% medical device inventory.",
      },
      {
        controlId: "HLT-CTL-03",
        capability: "Patient Data Loss Prevention & Accidental Leak Interception",
        regulatoryStandard: "DPDP",
        regulatoryMandate:
          "DPDP Act 2023 Sec 9 (Processing of Personal Data of Children & Sensitive Health Data) & HIPAA Privacy Rule",
        enforcementLevel: "High Priority",
        primaryOem: "Forcepoint",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/forcepoint.svg",
        complementaryOems: ["Google Cloud", "Entrust"],
        blueprintSpec:
          "DLP engine inspecting clinician emails, cloud storage shares, and telemedicine messaging for patient diagnostics, lab test PDFs, and prescription leaks.",
        auditProof:
          "Real-time intercept alerts, automated redaction reports, incident escalation tracking logs.",
      },
      {
        controlId: "HLT-CTL-04",
        capability: "Healthcare Infrastructure Vulnerability & IoMT Exposure Mapping",
        regulatoryStandard: "HIPAA",
        regulatoryMandate:
          "HIPAA Security Rule § 164.308(a)(1)(ii)(A) (Mandatory Risk Analysis & Exposure Remediation)",
        enforcementLevel: "Audit Essential",
        primaryOem: "Tenable",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Tenable.svg",
        complementaryOems: ["Splunk", "CyberArk"],
        blueprintSpec:
          "Specialized vulnerability scanning profiling hospital subnets, unpatched DICOM servers, and obsolete embedded operating systems without causing device reboots.",
        auditProof:
          "Executive HIPAA risk assessment reports, prioritized IoMT vulnerability remediation tickets, continuous attack surface telemetry.",
      },
      {
        controlId: "HLT-CTL-05",
        capability: "Emergency Room & ICU High-Availability Database Architecture",
        regulatoryStandard: "NCIIPC",
        regulatoryMandate:
          "NCIIPC Healthcare Critical Infrastructure Continuity & NABH Emergency Care Uptime Standards",
        enforcementLevel: "Mandatory Core",
        primaryOem: "EDB",
        primaryOemLogo: "/assets/img/oems/edb.svg",
        complementaryOems: ["Virtuozzo", "Entrust"],
        blueprintSpec:
          "EDB Postgres Advanced Server deployed in active-active high-availability configuration providing continuous 99.999% uptime for emergency room HIS workflows.",
        auditProof:
          "Instant failover telemetry logs (< 3 seconds), zero clinical transaction loss verification, automated daily snapshot verification.",
      },
    ],
    blueprints: [
      {
        title: "HIPAA-Verified IoMT & EHR Patient Data Shield",
        description:
          "Comprehensive hospital security blueprint combining Entrust encryption, Check Point IoMT micro-segmentation, and Forcepoint healthcare DLP.",
        primaryOems: ["Entrust", "Check Point", "Forcepoint", "Tenable"],
        complianceTags: ["HIPAA Security Rule", "DPDP Act 2023", "NABH"],
        labStatus: "Verified Physical Testbed",
        blueprintSlug: "healthcare-hippa-shield",
      },
    ],
  },
  {
    id: "government",
    name: "Government, Public Sector & Defense",
    shortTitle: "Government",
    icon: "Building2",
    badge: "Sovereign State Grade",
    regulatoryAuthority: "NCIIPC, CERT-In, Ministry of Electronics and Information Technology (MeitY)",
    complianceStandards: ["NCIIPC", "DPDP", "CERT-In"],
    summary:
      "Hardened sovereign architectures complying with national critical information infrastructure guidelines, MeitY cloud security benchmarks, and CERT-In 6-hour incident reporting mandates.",
    targetWorkloads:
      "Citizen Identity Portals, Tax Administration Platforms, Land Records, Sovereign Clouds, Defense Telemetry",
    labValidationTelemetry:
      "Tested for CERT-In compliant 180-day immutable log archiving, sovereign cryptographic key isolation, and high-volume citizen portal DDoS protection.",
    stats: {
      criticalControls: 7,
      certifiedBlueprints: 2,
      oemIntegrations: 6,
      auditReadiness: "100%",
    },
    matrixControls: [
      {
        controlId: "GOV-CTL-01",
        capability: "CERT-In Compliant Immutable Log Vault & 6-Hour Incident Telemetry",
        regulatoryStandard: "NCIIPC",
        regulatoryMandate:
          "CERT-In Cyber Security Directions April 2022 Section 2 (Mandatory 180-Day Sovereign Log Retention)",
        enforcementLevel: "Mandatory Core",
        primaryOem: "Splunk",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/splunk.svg",
        complementaryOems: ["Check Point", "CyberArk"],
        blueprintSpec:
          "High-ingest sovereign SIEM with automated log parsing, WORM (Write Once Read Many) storage encryption, and automated 6-hour incident report generation for CERT-In.",
        auditProof:
          "Tamper-evident log integrity hashes, automated CERT-In incident notification templates, multi-year retention proof.",
      },
      {
        controlId: "GOV-CTL-02",
        capability: "Citizen Aadhaar & Biometric Data Security Vault",
        regulatoryStandard: "DPDP",
        regulatoryMandate:
          "DPDP Act 2023 Sec 8 & UIDAI Aadhaar Act Regulation 14 (Mandatory HSM Isolation for Biometric Matching)",
        enforcementLevel: "Strict Sovereign Control",
        primaryOem: "Entrust",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/entrust.png",
        complementaryOems: ["EDB", "Forcepoint"],
        blueprintSpec:
          "FIPS 140-3 Level 3 Hardware Security Module creating isolated cryptographic enclaves for Aadhaar Vault tokenization and identity verification.",
        auditProof:
          "Physical tamper response logs, tokenization verification records, zero plaintext biometric data leakage attestations.",
      },
      {
        controlId: "GOV-CTL-03",
        capability: "Sovereign Cloud & Edge Data Center Virtualization",
        regulatoryStandard: "NCIIPC",
        regulatoryMandate:
          "MeitY Empanelment Guidelines for Sovereign Cloud & NCIIPC Isolation Mandates",
        enforcementLevel: "Mandatory Core",
        primaryOem: "Virtuozzo",
        primaryOemLogo: "/assets/img/oems/virtuozzo.svg",
        complementaryOems: ["EDB", "Arista Networks"],
        blueprintSpec:
          "Open-source based sovereign cloud virtualization substrate delivering isolated compute, software-defined storage, and zero foreign backdoors.",
        auditProof:
          "Sovereign data residency audit certificates, complete hypervisor source verification, air-gapped deployment reports.",
      },
      {
        controlId: "GOV-CTL-04",
        capability: "National Portal Multi-Terabit DDoS Defense & Web Shield",
        regulatoryStandard: "NCIIPC",
        regulatoryMandate:
          "NCIIPC CII Guideline Clause 8.1 (Mandatory Volumetric DDoS Protection for Citizen Services)",
        enforcementLevel: "High Priority",
        primaryOem: "Check Point",
        primaryOemLogo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg",
        complementaryOems: ["Arista Networks", "Google Cloud"],
        blueprintSpec:
          "Distributed Denial of Service mitigation scrubbing line-rate attacks across BGP routing layers with zero latency impact for legitimate citizens.",
        auditProof:
          "Simulated 400 Gbps attack scrubbing logs, sub-second attack mitigation telemetry, zero portal outage records.",
      },
      {
        controlId: "GOV-CTL-05",
        capability: "Sovereign Relational Enterprise Database for Land & Tax Records",
        regulatoryStandard: "DPDP",
        regulatoryMandate:
          "MeitY National Data Governance Framework & DPDP Sovereign Storage Mandates",
        enforcementLevel: "Mandatory Core",
        primaryOem: "EDB",
        primaryOemLogo: "/assets/img/oems/edb.svg",
        complementaryOems: ["Virtuozzo", "Entrust"],
        blueprintSpec:
          "EDB Postgres Advanced Server deployed across on-premises sovereign data centers with strict role-based row-level security and hardware key encryption.",
        auditProof:
          "Row-level security audit logs, data localization certificates, tamper-sealed transaction logs.",
      },
    ],
    blueprints: [
      {
        title: "NCIIPC & CERT-In Sovereign Defense Blueprint",
        description:
          "Hardened architecture providing 180-day immutable log vaulting, Entrust Aadhaar tokenization, and Check Point DDoS defense for state and national infrastructure.",
        primaryOems: ["Splunk", "Entrust", "Check Point", "Virtuozzo"],
        complianceTags: ["NCIIPC CII", "CERT-In 2022", "DPDP Act 2023"],
        labStatus: "Verified Physical Testbed",
        blueprintSlug: "gov-sovereign-defense-blueprint",
      },
    ],
  },
];

/**
 * Helper to fetch a vertical domain by id
 */
export function getVerticalDomainById(id) {
  return VERTICAL_DOMAINS.find((v) => v.id === id) || VERTICAL_DOMAINS[0];
}

/**
 * Helper to filter controls by regulatory standard
 */
export function filterControlsByRegulation(regulation) {
  if (!regulation || regulation === "All") {
    return VERTICAL_DOMAINS.flatMap((v) =>
      v.matrixControls.map((c) => ({ ...c, verticalName: v.shortTitle, verticalId: v.id }))
    );
  }

  const regNorm = regulation.toUpperCase().trim();
  return VERTICAL_DOMAINS.flatMap((v) =>
    v.matrixControls
      .filter((c) => c.regulatoryStandard.toUpperCase().includes(regNorm))
      .map((c) => ({ ...c, verticalName: v.shortTitle, verticalId: v.id }))
  );
}
