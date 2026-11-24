/**
 * iValue Center of Excellence - Navigation Configuration
 * Synchronized with the MAIN platform structure: https://coe.ivaluegroup.com
 */

export const navigationConfig = {
  // Main Top-Level Navigation Items (Order matches Image 1 with Quick Links removed)
  mainNav: [
    { label: "Home", href: "/", isInternal: true },
    { label: "OEM", href: "/oem", isInternal: true },
    { label: "Customer", href: "/customer", isInternal: true },
    { label: "Partners", href: "/partners", isInternal: true },
    { label: "Multi Stacks", dropdown: "multistacks" },
    { label: "Accelerators", dropdown: "accelerators" },
    { label: "iValue Cloud", href: "#", isPlaceholder: true }
  ],

  // Multi-Stacks Dropdown (Exact match to Image 2 & MAIN site)
  multiStacks: {
    techStacks: [
      {
        label: "Security Operations Center",
        href: "/stack/scoControls",
        desc: "Navigate to SoC Stack Controls"
      },
      {
        label: "IAM",
        href: "/stack/iamControls",
        desc: "Navigate to IAM Stack Controls"
      },
      {
        label: "Endpoint",
        href: "/stack/endpointControls",
        desc: "Navigate to Endpoint Stack Controls"
      },
      {
        label: "Cloud Security",
        href: "/stack/cloudSecurityControls",
        desc: "Navigate to Cloud Security Stack Controls"
      },
      {
        label: "Application Security",
        href: "/stack/applicationSecurity",
        desc: "Navigate to Application Security Stack Controls"
      }
    ],
    verticalStacks: [
      {
        label: "BFSI",
        href: "/stack/BFSIControls",
        desc: "Navigate to BFSI Stack Controls"
      },
      {
        label: "Manufacturing",
        href: "/stack/Manufacturingcontrols",
        desc: "Navigate to Manufacturing Stack Controls"
      },
      {
        label: "Energy & Power",
        href: "/stack/EnergyPowerControls",
        desc: "Navigate to Energy & Power Stack Controls"
      },
      {
        label: "Insurance",
        href: "/stack/InsuranceControls",
        desc: "Navigate to Insurance Stack Controls"
      },
      {
        label: "Enterprise",
        href: "/stack/EnterpriseControls",
        desc: "Navigate to Enterprise Stack Controls"
      },
      {
        label: "Pharma",
        href: "/stack/PharmaControls",
        desc: "Navigate to Pharma Stack Controls"
      },
      {
        label: "Digital Natives",
        href: "/stack/DigitalNativesControls",
        desc: "Navigate to Digital Natives Stack Controls"
      },
      {
        label: "Fintech",
        href: "/stack/FintechControls",
        desc: "Navigate to Fintech Stack Controls"
      }
    ]
  },

  // Accelerators Dropdown (Exact match to Image 3 & MAIN site)
  accelerators: {
    // Column 1: REVENUE MULTIPLIERS
    revenueMultipliers: [
      { label: "ZTNA Revenue Multiplier", href: "/multiplier/ztnamultiplier" },
      { label: "SoC Revenue Multiplier", href: "/multiplier/SoCmultiplier" },
      { label: "BFSI Revenue Multiplier", href: "/multiplier/bfsimultiplier" },
      { label: "Digital Natives Revenue Multiplier", href: "/multiplier/digitalnativesmultiplier" },
      { label: "Energy Revenue Multiplier", href: "/multiplier/energymultiplier" },
      { label: "Enterprise Revenue Multiplier", href: "/multiplier/enterprisemultiplier" },
      { label: "Fintech Revenue Multiplier", href: "/multiplier/fintechmultiplier" },
      { label: "IDAM Revenue Multiplier", href: "/multiplier/idammultiplier" },
      { label: "Insurance Revenue Multiplier", href: "/multiplier/insurancemultiplier" },
      { label: "Manufacturing Revenue Multiplier", href: "/multiplier/manufacturingmultiplier" },
      { label: "Pharma Revenue Multiplier", href: "/multiplier/pharmamultiplier" }
    ],

    // Column 2: IMPLEMENTATION SERVICES
    implementationServices: [
      { label: "Checkpoint - CloudGaurd", href: "/coming-soon?service=Checkpoint%20-%20CloudGaurd&type=implementation" },
      { label: "Checkpoint - Firewall", href: "/coming-soon?service=Checkpoint%20-%20Firewall&type=implementation" },
      { label: "Checkpoint - Harmony", href: "/coming-soon?service=Checkpoint%20-%20Harmony&type=implementation" },
      { label: "Cyberark - PIM/PAM", href: "/coming-soon?service=Cyberark%20-%20PIM%2FPAM&type=implementation" },
      { label: "Entrust - HSM", href: "/coming-soon?service=Entrust%20-%20HSM&type=implementation" },
      { label: "Entrust - Hytrust", href: "/coming-soon?service=Entrust%20-%20Hytrust&type=implementation" },
      { label: "Entrust - IDAAS -Identity", href: "/coming-soon?service=Entrust%20-%20IDAAS%20-Identity&type=implementation" },
      { label: "Forcepoint - DLP", href: "/coming-soon?service=Forcepoint%20-%20DLP&type=implementation" },
      { label: "Forcepoint - Fone", href: "/coming-soon?service=Forcepoint%20-%20Fone&type=implementation" },
      { label: "Google - Implementation Services", href: "/coming-soon?service=Google%20-%20Implementation%20Services&type=implementation" },
      { label: "Hitachi Vantara - Storage", href: "/coming-soon?service=Hitachi%20Vantara%20-%20Storage&type=implementation" },
      { label: "Imperva/Thales - DAM", href: "/coming-soon?service=Imperva%2FThales%20-%20DAM&type=implementation" },
      { label: "Imperva/Thales - HSM", href: "/coming-soon?service=Imperva%2FThales%20-%20HSM&type=implementation" },
      { label: "Imperva/Thales - KMS", href: "/coming-soon?service=Imperva%2FThales%20-%20KMS&type=implementation" },
      { label: "Imperva/Thales - WAF + RASP + DDOS + Bot protection", href: "/coming-soon?service=Imperva%2FThales%20-%20WAF%20%2B%20RASP%20%2B%20DDOS%20%2B%20Bot%20protection&type=implementation" },
      { label: "Netskope - DLP", href: "/coming-soon?service=Netskope%20-%20DLP&type=implementation" },
      { label: "Netskope - SSE", href: "/coming-soon?service=Netskope%20-%20SSE&type=implementation" },
      { label: "Nutanix - HCI Services", href: "/coming-soon?service=Nutanix%20-%20HCI%20Services&type=implementation" },
      { label: "Opentext - ArcSight", href: "/coming-soon?service=Opentext%20-%20ArcSight&type=implementation" },
      { label: "Opentext - Fortify", href: "/coming-soon?service=Opentext%20-%20Fortify&type=implementation" },
      { label: "Secops - Suite", href: "/coming-soon?service=Secops%20-%20Suite&type=implementation" },
      { label: "Sentinel One - CWP + CNAP", href: "/coming-soon?service=Sentinel%20One%20-%20CWP%20%2B%20CNAP&type=implementation" },
      { label: "Sentinel One - EDR", href: "/coming-soon?service=Sentinel%20One%20-%20EDR&type=implementation" },
      { label: "Sentinel One - Identity", href: "/coming-soon?service=Sentinel%20One%20-%20Identity&type=implementation" },
      { label: "Tenable - CSPM + CNAP + CWP", href: "/coming-soon?service=Tenable%20-%20CSPM%20%2B%20CNAP%20%2B%20CWP&type=implementation" },
      { label: "Tenable - Identity", href: "/coming-soon?service=Tenable%20-%20Identity&type=implementation" },
      { label: "Tenable - Nessus + SC + IO", href: "/coming-soon?service=Tenable%20-%20Nessus%20%2B%20SC%20%2B%20IO&type=implementation" },
      { label: "Tenable - OT", href: "/coming-soon?service=Tenable%20-%20OT&type=implementation" },
      { label: "Arista", href: "/coming-soon?service=Arista&type=implementation" }
    ],

    // Column 3: MIGRATION SERVICES
    migrationServices: [
      { label: "Transitioning from Any PAM Solution to CyberArk", href: "/migration/CyberArkPAM" },
      { label: "BeyondTrust PIM/PAM to CyberArk PIM", href: "/coming-soon?service=BeyondTrust%20PIM%2FPAM%20to%20CyberArk%20PIM&type=migration" },
      { label: "Checkmarx to Opentext Fortify", href: "/coming-soon?service=Checkmarx%20to%20Opentext%20Fortify&type=migration" },
      { label: "Digital Guardian for Data Loss Prevention /Symantec Data Loss Prevention to DLP", href: "/coming-soon?service=Digital%20Guardian%20to%20DLP&type=migration" },
      { label: "Digital Guardian/Symantec to Forcepoint DLP suit", href: "/coming-soon?service=Digital%20Guardian%20to%20Forcepoint%20DLP%20suit&type=migration" },
      { label: "Digital Guardian/Symantec to Forcepoint Endpoint DLP", href: "/coming-soon?service=Digital%20Guardian%20to%20Forcepoint%20Endpoint%20DLP&type=migration" },
      { label: "Fortanix Key Management Service (KMS) to Entrust KMS", href: "/coming-soon?service=Fortanix%20KMS%20to%20Entrust%20KMS&type=migration" },
      { label: "Fortigate NGFW/Paloalto NGFW to Checkpoint Quantum Security Gateways NGFW", href: "/coming-soon?service=Fortigate%20to%20Checkpoint%20Quantum%20NGFW&type=migration" },
      { label: "IBM Qradar to Google Chronicle", href: "/migration/GoogleChronicleSIEM" },
      { label: "IBM Qradar to Opentext Arcsight", href: "/coming-soon?service=IBM%20Qradar%20to%20Opentext%20Arcsight&type=migration" },
      { label: "IBM Qradar to Splunk SIEM", href: "/migration/SplunkSIEM" },
      { label: "IBM gaurdium to Imperva DAM", href: "/coming-soon?service=IBM%20gaurdium%20to%20Imperva%20DAM&type=migration" },
      { label: "ManageEngine Endpoint Central to Opentext Zenworks", href: "/coming-soon?service=ManageEngine%20to%20Opentext%20Zenworks&type=migration" },
      { label: "Microsoft Intune/BlackBerry Unified Endpoint Management (UEM) to SOTI MDM Server", href: "/coming-soon?service=Microsoft%20Intune%20to%20SOTI%20MDM&type=migration" },
      { label: "Qualys VMDR /Rapid7 InsightVM to Tenable Vulnerability Management", href: "/coming-soon?service=Qualys%20to%20Tenable%20Vulnerability%20Management&type=migration" },
      { label: "Qualys VMDR /Rapid7 InsightVM to Tenable Security Center", href: "/coming-soon?service=Qualys%20to%20Tenable%20Security%20Center&type=migration" }
    ],

    // Column 4: CALCULATOR (Bottom section spanning columns)
    calculators: [
      { label: "SoC Calculator", href: "/calculator/soc" },
      { label: "IDAM Calculator", href: "/calculator/idam" },
      { label: "PAM Calculator", href: "/calculator/pam" }
    ]
  }
};
