import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllJobs } from "@/app/actions/jobs";
import { getAllUsers } from "@/app/actions/user";
import CreateJobForm from "./create-job-form";
import AllJobsList from "./all-jobs-list";
import { getSession } from "@/app/lib/session";

export default async function JobsModule() {
  const users = await getAllUsers();
  const session = await getSession();
  const role = session?.role;
  const userId = session?.userId;

  return (
    <>
      <Card>
        <CardHeader className="">
          <CardTitle className="flex justify-between w-full items-center">
            Aspen Jobs
            {role === "ADMIN" && (
              <div className="flex gap-4">
                <CreateJobForm users={users} />
              </div>
            )}
          </CardTitle>

          <CardDescription>View and manage all jobs.</CardDescription>
        </CardHeader>
        <CardContent>
          <AllJobsList />
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-10</strong> of <strong>32</strong> products
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
