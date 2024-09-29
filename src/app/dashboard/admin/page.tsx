import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AdminDashboard({ children}:{children:React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
