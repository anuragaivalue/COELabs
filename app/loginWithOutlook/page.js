import { redirect } from "next/navigation";

export default function LoginWithOutlookPage() {
  redirect("/login?provider=microsoft");
}
