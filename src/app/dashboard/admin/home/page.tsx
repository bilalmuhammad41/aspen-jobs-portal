import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminHome from "@/components/modules/admin-home";

export default async function Home() {
  return (
    <DashboardLayout>
      <AdminHome />
    </DashboardLayout>
  );
}
