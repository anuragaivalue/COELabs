/**
 * iValue Center of Excellence - Stack Controls & Specifications
 * Data harvested from the official MAIN platform: https://coe.ivaluegroup.com
 * Maps tech & vertical stack controls to compliance frameworks and validated OEM architectures.
 */

export const stackControlsData = {
  scoControls: {
    slug: "scoControls",
    title: "Security Operations Center (SOC) Stack Controls",
    shortTitle: "SOC Stack Controls",
    category: "Technology Stack",
    tagline: "Centralized SIEM, Detection Engineering, UEBA & Real-Time Incident Orchestration",
    overview:
      "The iValue CoE Security Operations Center (SOC) Stack combines industry-leading streaming telemetry ingestion, behavioral analytics, threat intelligence, and autonomous response playbooks into a single unified architecture. Validated against high-throughput enterprise enterprise workloads to eliminate analyst fatigue and cut Mean Time to Detect (MTTD) to minutes.",
    compliance: [
      { name: "CERT-In Directive", desc: "Mandatory 6-hour incident reporting & 180-day log retention compliance" },
      { name: "RBI Cyber Security Framework", desc: "Continuous baseline monitoring, threat intelligence feed integration & SOC SLA tracking" },
      { name: "SEBI CSCRF", desc: "Securities market critical cyber-resilience controls and automated evidence capture" },
      { name: "NCIIPC Guidelines", desc: "Protection of Critical Information Infrastructure against targeted APT campaigns" }
    ],
    oems: [
      { name: "Google Cloud (Chronicle)", role: "Petabyte-scale SIEM & Mandiant Threat Intelligence", logo: "https://cdn.ivaluetv.com/oem/googlecloud.svg" },
      { name: "Splunk", role: "Unified Enterprise Observability & Security Analytics", logo: "https://cdn.ivaluetv.com/oem/splunk.svg" },
      { name: "SentinelOne", role: "Singularity XDR & Autonomous Storyline Correlation", logo: "https://cdn.ivaluetv.com/oem/SentinelOne.svg" },
      { name: "Check Point", role: "Quantum Perimeter & CloudGuard Threat Telemetry", logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg" },
      { name: "Tenable", role: "Continuous Exposure Management & Vulnerability Telemetry", logo: "https://cdn.ivaluetv.com/oem/Tenable.svg" }
    ],
    controls: [
      { id: "SOC-01", name: "High-Volume Telemetry Ingestion", desc: "Normalized event ingestion from firewalls, identity providers, cloud workloads, and endpoints at over 100,000 EPS." },
      { id: "SOC-02", name: "UEBA & Anomaly Correlation", desc: "Machine learning behavioral profiling of users and service accounts to detect insider threats and lateral movement." },
      { id: "SOC-03", name: "MITRE ATT&CK Mapping", desc: "Automated tagging of alerts against MITRE ATT&CK tactics, techniques, and procedures (TTPs) for tactical response." },
      { id: "SOC-04", name: "Autonomous SOAR Playbooks", desc: "Pre-integrated remediation workflows for host isolation, credential revocation, and malicious IP blacklisting." },
      { id: "SOC-05", name: "Threat Intelligence Fusion", desc: "Bidirectional sharing of threat indicators (STIX/TAXII) with global feeds and sector-specific CERT advisories." }
    ],
    multiplier: "4.2x faster incident resolution with pre-integrated SOAR playbooks and unified telemetry."
  },

  iamControls: {
    slug: "iamControls",
    title: "Identity & Access Management (IAM) Stack Controls",
    shortTitle: "IAM / IDAM Controls",
    category: "Technology Stack",
    tagline: "Identity Uniqueness, Adaptive MFA, Privileged Access & Lifecycle Governance",
    overview:
      "A zero-trust identity architecture ensuring the right individual has the right access to the right resources at the right time. Provides full coverage across identity governance and administration (IGA), privileged access management (PAM), and risk-based adaptive authentication.",
    compliance: [
      { name: "SEBI CSCRF IDAM Mandate", desc: "Strict enforcement of identity uniqueness, quarterly entitlement reviews, and dual approval" },
      { name: "RBI Master Direction", desc: "Mandatory time-based session recording and privilege escalation containment" },
      { name: "DPDP Act 2023", desc: "Consent-aware data principal access control and principle of least privilege" },
      { name: "CERT-In MFA Requirement", desc: "Phishing-resistant FIDO2 / hardware token authentication for all admin consoles" }
    ],
    oems: [
      { name: "CyberArk", role: "Privileged Access Management (PAM) & Credential Vaulting", logo: "https://cdn.ivaluetv.com/oem/cyberark.svg" },
      { name: "Entrust", role: "PKI Digital Certificates & Adaptive Identity as a Service (IDaaS)", logo: "https://cdn.ivaluetv.com/oem/entrust.png" },
      { name: "OpenText NetIQ", role: "Identity Governance, Administration & Audit Attestation", logo: "https://cdn.ivaluetv.com/oem/OpenText_logo.svg" },
      { name: "Netskope", role: "Cloud Identity & Zero Trust Network Access (ZTNA)", logo: "https://cdn.ivaluetv.com/oem/Netskope.svg" }
    ],
    controls: [
      { id: "IAM-01", name: "Single Identity Truth & Uniqueness", desc: "Consolidated directory synchronization with deduplication across Active Directory, Azure AD, and HRMS systems." },
      { id: "IAM-02", name: "Privileged Access Session Vaulting", desc: "Just-In-Time (JIT) privilege elevation with full SSH/RDP keystroke logging and tamper-proof session video recording." },
      { id: "IAM-03", name: "Automated Joiner-Mover-Leaver (JML)", desc: "Event-driven user provisioning and instantaneous de-provisioning within 60 seconds of HR termination." },
      { id: "IAM-04", name: "Adaptive Contextual MFA", desc: "Risk-based authentication enforcing step-up verification based on geolocation, device posture, and IP reputation." },
      { id: "IAM-05", name: "Segregation of Duties (SoD)", desc: "Automated policy conflict checks preventing toxic combinations of financial and operational system permissions." }
    ],
    multiplier: "65% reduction in privilege abuse vectors and 90% faster compliance audit sign-offs."
  },

  cloudSecurityControls: {
    slug: "cloudSecurityControls",
    title: "Cloud Security Stack Controls",
    shortTitle: "Cloud Security Controls",
    category: "Technology Stack",
    tagline: "CNAPP, CSPM, CWPP & Automated Hybrid Cloud Governance",
    overview:
      "Comprehensive cloud-native security architecture delivering visibility, workload protection, and microsegmentation across AWS, Azure, Google Cloud, and private enterprise datacentres.",
    compliance: [
      { name: "CIS Cloud Benchmarks", desc: "Automated configuration audit against Foundation Level 1 and 2 standards" },
      { name: "RBI Cloud Directives", desc: "Data residency, cryptographic isolation, and key custodianship controls" },
      { name: "ISO/IEC 27017 & 27018", desc: "Information security controls for cloud service providers and PII protection" },
      { name: "DPDP Data Localization", desc: "Zero-egress verification ensuring sensitive citizen records remain in-country" }
    ],
    oems: [
      { name: "Google Cloud", role: "Secure Cloud Foundation, Chronicle & Mandiant Integration", logo: "https://cdn.ivaluetv.com/oem/googlecloud.svg" },
      { name: "Netskope", role: "CASB, Next-Gen SWG & Private Access (ZTNA)", logo: "https://cdn.ivaluetv.com/oem/Netskope.svg" },
      { name: "Check Point", role: "CloudGuard Network Security & Posture Management", logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg" },
      { name: "Akamai", role: "Edge Cloud Protection, DDoS Shield & Cloud Performance", logo: "https://cdn.ivaluetv.com/oem/akamai-logo.svg" }
    ],
    controls: [
      { id: "CLS-01", name: "Continuous CSPM Posture Audit", desc: "Automated scanning for open S3 buckets, permissive security groups, and unencrypted databases with auto-remediation." },
      { id: "CLS-02", name: "Container & Kubernetes Security", desc: "Runtime admission control, pod-to-pod microsegmentation, and image vulnerability scanning before production deployment." },
      { id: "CLS-03", name: "Cloud Access Security Broker (CASB)", desc: "Inline real-time inspection of enterprise SaaS applications to prevent unmanaged shadow IT and data leakage." },
      { id: "CLS-04", name: "Microsegmentation & Zero Trust", desc: "Software-defined zero-trust network boundaries preventing lateral movement between cloud VPCs." },
      { id: "CLS-05", name: "Cloud Key Management (BYOK / HYOK)", desc: "Customer-managed hardware security modules (HSM) maintaining key ownership independent of the cloud provider." }
    ],
    multiplier: "3.8x faster cloud deployment velocity with pre-built Infrastructure-as-Code security guardrails."
  },

  endpointControls: {
    slug: "endpointControls",
    title: "Endpoint & Mobile Security Stack Controls",
    shortTitle: "Endpoint Stack Controls",
    category: "Technology Stack",
    tagline: "Autonomous EDR/XDR, Rollback, Threat Defense & Unified Endpoint Management",
    overview:
      "Zero-trust endpoint defense unifying prevention, detection, and autonomous remediation across Windows, macOS, Linux, and mobile devices, stopping advanced ransomware and fileless memory attacks.",
    compliance: [
      { name: "CERT-In Endpoint Guidelines", desc: "Mandatory host-level forensic log retention and prompt threat containment" },
      { name: "SEBI CSCRF", desc: "Full disk encryption, USB port lockdown, and tamper-proof agent monitoring" },
      { name: "RBI Cybersecurity Framework", desc: "Continuous anti-malware updating and device compliance health checking" }
    ],
    oems: [
      { name: "SentinelOne", role: "Autonomous AI Endpoint Detection & Response (EDR) with Rollback", logo: "https://cdn.ivaluetv.com/oem/SentinelOne.svg" },
      { name: "Tenable", role: "Continuous Endpoint Vulnerability Scanning & Risk Prioritization", logo: "https://cdn.ivaluetv.com/oem/Tenable.svg" },
      { name: "Check Point", role: "Harmony Endpoint Protection & Anti-Ransomware", logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg" },
      { name: "Forcepoint", role: "Endpoint Data Loss Prevention (DLP) & Device Control", logo: "https://cdn.ivaluetv.com/oem/forcepoint.svg" }
    ],
    controls: [
      { id: "EDR-01", name: "Autonomous Behavioral AI", desc: "On-device AI engine analyzing process execution trees in real time, effective even when devices are disconnected from the network." },
      { id: "EDR-02", name: "1-Click Ransomware Rollback", desc: "Cryptographic volume shadow copy restoration returning encrypted systems to their pristine pre-infection state within minutes." },
      { id: "EDR-03", name: "Endpoint Privilege Management", desc: "Removal of local administrative rights, replacing static privilege with on-demand application whitelisting." },
      { id: "EDR-04", name: "Continuous Patch & Vulnerability Audit", desc: "Real-time discovery of unpatched zero-day vulnerabilities in OS and third-party software with risk scoring." },
      { id: "EDR-05", name: "Peripheral & Removable Media Lockdown", desc: "Granular USB encryption, Bluetooth file transfer controls, and screen capture prevention." }
    ],
    multiplier: "99.8% ransomware prevention rate with automated rollback and sub-second device isolation."
  },

  applicationSecurity: {
    slug: "applicationSecurity",
    title: "Application Security Stack Controls",
    shortTitle: "AppSec Controls",
    category: "Technology Stack",
    tagline: "Shift-Left SAST/DAST, Software Bill of Materials (SBOM), API Defense & WAAP",
    overview:
      "A complete DevSecOps application security pipeline safeguarding modern software lifecycles from source code creation to runtime production API delivery against OWASP Top 10 vulnerabilities.",
    compliance: [
      { name: "OWASP Top 10 Enterprise", desc: "Zero-vulnerability verification for injection, broken auth, and cryptographic failures" },
      { name: "PCI-DSS v4.0 Requirement 6", desc: "Mandatory automated public-facing web application vulnerability inspection" },
      { name: "RBI Mobile App Guidelines", desc: "Root/jailbreak detection, code obfuscation, and runtime self-protection" }
    ],
    oems: [
      { name: "Check Point", role: "CloudGuard AppSec WAAP with Contextual AI Engine", logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg" },
      { name: "Akamai", role: "App & API Protector, DDoS Mitigation & Bot Management", logo: "https://cdn.ivaluetv.com/oem/akamai-logo.svg" },
      { name: "OpenText", role: "Fortify Application Security Testing (SAST, DAST & IAST)", logo: "https://cdn.ivaluetv.com/oem/OpenText_logo.svg" },
      { name: "Keysight", role: "Threat Simulator & Automated Application Security Validation", logo: "https://cdn.ivaluetv.com/oem/keysight-logo.svg" }
    ],
    controls: [
      { id: "APP-01", name: "Automated CI/CD Pipeline SAST/DAST", desc: "Static and dynamic vulnerability scans running automatically on pull requests to fail insecure build deployments." },
      { id: "APP-02", name: "SBOM & Open-Source Dependency Analysis", desc: "Detection of transitive open-source software vulnerabilities (CVEs) and software licensing risks." },
      { id: "APP-03", name: "Contextual Web Application & API Protection", desc: "Machine-learning WAAP distinguishing legitimate API calls from credential stuffing, scraping, and SQL injection." },
      { id: "APP-04", name: "API Discovery & Shadow API Inventory", desc: "Automated cataloging of unmanaged API endpoints, schema validation, and sensitive data leakage checks." },
      { id: "APP-05", name: "Runtime Application Self-Protection (RASP)", desc: "In-memory telemetry instrumented within application runtimes to block zero-day exploits without signature updates." }
    ],
    multiplier: "70% reduction in production vulnerability backlog with automated pre-commit scanning."
  },

  BFSIControls: {
    slug: "BFSIControls",
    title: "BFSI Industry Stack Controls",
    shortTitle: "BFSI Stack Controls",
    category: "Vertical Industry Stack",
    tagline: "Mission-Critical Regulatory Compliance & Zero-Trust Defense for Financial Institutions",
    overview:
      "Pre-packaged solution stack tailored specifically for banks, non-banking financial companies (NBFCs), payment aggregators, and insurance enterprises operating under stringent financial regulatory mandates.",
    compliance: [
      { name: "RBI Cyber Security Framework for Banks", desc: "Annexure I & II mandatory baseline cybersecurity requirements" },
      { name: "SEBI CSCRF Framework", desc: "Mandatory compliance for stock exchanges, brokers, and mutual funds" },
      { name: "IRDAI Information & Cyber Security", desc: "Insurance data privacy, encryption standards, and board oversight" },
      { name: "PCI-DSS v4.0", desc: "Payment card industry physical and logical data encryption standards" }
    ],
    oems: [
      { name: "CyberArk", role: "Privileged Access Management for Core Banking & SWIFT", logo: "https://cdn.ivaluetv.com/oem/cyberark.svg" },
      { name: "Check Point", role: "Quantum Maestro Hyper-Scale Network Security & Perimeter", logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg" },
      { name: "Entrust", role: "Hardware Security Modules (HSM) for Financial Transactions", logo: "https://cdn.ivaluetv.com/oem/entrust.png" },
      { name: "Google Cloud", role: "Chronicle Financial SIEM & Fraud Analytics", logo: "https://cdn.ivaluetv.com/oem/googlecloud.svg" },
      { name: "Arista Networks", role: "Ultra-Low Latency Core Datacentre Switching & Telemetry", logo: "https://cdn.ivaluetv.com/oem/Arista-networks-logo.svg.png" }
    ],
    controls: [
      { id: "BFSI-01", name: "SWIFT & Core Banking Microsegmentation", desc: "Strict network isolation of core financial payment processing zones from general corporate networks." },
      { id: "BFSI-02", name: "Dual-Control Privileged Access for DBAs", desc: "Four-eyes authorization requirement before any database administrator can execute production DDL/DML scripts." },
      { id: "BFSI-03", name: "FIPS 140-2 Level 3 HSM Encryption", desc: "Cryptographic key generation and PIN verification executed inside physical tamper-resistant hardware modules." },
      { id: "BFSI-04", name: "Immutable Air-Gapped Vault Backups", desc: "WORM-compliant (Write Once Read Many) data vaults protected against internal insider tampering and ransomware." },
      { id: "BFSI-05", name: "Continuous Cyber Crisis Simulation", desc: "Automated red-team simulations and board-ready cyber risk scoring mapped against RBI inspection readiness." }
    ],
    multiplier: "100% compliance audit readiness with continuous automated evidence collection."
  },

  Manufacturingcontrols: {
    slug: "Manufacturingcontrols",
    title: "Manufacturing & OT/ICS Stack Controls",
    shortTitle: "Manufacturing Controls",
    category: "Vertical Industry Stack",
    tagline: "Converged IT/OT Security, Industrial Automation & Supply-Chain Integrity",
    overview:
      "Protects operational technology (OT), SCADA systems, industrial IoT, and distributed shop-floor machinery while bridging IT/OT visibility without risking production downtime or protocol interruptions.",
    compliance: [
      { name: "IEC 62443 Standard", desc: "Security for industrial automation and control systems (IACS)" },
      { name: "NCIIPC Guidelines", desc: "Protection of national manufacturing and critical industrial infrastructure" },
      { name: "ISO 27001:2022", desc: "Information security management system standards for smart factories" }
    ],
    oems: [
      { name: "Tenable (OT)", role: "OT Asset Discovery, Industrial Protocol Inspection & Vulnerability Management", logo: "https://cdn.ivaluetv.com/oem/Tenable.svg" },
      { name: "Check Point", role: "Ruggedized Industrial Security Gateways with SCADA Protocol Inspection", logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg" },
      { name: "Arista Networks", role: "Industrial Ethernet Infrastructure with Micro-Perimeter Telemetry", logo: "https://cdn.ivaluetv.com/oem/Arista-networks-logo.svg.png" },
      { name: "HyperView", role: "DCIM Power, Thermal & Industrial Facility Asset Tracking", logo: "https://cdn.ivaluetv.com/oem/hv-logo.svg" }
    ],
    controls: [
      { id: "MFG-01", name: "Purdue Model Network Zones & Conduits", desc: "Architectural separation isolating Level 0/1 process control loops from Level 3 supervisory networks and corporate IT." },
      { id: "MFG-02", name: "Passive OT Protocol Deep Packet Inspection", desc: "Non-intrusive monitoring of Modbus, Profinet, EtherNet/IP, and OPC-UA without introducing millisecond latency." },
      { id: "MFG-03", name: "Air-Gapped Secure Remote OEM Maintenance", desc: "Zero-trust remote access portal for external equipment maintenance vendors with session recording." },
      { id: "MFG-04", name: "Legacy OS Virtual Patching", desc: "Network-level IPS shielding unpatchable legacy Windows XP / 7 HMIs against exploits without touching machine code." },
      { id: "MFG-05", name: "Shop-Floor Removable Media Kiosks", desc: "Sanitization kiosks ensuring no malicious USB drive or technician laptop connects to machine controllers." }
    ],
    multiplier: "Zero plant floor downtime during security deployment with passive non-intrusive telemetry."
  },

  EnergyPowerControls: {
    slug: "EnergyPowerControls",
    title: "Energy & Power Grid Stack Controls",
    shortTitle: "Energy & Power Controls",
    category: "Vertical Industry Stack",
    tagline: "Critical National Infrastructure (CNI) Hardening for Power Grids & Utilities",
    overview:
      "Engineered specifically for electric generation, transmission, renewable energy microgrids, oil & gas distribution networks, and smart metering grids requiring military-grade resilience.",
    compliance: [
      { name: "CEA Cybersecurity Guidelines", desc: "Central Electricity Authority cybersecurity norms for power sector" },
      { name: "NCIIPC CII Protection", desc: "Critical Information Infrastructure mandatory protective directives" },
      { name: "CERT-In CNI Advisories", desc: "Priority threat mitigation and sector-specific threat sharing" }
    ],
    oems: [
      { name: "Tenable", role: "Substation Vulnerability Management & SCADA Posture", logo: "https://cdn.ivaluetv.com/oem/Tenable.svg" },
      { name: "Check Point", role: "Critical Infrastructure Firewalls & Threat Extraction", logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg" },
      { name: "Arista Networks", role: "Precision Time Protocol (PTP IEEE 1588) Grid Switching", logo: "https://cdn.ivaluetv.com/oem/Arista-networks-logo.svg.png" },
      { name: "HyperView", role: "Substation Thermal, Power & DCIM Infrastructure Observability", logo: "https://cdn.ivaluetv.com/oem/hv-logo.svg" },
      { name: "Keysight", role: "Industrial Protocol Fuzzing & Resilience Validation", logo: "https://cdn.ivaluetv.com/oem/keysight-logo.svg" }
    ],
    controls: [
      { id: "ENG-01", name: "Substation Cyber-Physical Hardening", desc: "Fail-safe cryptographic boundaries for IEC 61850 and DNP3 tele-protection circuits preventing remote blackout triggers." },
      { id: "ENG-02", name: "Real-Time Frequency & Telemetry Anomaly Guard", desc: "Statistical detection of abnormal voltage/frequency manipulation commands sent to grid transformers." },
      { id: "ENG-03", name: "Critical Asset Cryptographic Attestation", desc: "Continuous firmware integrity verification for smart RTUs and digital protective relays." },
      { id: "ENG-04", name: "Dedicated CNI Incident Response Protocol", desc: "Autonomous failover to islanded manual operation upon detection of coordinated nation-state attacks." },
      { id: "ENG-05", name: "Supply Chain Hardware Assurance", desc: "Rigorous factory acceptance testing (FAT) and cyber inspection before foreign hardware connects to grid backbones." }
    ],
    multiplier: "99.999% grid availability assurance with pre-validated CNI cyber blueprints."
  },

  InsuranceControls: {
    slug: "InsuranceControls",
    title: "Insurance Stack Controls",
    shortTitle: "Insurance Controls",
    category: "Vertical Industry Stack",
    tagline: "Policyholder Privacy, Fraud Mitigation & Cloud Claims Infrastructure",
    overview:
      "Tailored for life, general, and health insurers needing to protect vast amounts of sensitive policyholder PII, streamline broker/agent portal access, and automate claims fraud detection.",
    compliance: [
      { name: "IRDAI Guidelines", desc: "Comprehensive information security governance and mandatory annual audits" },
      { name: "DPDP Act 2023", desc: "Data protection rules for citizen health and financial insurance records" },
      { name: "ISO 27001", desc: "Global information security management benchmark" }
    ],
    oems: [
      { name: "Netskope", role: "Zero Trust Policyholder Document & Claims Data Protection", logo: "https://cdn.ivaluetv.com/oem/Netskope.svg" },
      { name: "CyberArk", role: "Credential Protection for Actuarial and Underwriting Systems", logo: "https://cdn.ivaluetv.com/oem/cyberark.svg" },
      { name: "Entrust", role: "Digital Signatures & Identity Proofing for Claims Processing", logo: "https://cdn.ivaluetv.com/oem/entrust.png" },
      { name: "Google Cloud", role: "Scalable Analytics for Fraud Detection & Claims Workflow", logo: "https://cdn.ivaluetv.com/oem/googlecloud.svg" }
    ],
    controls: [
      { id: "INS-01", name: "End-to-End Policyholder Document Encryption", desc: "Zero-knowledge encryption for uploaded medical records, identity proofs, and settlement documents." },
      { id: "INS-02", name: "Agent & Broker Portal Zero Trust Access", desc: "Contextual posture-based access for hundreds of thousands of independent insurance agents on unmanaged laptops." },
      { id: "INS-03", name: "Automated Claims Fraud Telemetry", desc: "Machine-learning pattern analysis correlating metadata, geolocation, and claims history to flag fraudulent claims." },
      { id: "INS-04", name: "Granular PII Data Masking", desc: "Dynamic data masking obscuring policyholder phone numbers and medical diagnoses from unauthorized call-centre reps." },
      { id: "INS-05", name: "Multi-Region Cloud Disaster Recovery", desc: "Automated continuous replication of underwriting data ensuring zero data loss (RPO = 0) across secondary cloud regions." }
    ],
    multiplier: "50% lower onboarding friction for distributed broker networks with secure ZTNA."
  },

  EnterpriseControls: {
    slug: "EnterpriseControls",
    title: "Large Enterprise Stack Controls",
    shortTitle: "Enterprise Controls",
    category: "Vertical Industry Stack",
    tagline: "Consolidated Multi-Vendor Architecture for Distributed Global Workforces",
    overview:
      "A complete multi-stack framework designed for multinational conglomerates, holding companies, and diversified enterprises managing hundreds of branch offices and hybrid workforces.",
    compliance: [
      { name: "ISO 27001:2022", desc: "Global ISMS certification controls covering people, processes, and technology" },
      { name: "SOC 2 Type II", desc: "Security, availability, confidentiality, and privacy trust principles" },
      { name: "CERT-In Enterprise", desc: "Timely incident response, logging, and coordinated vulnerability disclosure" }
    ],
    oems: [
      { name: "Arista Networks", role: "Cognitive Enterprise Campus & Datacentre Networking", logo: "https://cdn.ivaluetv.com/oem/Arista-networks-logo.svg.png" },
      { name: "Check Point", role: "Unified Infinity Architecture Across Network, Cloud and Workspace", logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg" },
      { name: "CyberArk", role: "Enterprise PAM & Secrets Management for DevOps", logo: "https://cdn.ivaluetv.com/oem/cyberark.svg" },
      { name: "Netskope", role: "Enterprise SASE & Cloud Security Service Edge", logo: "https://cdn.ivaluetv.com/oem/Netskope.svg" },
      { name: "Tenable", role: "Enterprise Exposure Management & Attack Surface Reduction", logo: "https://cdn.ivaluetv.com/oem/Tenable.svg" }
    ],
    controls: [
      { id: "ENT-01", name: "Unified Global SASE Connectivity", desc: "Direct-to-cloud secure SD-WAN routing eliminating backhauling bottlenecks for 50,000+ branch employees." },
      { id: "ENT-02", name: "Centralized Multi-Domain Identity Federation", desc: "Seamless single sign-on linking disparate Active Directory forests, Workday HR, and subsidiary portals." },
      { id: "ENT-03", name: "Unified Threat Telemetry Aggregation", desc: "Holistic single-pane-of-glass dashboard consolidating alerts from network firewalls, endpoints, and multi-cloud." },
      { id: "ENT-04", name: "Automated Third-Party Vendor Risk Audit", desc: "Continuous cyber rating and automated questionnaire enforcement for tier-1 and tier-2 supply chain vendors." },
      { id: "ENT-05", name: "Datacentre Power & Carbon Observability", desc: "AI-driven DCIM monitoring optimizing server rack power density and cooling efficiency." }
    ],
    multiplier: "35% lower TCO through vendor consolidation and integrated multistack management."
  },

  PharmaControls: {
    slug: "PharmaControls",
    title: "Pharma & Life Sciences Stack Controls",
    shortTitle: "Pharma Controls",
    category: "Vertical Industry Stack",
    tagline: "R&D Intellectual Property Protection, Clinical Data Privacy & GxP Compliance",
    overview:
      "Purpose-built for pharmaceutical innovators, contract research organizations (CROs), and biotech companies to safeguard drug development formulas, clinical trial data, and manufacturing batch records.",
    compliance: [
      { name: "US FDA 21 CFR Part 11", desc: "Electronic records, electronic signatures, and computerized system validation" },
      { name: "DPDP Act 2023", desc: "Confidentiality and consent tracking for clinical trial participants" },
      { name: "GxP Data Integrity", desc: "ALCOA+ principles ensuring attributable, legible, contemporaneous, original, and accurate data" }
    ],
    oems: [
      { name: "OpenText", role: "Enterprise Document Management & GxP Audit Vaulting", logo: "https://cdn.ivaluetv.com/oem/OpenText_logo.svg" },
      { name: "Entrust", role: "Compliant Digital Signatures & Cryptographic Timestamping", logo: "https://cdn.ivaluetv.com/oem/entrust.png" },
      { name: "CyberArk", role: "Privileged Access Controls for Laboratory Information Management (LIMS)", logo: "https://cdn.ivaluetv.com/oem/cyberark.svg" },
      { name: "Check Point", role: "Cleanroom Network Isolation & Intellectual Property DLP", logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg" }
    ],
    controls: [
      { id: "PHR-01", name: "Proprietary R&D Formula Vault", desc: "Hardware-encrypted document vaults preventing IP theft or unauthorized exfiltration of proprietary drug patents." },
      { id: "PHR-02", name: "Tamper-Proof Electronic Batch Records", desc: "Cryptographic timestamping and immutable audit trails fulfilling global regulatory inspection mandates." },
      { id: "PHR-03", name: "Clinical Trial Patient Anonymization", desc: "Automated de-identification algorithms removing direct identifiers from clinical research datasets." },
      { id: "PHR-04", name: "Cleanroom & Laboratory IoT Isolation", desc: "Strict VLAN and zero-trust segmentation isolating spectrographs, centrifuges, and synthesizers from internet access." },
      { id: "PHR-05", name: "Cold-Chain IoT Sensor Integrity", desc: "Continuous cryptographic validation of temperature monitoring sensors across global vaccine and biologics shipping." }
    ],
    multiplier: "100% GxP inspection readiness with validated electronic records and automated audit logs."
  },

  DigitalNativesControls: {
    slug: "DigitalNativesControls",
    title: "Digital Natives & SaaS Stack Controls",
    shortTitle: "Digital Natives Controls",
    category: "Vertical Industry Stack",
    tagline: "Hyperscale Kubernetes Security, GitOps CI/CD Pipelines & Zero-Trust Cloud",
    overview:
      "Tailored for high-growth tech startups, SaaS providers, e-commerce unicorns, and cloud-native organizations demanding zero-friction developer experience alongside enterprise-grade security.",
    compliance: [
      { name: "SOC 2 Type II", desc: "Comprehensive audit readiness across Security, Availability, and Confidentiality" },
      { name: "ISO 27001", desc: "Global benchmark for SaaS architecture security and continuous compliance" },
      { name: "DPDP Act", desc: "Indian consumer data privacy, storage limitation, and consent withdrawal mechanisms" }
    ],
    oems: [
      { name: "Google Cloud", role: "Kubernetes Engine (GKE) Hardening & Cloud Armor DDoS Shield", logo: "https://cdn.ivaluetv.com/oem/googlecloud.svg" },
      { name: "SentinelOne", role: "Cloud Workload Security (CWS) for Linux Containers & Serverless", logo: "https://cdn.ivaluetv.com/oem/SentinelOne.svg" },
      { name: "Netskope", role: "Modern SASE & Developer Safe SaaS Gateway", logo: "https://cdn.ivaluetv.com/oem/Netskope.svg" },
      { name: "Akamai", role: "Global Low-Latency CDN Edge Protection & API Security", logo: "https://cdn.ivaluetv.com/oem/akamai-logo.svg" }
    ],
    controls: [
      { id: "DGT-01", name: "Runtime Container & K8s Threat Defense", desc: "Kernel-level eBPF monitoring detecting malicious crypto-mining, privilege escalation, and container escapes." },
      { id: "DGT-02", name: "Shift-Left Infrastructure as Code (IaC) Gate", desc: "Automated scanning of Terraform and Helm charts directly inside GitHub Actions to prevent misconfigurations." },
      { id: "DGT-03", name: "Mutual TLS (mTLS) Microservices Mesh", desc: "Zero-trust service-to-service communication with automatic cryptographic certificate rotation." },
      { id: "DGT-04", name: "Hyperscale DDoS & Layer-7 API Protection", desc: "Edge scrubbing capacity exceeding 250 Tbps absorbing volumetric attacks without latency spikes." },
      { id: "DGT-05", name: "Cloud Spend & FinOps Security Integration", desc: "Automated shutdown of orphaned cloud instances and anomalous compute spikes triggered by compromised keys." }
    ],
    multiplier: "5x faster developer deployment velocity with guardrails embedded directly in GitOps pipelines."
  },

  FintechControls: {
    slug: "FintechControls",
    title: "Fintech & Digital Payments Stack Controls",
    shortTitle: "Fintech Controls",
    category: "Vertical Industry Stack",
    tagline: "High-Frequency Payment Gateway Protection, API Security & PCI-DSS Compliance",
    overview:
      "Engineered for payment gateways, neo-banks, lending platforms, and wealthtech apps processing millions of real-time transactions with zero tolerance for downtime or fraud.",
    compliance: [
      { name: "PCI-DSS v4.0 Level 1", desc: "Full cardholder data environment (CDE) segmentation and encryption" },
      { name: "RBI Digital Payment Directives", desc: "Mandatory multi-factor authentication, velocity checks, and tokenization" },
      { name: "DPDP Act 2023", desc: "Financial consumer privacy and strict consent-based data processing" }
    ],
    oems: [
      { name: "Entrust", role: "Hardware Security Modules (HSM) for Tokenization & Key Custody", logo: "https://cdn.ivaluetv.com/oem/entrust.png" },
      { name: "Check Point", role: "CloudGuard WAAP & High-Throughput Perimeter Gateways", logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg" },
      { name: "CyberArk", role: "Secrets Management for High-Frequency Microservices", logo: "https://cdn.ivaluetv.com/oem/cyberark.svg" },
      { name: "Akamai", role: "Edge Tokenization & Anti-Scraping Bot Management", logo: "https://cdn.ivaluetv.com/oem/akamai-logo.svg" },
      { name: "Google Cloud", role: "Real-Time Payment Telemetry Ingestion & ML Fraud Scoring", logo: "https://cdn.ivaluetv.com/oem/googlecloud.svg" }
    ],
    controls: [
      { id: "FNT-01", name: "Cardholder Data Tokenization (CDE Vault)", desc: "Replacement of sensitive PAN details with cryptographically irreversible tokens before storage." },
      { id: "FNT-02", name: "Sub-Millisecond Anti-Bot & Velocity Shield", desc: "Machine-learning edge defense blocking credential stuffing and automated card-testing bots within 2ms." },
      { id: "FNT-03", name: "Microservices Dynamic Secrets Injection", desc: "Ephemerally generated database credentials rotating every 60 minutes via API secrets management." },
      { id: "FNT-04", name: "Open Banking API Rate Limiting & Signatures", desc: "Cryptographic HMAC signing and strict rate limiting on third-party aggregator endpoints." },
      { id: "FNT-05", name: "Sub-Second Multi-Cloud Payment Failover", desc: "Active-active multi-cloud payment gateway routing preventing transaction drops during cloud regional outages." }
    ],
    multiplier: "99.999% uptime guarantee with sub-2ms security inspection overhead."
  }
};
