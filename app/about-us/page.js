import { redirect } from "next/navigation";

/**
 * Permanent redirect from /about-us to /about to guarantee zero broken links
 * and maintain consistent URL routing across the application.
 */
export default function AboutUsRedirect() {
  redirect("/about");
}
