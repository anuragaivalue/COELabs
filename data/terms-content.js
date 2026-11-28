export const termsMeta = {
  lastUpdated: "November 2026",
  effectiveDate: "November 27, 2026",
  entityName: "iValue InfoSolutions Limited",
  jurisdiction: "Bangalore, Karnataka, India"
};

export const termsSections = [
  {
    id: "acceptance",
    number: "01",
    shortTitle: "Acceptance",
    title: "Acceptance of Terms",
    summary:
      "By accessing the iValue Center of Excellence portal, physical facilities, or remote laboratory sandboxes, you agree to be bound by these Terms and Conditions.",
    paragraphs: [
      "These Terms and Conditions (\"Terms\") constitute a legally binding agreement between you (\"User\", \"Enterprise Client\", \"Partner\", or \"OEM Representative\") and iValue InfoSolutions Limited (\"iValue\", \"we\", \"us\", or \"our\").",
      "By accessing or using the iValue Center of Excellence (\"CoE\") website, PoC scheduling portals, technical collateral, physical demonstration suites, or remote virtual testbeds, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.",
      "If you are entering into these Terms on behalf of an enterprise, company, or other legal entity, you represent that you possess the requisite authority to bind such entity to these provisions."
    ]
  },
  {
    id: "portal-and-lab-usage",
    number: "02",
    shortTitle: "Portal & Lab Usage",
    title: "Portal & Laboratory Usage Guidelines",
    summary:
      "Rules and acceptable use policies governing access to our physical testing suites and virtual simulation sandboxes.",
    paragraphs: [
      "The CoE provides controlled, isolated demonstration and pre-production proof-of-concept (\"PoC\") environments. Access is granted solely for evaluating technology interoperability, performance benchmarking, and architectural validation.",
      "Users are strictly prohibited from attempting unauthorized privilege escalation, network reconnaissance outside designated lab subnets, testing destructive malware outside isolated adversary sandboxes, or reverse-engineering proprietary test harnesses.",
      "All credentials, VPN keys, API access tokens, and temporary sandbox access links assigned to a user are confidential and personal to the authorized individual; sharing credentials across unauthorized parties is strictly prohibited.",
      "iValue reserves the right to terminate or suspend sandbox sessions immediately without prior notice upon detection of anomalous, unauthorized, or malicious activity."
    ]
  },
  {
    id: "intellectual-property",
    number: "03",
    shortTitle: "Intellectual Property",
    title: "Intellectual Property Rights",
    summary:
      "Ownership of architectural blueprints, benchmarks, trademarks, and CoE evaluation collateral.",
    paragraphs: [
      "All proprietary multi-vendor solution architectures, custom integration scripts, ROI calculation algorithms, evaluation playbooks, and website content are the exclusive intellectual property of iValue InfoSolutions Limited.",
      "OEM trademarks, product names, logos, and technical specifications featured on this portal are the property of their respective Original Equipment Manufacturers and are displayed under authorized partnership arrangements for demonstration purposes.",
      "Users are granted a limited, non-exclusive, non-transferable, revocable license to access and review custom architectural blueprints and evaluation outputs solely for internal evaluation and procurement planning purposes."
    ]
  },
  {
    id: "disclaimers",
    number: "04",
    shortTitle: "Disclaimers",
    title: "Technical Disclaimers & Warranties",
    summary:
      "Clarification on the evaluative and pre-production nature of CoE test results and performance benchmarks.",
    paragraphs: [
      "All architectural blueprints, performance metrics, and compliance mappings provided by the CoE are provided on an \"AS IS\" and \"AS AVAILABLE\" basis for evaluative and advisory purposes.",
      "While iValue takes meticulous engineering measures to ensure accuracy in multi-vendor interoperability testing, we do not warrant that testbed results will perfectly mirror every live enterprise production environment without customized implementation tuning.",
      "iValue expressly disclaims all warranties of any kind, whether express, implied, statutory, or otherwise, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement."
    ]
  },
  {
    id: "limitation-of-liability",
    number: "05",
    shortTitle: "Limitation of Liability",
    title: "Limitation of Liability",
    summary:
      "Limits on damages arising out of portal access, laboratory demonstrations, or procurement advisory.",
    paragraphs: [
      "To the maximum extent permitted by applicable law, in no event shall iValue InfoSolutions Limited, its directors, officers, employees, or OEM partners be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages.",
      "This includes, but is not limited to, damages for loss of profits, goodwill, data, business interruption, or procurement costs resulting from the use or inability to use the CoE portal or reliance on advisory blueprints.",
      "In any event, iValue's total aggregate liability arising under these Terms shall not exceed the amount actually paid by the user to iValue for the specific evaluation engagement giving rise to liability."
    ]
  },
  {
    id: "governing-law",
    number: "06",
    shortTitle: "Governing Law",
    title: "Governing Law & Dispute Resolution",
    summary:
      "Jurisdiction, applicable legal framework, and arbitration procedures.",
    paragraphs: [
      "These Terms shall be governed by, construed, and enforced in accordance with the substantive laws of India, without regard to its conflict of law principles.",
      "Any dispute, controversy, or claim arising out of or relating to these Terms, including their breach or validity, shall be subject to the exclusive jurisdiction of the competent courts situated in Bangalore, Karnataka, India.",
      "Parties agree to make reasonable good-faith efforts to resolve any dispute through senior executive escalation before initiating formal legal proceedings."
    ]
  }
];

const termsContent = {
  termsMeta,
  termsSections
};

export default termsContent;
