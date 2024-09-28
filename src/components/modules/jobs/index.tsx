import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "../../ui/input";

import { Job } from "@/app/lib/definitions";
import { GetUser } from "@/app/lib/definitions";
import { useFormState } from "react-dom";
import { createJob, getAllJobs } from "@/app/actions/jobs";
import { JobData } from "@/app/lib/definitions";
import { GetAllJobsApiResponse } from "@/app/lib/definitions";
import { getAllUsers } from "@/app/actions/user";
import { ErrorApiResponse } from "@/app/lib/definitions";
import CreateJobForm from "./create-job-form";
import AllJobsList from "./all-jobs-list";

export default async function JobsModule() {
  const jobs = await getAllJobs();
  const users = await getAllUsers();

  return (
    <>
      <Card>
        <CardHeader className="">
          <CardTitle className="flex justify-between w-full items-center">
            Aspen Jobs
            <div className="flex gap-4">
              <CreateJobForm users={users} />
            </div>
          </CardTitle>

          <CardDescription>View and manage all jobs.</CardDescription>
        </CardHeader>
        <CardContent>
          <AllJobsList jobs={jobs} />
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
