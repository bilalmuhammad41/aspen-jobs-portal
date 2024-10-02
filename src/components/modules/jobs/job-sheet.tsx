import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import CommentsList from "./comments-list";
import StakeholdersList from "./stakeholder-list";
import VoteButtons from "./vote-buttons";
import { Job } from "@/app/lib/definitions";
import DeleteButton from "./delete-button";
import { Dispatch, SetStateAction } from "react";
import { useSessionStore } from "@/provider/session-store-provider";
import UsersService from "@/services/user.service";
import EditJobForm from "./edit-job-form";

export default function JobSheet({
  job,
  setSheetOpen,
}: {
  job: Job | undefined;
  setSheetOpen: Dispatch<SetStateAction<boolean>>;
}) {
  
  
  const role = useSessionStore((state) => state.role);
  const {useHandleGetAllUsers} = UsersService()
  const {data: users} = useHandleGetAllUsers()
  
  if (!job) {
    return <div>Loading job details...</div>;
  }


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
          <CardDescription className="text-base">
            {job.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Label className="text-sm font-medium text-gray-500">Owner</Label>
              <div className="text-lg font-semibold">{job.owner.name}</div>
            </div>
            <VoteButtons job={job} />
          </div>
          <CardFooter className="p-0">
            {role === "ADMIN" && (
              <EditJobForm job={job} users={users} />
            )}
            {role === "ADMIN" && (
              <DeleteButton jobId={job.id} setSheetOpen={setSheetOpen} />
            )}

          </CardFooter>
        </CardContent>
      </Card>
      <StakeholdersList job={job} />
      <CommentsList jobId={job.id} />
    </>
  );
}
