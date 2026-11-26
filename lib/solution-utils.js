/**
 * Solution & Documentation Utilities for iValue COE Portal
 */

export function resolveOemLogoUrl(logoFilename) {
  if (!logoFilename) return "";
  if (
    logoFilename.startsWith("http://") ||
    logoFilename.startsWith("https://") ||
    logoFilename.startsWith("/")
  ) {
    return logoFilename;
  }
  const clean = logoFilename.replace(/^\/+/, "");
  return `https://storage.googleapis.com/cdn.ivaluetv.com/oem/${clean}`;
}

export function resolveDocUrl(fileName) {
  if (!fileName) return "#";
  if (
    fileName.startsWith("http://") ||
    fileName.startsWith("https://") ||
    fileName.startsWith("/")
  ) {
    return fileName;
  }
  const clean = fileName.replace(/^\/+/, "");
  return `https://storage.googleapis.com/cdn.ivaluetv.com/resources/${encodeURIComponent(clean)}`;
}

/**
 * Robust HTML entity decoder that parses entities like &lt;, &gt;, &quot;, &#39;, &amp;
 * into standard HTML characters so rich text renders seamlessly.
 */
export function decodeHtmlEntities(raw) {
  if (!raw || typeof raw !== "string") return "";

  const entityMap = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&copy;": "©",
    "&reg;": "®",
    "&trade;": "™",
    "&ndash;": "–",
    "&mdash;": "—",
    "&hellip;": "…",
  };

  let str = raw;
  for (let pass = 0; pass < 3; pass++) {
    if (!/&[#a-zA-Z0-9]+;/.test(str)) break;
    str = str.replace(
      /&(?:amp|lt|gt|quot|#039|#39|apos|nbsp|copy|reg|trade|ndash|mdash|hellip);/g,
      (match) => entityMap[match] || match
    );
    str = str.replace(/&#(\d+);/g, (_, dec) =>
      String.fromCharCode(parseInt(dec, 10))
    );
    str = str.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
  }

  return str;
}

export const DEFAULT_TIMEZONE =
  "IST (UTC+05:30) • India (Kolkata, New Delhi, Mumbai, Bengaluru)";

export const GLOBAL_TIMEZONES = [
  // India & South Asia (DEFAULT)
  {
    value: "IST (UTC+05:30) • India (Kolkata, New Delhi, Mumbai, Bengaluru)",
    label: "IST (UTC+05:30) • India (Kolkata, New Delhi, Mumbai, Bengaluru)",
  },
  {
    value: "BST (UTC+06:00) • Bangladesh (Dhaka)",
    label: "BST (UTC+06:00) • Bangladesh (Dhaka)",
  },
  {
    value: "SLST (UTC+05:30) • Sri Lanka (Colombo)",
    label: "SLST (UTC+05:30) • Sri Lanka (Colombo)",
  },
  {
    value: "PKT (UTC+05:00) • Pakistan (Karachi, Islamabad)",
    label: "PKT (UTC+05:00) • Pakistan (Karachi, Islamabad)",
  },
  {
    value: "NPT (UTC+05:45) • Nepal (Kathmandu)",
    label: "NPT (UTC+05:45) • Nepal (Kathmandu)",
  },

  // Asia-Pacific & ASEAN
  {
    value: "SGT (UTC+08:00) • Singapore",
    label: "SGT (UTC+08:00) • Singapore",
  },
  {
    value: "MYT (UTC+08:00) • Malaysia (Kuala Lumpur)",
    label: "MYT (UTC+08:00) • Malaysia (Kuala Lumpur)",
  },
  {
    value: "HKT (UTC+08:00) • Hong Kong",
    label: "HKT (UTC+08:00) • Hong Kong",
  },
  {
    value: "CST (UTC+08:00) • China / Taiwan (Beijing, Taipei)",
    label: "CST (UTC+08:00) • China / Taiwan (Beijing, Taipei)",
  },
  {
    value: "JST (UTC+09:00) • Japan (Tokyo)",
    label: "JST (UTC+09:00) • Japan (Tokyo)",
  },
  {
    value: "KST (UTC+09:00) • South Korea (Seoul)",
    label: "KST (UTC+09:00) • South Korea (Seoul)",
  },
  {
    value: "WIB (UTC+07:00) • Indonesia (Jakarta, Surabaya)",
    label: "WIB (UTC+07:00) • Indonesia (Jakarta, Surabaya)",
  },
  {
    value: "ICT (UTC+07:00) • Thailand / Vietnam (Bangkok, Ho Chi Minh)",
    label: "ICT (UTC+07:00) • Thailand / Vietnam (Bangkok, Ho Chi Minh)",
  },
  {
    value: "PHT (UTC+08:00) • Philippines (Manila)",
    label: "PHT (UTC+08:00) • Philippines (Manila)",
  },
  {
    value: "AEST (UTC+10:00) • Australia (Sydney, Melbourne, Brisbane)",
    label: "AEST (UTC+10:00) • Australia (Sydney, Melbourne, Brisbane)",
  },
  {
    value: "AWST (UTC+08:00) • Australia (Perth)",
    label: "AWST (UTC+08:00) • Australia (Perth)",
  },
  {
    value: "NZST (UTC+12:00) • New Zealand (Auckland, Wellington)",
    label: "NZST (UTC+12:00) • New Zealand (Auckland, Wellington)",
  },

  // Middle East & Gulf (GCC)
  {
    value: "GST (UTC+04:00) • UAE / Oman (Dubai, Abu Dhabi, Muscat)",
    label: "GST (UTC+04:00) • UAE / Oman (Dubai, Abu Dhabi, Muscat)",
  },
  {
    value: "AST (UTC+03:00) • Saudi Arabia / Qatar / Kuwait / Bahrain (Riyadh, Doha)",
    label: "AST (UTC+03:00) • Saudi Arabia / Qatar / Kuwait / Bahrain (Riyadh, Doha)",
  },
  {
    value: "IDT (UTC+03:00) • Israel (Tel Aviv, Jerusalem)",
    label: "IDT (UTC+03:00) • Israel (Tel Aviv, Jerusalem)",
  },
  {
    value: "TRT (UTC+03:00) • Turkey (Istanbul)",
    label: "TRT (UTC+03:00) • Turkey (Istanbul)",
  },

  // Europe & United Kingdom
  {
    value: "GMT/BST (UTC+00:00 / +01:00) • United Kingdom / Ireland (London, Dublin)",
    label: "GMT/BST (UTC+00:00 / +01:00) • United Kingdom / Ireland (London, Dublin)",
  },
  {
    value: "CET/CEST (UTC+01:00 / +02:00) • Central Europe (Paris, Berlin, Amsterdam, Rome)",
    label: "CET/CEST (UTC+01:00 / +02:00) • Central Europe (Paris, Berlin, Amsterdam, Rome)",
  },
  {
    value: "EET/EEST (UTC+02:00 / +03:00) • Eastern Europe (Athens, Bucharest, Helsinki)",
    label: "EET/EEST (UTC+02:00 / +03:00) • Eastern Europe (Athens, Bucharest, Helsinki)",
  },

  // North America & Latin America
  {
    value: "EST/EDT (UTC-05:00 / -04:00) • US Eastern (New York, Boston, Atlanta, Toronto)",
    label: "EST/EDT (UTC-05:00 / -04:00) • US Eastern (New York, Boston, Atlanta, Toronto)",
  },
  {
    value: "CST/CDT (UTC-06:00 / -05:00) • US Central (Chicago, Dallas, Houston, Mexico City)",
    label: "CST/CDT (UTC-06:00 / -05:00) • US Central (Chicago, Dallas, Houston, Mexico City)",
  },
  {
    value: "MST/MDT (UTC-07:00 / -06:00) • US Mountain (Denver, Phoenix, Salt Lake City)",
    label: "MST/MDT (UTC-07:00 / -06:00) • US Mountain (Denver, Phoenix, Salt Lake City)",
  },
  {
    value: "PST/PDT (UTC-08:00 / -07:00) • US Pacific (San Francisco, Seattle, Los Angeles)",
    label: "PST/PDT (UTC-08:00 / -07:00) • US Pacific (San Francisco, Seattle, Los Angeles)",
  },
  {
    value: "BRT (UTC-03:00) • Brazil (São Paulo, Rio de Janeiro)",
    label: "BRT (UTC-03:00) • Brazil (São Paulo, Rio de Janeiro)",
  },

  // Africa
  {
    value: "SAST (UTC+02:00) • South Africa (Johannesburg, Cape Town)",
    label: "SAST (UTC+02:00) • South Africa (Johannesburg, Cape Town)",
  },
  {
    value: "WAT (UTC+01:00) • West Africa (Lagos, Abuja, Accra)",
    label: "WAT (UTC+01:00) • West Africa (Lagos, Abuja, Accra)",
  },
  {
    value: "EAT (UTC+03:00) • East Africa (Nairobi, Addis Ababa)",
    label: "EAT (UTC+03:00) • East Africa (Nairobi, Addis Ababa)",
  },

  // Universal Reference
  {
    value: "UTC (UTC+00:00) • Universal Coordinated Time",
    label: "UTC (UTC+00:00) • Universal Coordinated Time",
  },
];

export const ACCESS_PURPOSES = [
  {
    id: "Evaluation",
    title: "Evaluation / POC",
    desc: "Hands-on technical testing, architecture verification, and lab proof-of-concept.",
  },
  {
    id: "Demo",
    title: "Client / Partner Demo",
    desc: "Customer presentation, live walkthrough, or solution demonstration.",
  },
];

/**
 * Returns formatted YYYY-MM-DD date string with offset in days from today (local timezone).
 */
export function getOffsetDateString(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Minimum selectable start date: strictly 2 days ahead of present date.
 */
export function getMinStartDate() {
  return getOffsetDateString(2);
}

/**
 * Default start date: 2 days ahead of present date.
 */
export function getDefaultStartDate() {
  return getOffsetDateString(2);
}

/**
 * Default end date: strictly same as Preferred start date (e.g. 28-11-2026 -> 28-11-2026).
 */
export function getDefaultEndDate(startDateStr) {
  if (startDateStr && typeof startDateStr === "string") {
    const parts = startDateStr.split("-").map(Number);
    if (
      parts.length === 3 &&
      !isNaN(parts[0]) &&
      !isNaN(parts[1]) &&
      !isNaN(parts[2])
    ) {
      const year = parts[0];
      const month = String(parts[1]).padStart(2, "0");
      const day = String(parts[2]).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  }
  return getOffsetDateString(2);
}
