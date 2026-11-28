/**
 * Zero-dependency export utilities for iValue CoE
 */

/**
 * Escapes a single CSV cell according to RFC 4180 rules.
 * Handles strings, numbers, booleans, and null/undefined values.
 * Wraps values containing commas, quotes, or newlines in double quotes,
 * and escapes double quotes by doubling them ("").
 *
 * @param {any} cell
 * @returns {string}
 */
function escapeCSVCell(cell) {
  if (cell === null || cell === undefined) {
    return '""';
  }
  const str = String(cell);
  if (
    str.includes('"') ||
    str.includes(",") ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates and triggers client-side download of a CSV file with UTF-8 BOM encoding.
 * Accepts grouped sections with title and items: [label, value, notes].
 *
 * @param {string} filename - Desired download filename (e.g. "roi-report.csv")
 * @param {Array<{ title?: string, items?: Array<[any, any, any]|{ label?: any, value?: any, notes?: any }> }>} sections
 * @returns {string} The generated CSV string (including UTF-8 BOM)
 */
export function exportSectionsToCSV(filename, sections) {
  const safeFilename = filename
    ? filename.endsWith(".csv")
      ? filename
      : `${filename}.csv`
    : "export.csv";

  const rows = [];

  if (Array.isArray(sections)) {
    sections.forEach((section, index) => {
      if (!section) return;

      // Section Header / Title Row
      if (section.title) {
        rows.push([escapeCSVCell(section.title), '""', '""'].join(","));
      }

      // Column Header Row for this section
      rows.push(
        [escapeCSVCell("Item"), escapeCSVCell("Value"), escapeCSVCell("Notes")].join(",")
      );

      // Section Data Items: [label, value, notes] or { label, value, notes }
      if (Array.isArray(section.items)) {
        section.items.forEach((item) => {
          if (Array.isArray(item)) {
            const [label = "", value = "", notes = ""] = item;
            rows.push(
              [escapeCSVCell(label), escapeCSVCell(value), escapeCSVCell(notes)].join(",")
            );
          } else if (item && typeof item === "object") {
            const { label = item.item || "", value = "", notes = "" } = item;
            rows.push(
              [escapeCSVCell(label), escapeCSVCell(value), escapeCSVCell(notes)].join(",")
            );
          }
        });
      }

      // Add a blank separator row between sections (if not the last section)
      if (index < sections.length - 1) {
        rows.push('"",,""');
      }
    });
  }

  // Prepend UTF-8 Byte Order Mark (BOM: \uFEFF) to ensure Microsoft Excel
  // interprets special characters (like ₹ Rupee, €, accented characters) correctly.
  const BOM = "\uFEFF";
  const csvContent = BOM + rows.join("\r\n");

  // Client-side browser download trigger
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    try {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", safeFilename);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("Failed to trigger CSV download in browser:", err);
    }
  }

  return csvContent;
}

/**
 * Safely wraps window.print() checking browser environment.
 * @returns {boolean} True if print dialog opened, false otherwise
 */
export function triggerPrint() {
  if (typeof window !== "undefined" && typeof window.print === "function") {
    try {
      window.print();
      return true;
    } catch (error) {
      console.error("Failed to trigger print dialog:", error);
      return false;
    }
  }
  return false;
}

export default {
  exportSectionsToCSV,
  triggerPrint,
};
