import { z } from "zod";

/**
 * List of consumer and free webmail domains that are disallowed
 * for enterprise B2B inquiries.
 */
export const BLOCKED_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "aol.com",
  "icloud.com",
  "mail.com",
  "protonmail.com",
  "zoho.com",
  "yandex.com",
  "gmx.com",
  "inbox.com"
];

/**
 * Validates whether an email domain belongs to a business or enterprise domain.
 */
export function isBusinessEmail(email) {
  if (!email || typeof email !== "string" || !email.includes("@")) return false;
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1].toLowerCase().trim();
  return !BLOCKED_EMAIL_DOMAINS.includes(domain);
}

/**
 * Contact Inquiry Zod Validation Schema
 */
export const contactInquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name cannot exceed 100 characters."),

  workEmail: z
    .string()
    .trim()
    .email("Please enter a valid work email address.")
    .refine(
      (email) => isBusinessEmail(email),
      {
        message: "Please enter a corporate business email. Generic consumer addresses (gmail, yahoo, etc.) are not accepted."
      }
    ),

  company: z
    .string()
    .trim()
    .min(2, "Company or organization name is required.")
    .max(100, "Company name cannot exceed 100 characters."),

  title: z
    .string()
    .trim()
    .max(100, "Job title cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  interestArea: z
    .string()
    .trim()
    .max(100, "Interest area cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2500, "Message cannot exceed 2500 characters."),

  privacyConsent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must accept the Privacy Policy to proceed."
    })
});

export default contactInquirySchema;
