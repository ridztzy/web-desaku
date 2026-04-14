import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";
import { getIdentitas, getAkunAdmin } from "@/lib/sheets";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Dashboard - Desa Kita",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session?.value) {
    redirect("/admin/login");
  }

  const identitas = await getIdentitas();
  // Fetch account data and find the specific user who logged in
  const akunData = await getAkunAdmin();
  const adminAccount = akunData.find(a => a.email.toLowerCase() === session.value.toLowerCase()) || null;

  return (
    <AdminLayoutWrapper identitas={identitas} adminAccount={adminAccount}>
      {children}
    </AdminLayoutWrapper>
  );
}
