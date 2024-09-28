import DashboardLayout from "@/components/layout/DashboardLayout";
import JobsTable from "@/components/modules/jobs/jobs-table";

export default async function JobsPage() {
  return (
    <DashboardLayout>
      <JobsTable />
    </DashboardLayout>
  );
}
