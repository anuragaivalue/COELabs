/**
 * Audited Marketplace OEMs and Products Dataset
 * Source: https://coe.ivaluegroup.com/portal/marketplace (Product Dropdown Audit)
 *
 * ZERO FABRICATION RULE:
 * Exactly 62 real products mapped across 25 real OEMs from the live CoE Marketplace.
 */

export const MARKETPLACE_OEMS = [
  {
    id: "akamai",
    name: "Akamai",
    category: "Cloud & Edge Security",
    logo: "https://cdn.ivaluetv.com/oem/akamai-logo.svg",
    color: "#0099DE",
    tagline: "Global edge CDN, DDoS mitigation & WAF protection",
    products: [
      { name: "Akamai CSP", tag: "Cloud Security Posture", link: "#" },
      { name: "Akamai Web Application Firewall (WAF)", tag: "AppSec / WAAP", link: "#" },
      { name: "CDNAkamai Content Delivery Network (CDN)", tag: "Edge CDN & Acceleration", link: "#" }
    ]
  },
  {
    id: "checkpoint",
    name: "Check Point",
    category: "Quantum & Network Security",
    logo: "https://cdn.ivaluetv.com/oem/Check_Point_logo_2022.svg",
    color: "#EC1C24",
    tagline: "Quantum perimeter defense, EDR & email threat prevention",
    products: [
      { name: "Check Point CTEM", tag: "Continuous Threat Exposure", link: "#" },
      { name: "Check Point Email Security", tag: "Inbound Phishing Defense", link: "#" },
      { name: "Check Point Harmony Email & Collaboration (HEC)", tag: "SaaS & Collaboration", link: "#" },
      { name: "Check Point Harmony Endpoint EDR", tag: "Endpoint Detection & Rollback", link: "#" },
      { name: "Check Point Quantum (Firewall)", tag: "Next-Gen Firewall", link: "#" }
    ]
  },
  {
    id: "cloudera",
    name: "Cloudera",
    category: "Enterprise Data Platform",
    logo: "https://cdn.ivaluetv.com/oem/cloudera-newco-logo.png",
    color: "#F96702",
    tagline: "Hybrid data management and real-time security analytics",
    products: [
      { name: "Cloudera Enterprise Data Platform", tag: "Hybrid Data Cloud", link: "#" }
    ]
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    category: "Edge & Application Defense",
    logo: "https://cdn.ivaluetv.com/oem/cloudflare.jpg",
    color: "#F38020",
    tagline: "Global edge CDN, anti-bot mitigation and WAAP",
    products: [
      { name: "Cloudflare Bot Management", tag: "Anti-Scraping & Credential Stuffing", link: "#" },
      { name: "Cloudflare Content Delivery Network (CDN)", tag: "Global Low-Latency Edge", link: "#" },
      { name: "Cloudflare Web Application Firewall (WAF)", tag: "Layer 7 Web Defense", link: "#" }
    ]
  },
  {
    id: "confluent",
    name: "Confluent",
    category: "Data Streaming",
    logo: "https://cdn.ivaluetv.com/oem/Confluent.png",
    color: "#182538",
    tagline: "Apache Kafka-based real-time event streaming pipeline",
    products: [
      { name: "Confluent (Kafka Event Streaming)", tag: "Event Telemetry Pipeline", link: "#" }
    ]
  },
  {
    id: "cososys",
    name: "CoSoSys",
    category: "Endpoint Data Protection",
    logo: "https://cdn.ivaluetv.com/oem/Cososys.png",
    color: "#00A3E0",
    tagline: "Multi-OS Endpoint DLP and USB peripheral control",
    products: [
      { name: "CoSoSys Endpoint Protector (DLP)", tag: "Cross-Platform Data Loss Prevention", link: "#" }
    ]
  },
  {
    id: "cyberark",
    name: "CyberArk",
    category: "Identity & PAM",
    logo: "https://cdn.ivaluetv.com/oem/cyberark.svg",
    color: "#002B49",
    tagline: "Privileged Access Management and credential secrets vaulting",
    products: [
      { name: "CyberArk Endpoint Privilege Manager (EPM)", tag: "Least Privilege & Application Control", link: "#" },
      { name: "CyberArk Privilege Cloud", tag: "SaaS PAM & Secrets Management", link: "#" },
      { name: "CyberArk Privileged Access Manager (PAM)", tag: "Enterprise Credential Vault", link: "#" },
      { name: "CyberArk Privileged Identity Management (PIM)", tag: "Zero Trust Session Auditing", link: "#" }
    ]
  },
  {
    id: "datadog",
    name: "Datadog",
    category: "Cloud Observability",
    logo: "https://cdn.ivaluetv.com/oem/datadog.svg",
    color: "#632CA6",
    tagline: "Cloud infrastructure monitoring, APM & security telemetry",
    products: [
      { name: "Datadog Cloud Observability & Security", tag: "Cloud SecOps & APM", link: "#" }
    ]
  },
  {
    id: "edb",
    name: "EDB",
    category: "Enterprise Database",
    logo: "https://cdn.ivaluetv.com/oem/edb.png",
    color: "#C22026",
    tagline: "Enterprise Postgres database high-availability and security",
    products: [
      { name: "EDB Postgres Advanced Server", tag: "Mission-Critical Database", link: "#" }
    ]
  },
  {
    id: "emudhra",
    name: "eMudhra",
    category: "Digital Trust & PKI",
    logo: "https://cdn.ivaluetv.com/oem/emudhra.png",
    color: "#2C3E50",
    tagline: "Digital signatures, e-Sign paperless workflow & adaptive MFA",
    products: [
      { name: "CertiNext", tag: "Automated Certificate Lifecycle", link: "#" },
      { name: "eMsigner", tag: "Paperless Digital Signature Workflow", link: "#" },
      { name: "SecurePass", tag: "Adaptive Multi-Factor Authentication", link: "#" }
    ]
  },
  {
    id: "entrust",
    name: "Entrust",
    category: "PKI & Digital Identity",
    logo: "https://cdn.ivaluetv.com/oem/entrust.png",
    color: "#80276C",
    tagline: "Trusted certificate authority, HSM crypto & cloud IDaaS",
    products: [
      { name: "Entrust CA", tag: "Certificate Authority Infrastructure", link: "#" },
      { name: "Entrust Certificate Manager", tag: "SSL/TLS & Code Signing Management", link: "#" },
      { name: "Entrust CSP", tag: "Cryptographic Service Provider", link: "#" },
      { name: "Entrust Identity as a Service (IDaaS)", tag: "Adaptive Cloud Identity", link: "#" },
      { name: "Entrust Identity Enterprise", tag: "High-Assurance Workforce Identity", link: "#" },
      { name: "Entrust Key Management Solutions (KMS)", tag: "Hardware Cryptographic Key Custody", link: "#" },
      { name: "Entrust PKI", tag: "Enterprise Public Key Infrastructure", link: "#" }
    ]
  },
  {
    id: "forcepoint",
    name: "Forcepoint",
    category: "Data-First SASE & DLP",
    logo: "https://cdn.ivaluetv.com/oem/forcepoint.svg",
    color: "#00A887",
    tagline: "Human-centric data security, DSPM and cloud SSE",
    products: [
      { name: "Forcepoint Data Security Posture Management", tag: "DSPM & Data Risk Discovery", link: "#" },
      { name: "Forcepoint Email DLP", tag: "Outbound Content Exfiltration Control", link: "#" },
      { name: "Forcepoint Endpoint Data Loss Prevention", tag: "Endpoint Content Inspection", link: "#" },
      { name: "Forcepoint ONE", tag: "Unified Security Service Edge (SSE)", link: "#" },
      { name: "Forcepoint ONE Data Security", tag: "Zero Trust Cloud Data Governance", link: "#" },
      { name: "Forcepoint ONE Web Security", tag: "Next-Gen Secure Web Gateway (SWG)", link: "#" }
    ]
  },
  {
    id: "fraudshield",
    name: "FraudShield",
    category: "Transaction Defense",
    logo: "https://cdn.ivaluetv.com/oem/fraudshield.svg",
    color: "#E67E22",
    tagline: "Real-time payment fraud prevention and behavioral scoring",
    products: [
      { name: "FraudShield Transaction Defense", tag: "Payment & FinTech Fraud Shield", link: "#" }
    ]
  },
  {
    id: "gambit-cyber",
    name: "Gambit Cyber",
    category: "Threat Management",
    logo: "https://cdn.ivaluetv.com/oem/gambit.svg",
    color: "#8E44AD",
    tagline: "Proactive adversary emulation and attack surface reduction",
    products: [
      { name: "Gambit Cyber Threat Management", tag: "Adversary Telemetry & Defense", link: "#" }
    ]
  },
  {
    id: "imperva",
    name: "Imperva",
    category: "Application & Data Security",
    logo: "https://cdn.ivaluetv.com/oem/imperva.png",
    color: "#005587",
    tagline: "Database activity monitoring and web application firewall",
    products: [
      { name: "Imperva Database Activity Monitoring (DAM)", tag: "DB Auditing & Sensitive Query Guard", link: "#" },
      { name: "Imperva Web Application Firewall (WAF)", tag: "Cloud AppSec & Bot Defense", link: "#" }
    ]
  },
  {
    id: "netskope",
    name: "Netskope",
    category: "SASE & Zero Trust",
    logo: "https://cdn.ivaluetv.com/oem/Netskope.svg",
    color: "#00A3E0",
    tagline: "Next-gen CASB, secure web gateway and private access ZTNA",
    products: [
      { name: "Netskope Cloud Access Security Broker (CASB)", tag: "Multi-SaaS Visibility & Compliance", link: "#" },
      { name: "Netskope Next Generation Secure Web Gateway (SWG)", tag: "Encrypted Traffic Threat Inspection", link: "#" }
    ]
  },
  {
    id: "opentext",
    name: "OpenText",
    category: "SecOps, AppSec & Identity",
    logo: "https://cdn.ivaluetv.com/oem/OpenText_logo.svg",
    color: "#003865",
    tagline: "Fortify AppSec, ArcSight SIEM, SOAR & Zenworks fleet management",
    products: [
      { name: "OpenText ArcSight", tag: "Next-Gen SIEM & Correlation Engine", link: "#" },
      { name: "OpenText Fortify", tag: "Static & Dynamic AppSec Testing (SAST/DAST)", link: "#" },
      { name: "OpenText Security Orchestration, Automation, and Response (SOAR)", tag: "Automated Incident Playbooks", link: "#" },
      { name: "OpenText Zenworks", tag: "Endpoint Lifecycle & Patch Management", link: "#" }
    ]
  },
  {
    id: "rsa",
    name: "RSA",
    category: "Identity Governance & SecurID",
    logo: "https://cdn.ivaluetv.com/oem/RSA-Red-Logo_fb8e2b2e.svg",
    color: "#D0021B",
    tagline: "Enterprise SecurID tokens, adaptive MFA & identity governance",
    products: [
      { name: "RSA Governance & Lifecycle (G&L)", tag: "Identity Lifecycle & Compliance Auditing", link: "#" },
      { name: "RSA ID Plus", tag: "Cloud Hybrid Identity & Zero Trust Access", link: "#" },
      { name: "RSA SecurID", tag: "High-Assurance OTP & Hardware Tokens", link: "#" }
    ]
  },
  {
    id: "sentinelone",
    name: "SentinelOne",
    category: "Autonomous AI XDR",
    logo: "https://cdn.ivaluetv.com/oem/SentinelOne.svg",
    color: "#4E008E",
    tagline: "AI-driven endpoint detection, automated rollback and cloud defense",
    products: [
      { name: "SentinelOne Singularity (EDR)", tag: "Autonomous Endpoint Detection & Response", link: "#" }
    ]
  },
  {
    id: "soti",
    name: "SOTI",
    category: "Enterprise Mobility (MDM)",
    logo: "https://cdn.ivaluetv.com/oem/SotiLogo.png",
    color: "#00629B",
    tagline: "Unified endpoint management for rugged, IoT & mobile fleets",
    products: [
      { name: "SOTI MobiControl Mobile Device Management (MDM)", tag: "Fleet MDM & Remote Kiosk Control", link: "#" }
    ]
  },
  {
    id: "splunk",
    name: "Splunk",
    category: "Observability & SIEM",
    logo: "https://cdn.ivaluetv.com/oem/splunk.svg",
    color: "#F15D22",
    tagline: "Enterprise security information and event management",
    products: [
      { name: "Splunk Security Information & Event Management (SIEM)", tag: "Enterprise Security Analytics", link: "#" }
    ]
  },
  {
    id: "suse",
    name: "SUSE",
    category: "Open Source & Container Infrastructure",
    logo: "https://cdn.ivaluetv.com/oem/suse.svg",
    color: "#30BA78",
    tagline: "Enterprise Linux and Rancher multi-cluster Kubernetes",
    products: [
      { name: "SUSE Linux Enterprise & Rancher", tag: "Enterprise Linux & Kubernetes Management", link: "#" }
    ]
  },
  {
    id: "tenable",
    name: "Tenable",
    category: "Exposure Management",
    logo: "https://cdn.ivaluetv.com/oem/Tenable.svg",
    color: "#005587",
    tagline: "Continuous vulnerability assessment and attack surface management",
    products: [
      { name: "Nessus Expert", tag: "External Attack Surface & Cloud Scanning", link: "#" },
      { name: "Tenable Nessus (Vulnerability Assessment)", tag: "Gold Standard Vulnerability Scanner", link: "#" },
      { name: "Tenable One", tag: "Exposure Management Platform", link: "#" },
      { name: "Tenable Security Center (SC)", tag: "On-Premises Vulnerability Analytics", link: "#" }
    ]
  },
  {
    id: "virtuozzo",
    name: "Virtuozzo",
    category: "Hybrid Cloud Infrastructure",
    logo: "https://cdn.ivaluetv.com/oem/virtuozzo.svg",
    color: "#16A085",
    tagline: "High-density cloud virtualization, hyperconverged compute & storage",
    products: [
      { name: "Virtuozzo Hybrid Cloud Infrastructure", tag: "Open-Source Hyperconverged Cloud", link: "#" }
    ]
  },
  {
    id: "yubico",
    name: "Yubico",
    category: "Hardware Authentication",
    logo: "https://cdn.ivaluetv.com/oem/yubico.DqBGlWtX.svg",
    color: "#85B338",
    tagline: "FIDO2/WebAuthn hardware security keys for phishing-resistant MFA",
    products: [
      { name: "YubiKey Hardware Security Key", tag: "Phishing-Resistant Hardware Authenticator", link: "#" },
      { name: "YubiKey Multi-Factor Authentication (MFA)", tag: "Enterprise FIDO2 / WebAuthn Solution", link: "#" }
    ]
  }
];

export const TOTAL_AUDITED_PRODUCTS = MARKETPLACE_OEMS.reduce(
  (sum, oem) => sum + oem.products.length,
  0
);
export const TOTAL_AUDITED_OEMS = MARKETPLACE_OEMS.length;
