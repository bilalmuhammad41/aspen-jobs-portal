import { verifySession } from "@/app/lib/dal";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  // const session = await verifySession();
  // const userRole = session?.user?.role; // Assuming 'role' is part of the session object

  // if (userRole === "ADMIN") {
  return <AdminDashboard />;
  // } else if (userRole === "STAKEHOLDER") {
  //   return <UserDashboard />;
  // } else {
  //   redirect("/login");
  // }
}

function AdminDashboard() {
  return <div>Admin Dashboard</div>;
}

function UserDashboard() {
  return <div>User Dashboard</div>;
}
