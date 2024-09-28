import DashboardLayout from "@/components/layout/DashboardLayout";
import JobsModule from "@/components/modules/jobs";

export default async function JobsPage() {
  return (
    <DashboardLayout>
      <JobsModule />
    </DashboardLayout>
  );
}
