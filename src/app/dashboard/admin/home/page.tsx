import { getAllJobs } from "@/app/actions/jobs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminHome from "@/components/modules/admin-home";

export default async function Home() {
  const jobs = await getAllJobs();
  return (
    <DashboardLayout>
      <AdminHome jobs={jobs} />
    </DashboardLayout>
  );
}
