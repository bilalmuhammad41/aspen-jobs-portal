"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import JobsTable from "@/components/modules/jobs-table";

export default function JobsPage() {
  return(
    <AdminLayout>

      <JobsTable />
    </AdminLayout>
  ) 
}
