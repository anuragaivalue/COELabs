/**
 * Zero-dependency currency utility for iValue CoE
 */

export const DEFAULT_EXCHANGE_RATE = 85; // 1 USD = ₹85 INR

/**
 * Returns the symbol for the requested currency.
 * @param {string} [currency="USD"]
 * @returns {string}
 */
export function getCurrencySymbol(currency = "USD") {
  const curr = String(currency || "USD").trim().toUpperCase();
  if (curr === "INR") return "₹";
  if (curr === "USD") return "$";
  return "$";
}

/**
 * Converts an amount from USD to the target currency based on exchange rate.
 * @param {number|string} amountUSD
 * @param {string} [targetCurrency="USD"]
 * @param {number} [rate=DEFAULT_EXCHANGE_RATE]
 * @returns {number}
 */
export function convertCurrency(
  amountUSD,
  targetCurrency = "USD",
  rate = DEFAULT_EXCHANGE_RATE
) {
  const num = Number(amountUSD) || 0;
  const target = String(targetCurrency || "USD").trim().toUpperCase();
  const exchangeRate =
    typeof rate === "number" && rate > 0 ? rate : DEFAULT_EXCHANGE_RATE;

  if (target === "INR") {
    return num * exchangeRate;
  }
  return num;
}

/**
 * Formats a currency value for USD or INR with support for compact notation.
 *
 * @param {number|string} val - Amount to format
 * @param {string} [currency="USD"] - "USD" or "INR"
 * @param {boolean} [compact=false] - Whether to use compact abbreviations (K, M, B for USD; L, Cr for INR)
 * @param {boolean} [isAlreadyConverted=false] - If true and currency is INR, indicates value is already in INR
 * @param {number} [rate=DEFAULT_EXCHANGE_RATE] - USD to INR exchange rate
 * @returns {string} Formatted currency string
 */
export function formatCurrency(
  val,
  currency = "USD",
  compact = false,
  isAlreadyConverted = false,
  rate = DEFAULT_EXCHANGE_RATE
) {
  const raw = Number(val) || 0;
  const curr = String(currency || "USD").trim().toUpperCase();
  const exchangeRate =
    typeof rate === "number" && rate > 0 ? rate : DEFAULT_EXCHANGE_RATE;

  // Convert USD to INR if needed
  const amount =
    curr === "INR" && !isAlreadyConverted
      ? convertCurrency(raw, "INR", exchangeRate)
      : raw;

  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const sign = isNegative ? "-" : "";

  if (curr === "INR") {
    if (compact) {
      if (abs >= 10000000) {
        // >= 1 Crore (10,000,000)
        return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
      }
      if (abs >= 100000) {
        // >= 1 Lakh (100,000)
        return `${sign}₹${(abs / 100000).toFixed(2)} L`;
      }
    }
    // Localized en-IN format
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  }

  // USD / Default
  if (compact) {
    if (abs >= 1000000000) {
      // >= 1 Billion (1,000,000,000)
      return `${sign}$${(abs / 1000000000).toFixed(2)}B`;
    }
    if (abs >= 1000000) {
      // >= 1 Million (1,000,000)
      return `${sign}$${(abs / 1000000).toFixed(2)}M`;
    }
    if (abs >= 1000) {
      // >= 1 Thousand (1,000)
      return `${sign}$${(abs / 1000).toFixed(2)}K`;
    }
  }

  // Localized en-US format
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default {
  DEFAULT_EXCHANGE_RATE,
  formatCurrency,
  getCurrencySymbol,
  convertCurrency,
};
