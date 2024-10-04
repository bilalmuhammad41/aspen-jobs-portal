import DashboardLayout from "@/components/layout/DashboardLayout";
import UserJobsModule from "@/components/modules/dashboard/user/jobs";
export default async function JobsPage() {
  return (
    <DashboardLayout>
      <UserJobsModule/>
    </DashboardLayout>
  );
}
