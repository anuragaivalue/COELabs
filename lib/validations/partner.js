import { z } from "zod";
import { isBusinessEmail } from "./contact.js";

/**
 * Partner Tiers supported by iValue CoE
 */
export const PARTNER_TIERS = [
  "standard",
  "silver",
  "gold",
  "platinum",
  "strategic_oem",
  "system_integrator"
];

/**
 * Partner Application Zod Validation Schema
 */
export const partnerApplicationSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters.")
    .max(150, "Company name cannot exceed 150 characters."),

  partnerTier: z
    .enum(PARTNER_TIERS, {
      errorMap: () => ({ message: "Please select a valid partner tier." })
    })
    .default("standard"),

  contactName: z
    .string()
    .trim()
    .min(2, "Contact representative name must be at least 2 characters.")
    .max(100, "Contact name cannot exceed 100 characters."),

  workEmail: z
    .string()
    .trim()
    .email("Please enter a valid business email address.")
    .refine(
      (email) => isBusinessEmail(email),
      {
        message: "Please enter a corporate business email. Generic consumer addresses (gmail, yahoo, etc.) are not accepted."
      }
    ),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 digits.")
    .max(30, "Phone number cannot exceed 30 characters.")
    .optional()
    .or(z.literal("")),

  region: z
    .string()
    .trim()
    .min(2, "Region is required.")
    .max(100, "Region cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .trim()
    .max(2500, "Message cannot exceed 2500 characters.")
    .optional()
    .or(z.literal("")),

  privacyConsent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must accept the Privacy Policy to proceed."
    })
});

/**
 * Partner Handshake Security Verification Zod Schema
 */
export const partnerHandshakeSchema = z.object({
  partnerId: z
    .string()
    .trim()
    .min(1, "Partner application ID is required."),

  handshakeKey: z
    .string()
    .trim()
    .min(8, "Security handshake key must be at least 8 characters.")
});

export default partnerApplicationSchema;
