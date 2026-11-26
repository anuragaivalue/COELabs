import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function DashboardIndexPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login?returnUrl=/dashboard");
  }

  const userType = session.user.userType || session.user.role || "user";

  if (userType === "admin") {
    redirect("/dashboard/admin");
  }

  redirect("/dashboard/user");
}
