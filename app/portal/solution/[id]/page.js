import { redirect } from "next/navigation";

export default async function SolutionRedirectPage({ params }) {
  const { id } = await params;
  redirect(`/portal/overview?c=${encodeURIComponent(id)}`);
}
