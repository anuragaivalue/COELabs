import { redirect } from "next/navigation";

/**
 * Permanent redirect from /terms to /terms-and-conditions
 * to ensure zero broken links across internal and external references.
 */
export default function TermsRedirect() {
  redirect("/terms-and-conditions");
}
