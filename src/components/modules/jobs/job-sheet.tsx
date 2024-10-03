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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { JobStatus } from "@prisma/client";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case JobStatus.COMPLETED:
        return 'bg-green-500'
      case JobStatus.IN_PROGRESS:
        return 'bg-blue-500'
      case JobStatus.PENDING:
        return 'bg-yellow-500'
      case JobStatus.FAILED:
        return 'bg-red-500'
      case JobStatus.CANCELLED:
        return 'bg-slate-500'
      default:
        return 'bg-gray-500'
    }
  }
  
    return (
      <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
              <CardDescription className="text-base mt-1">
                {job.description}
              </CardDescription>
            </div>
            <Badge className={`${getStatusColor(job.status)} text-white`}>
              {job?.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-500">Owner</Label>
                <div className="text-lg font-semibold">{job.owner.name}</div>
              </div>
              <VoteButtons job={job} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-gray-500">Progress</Label>
                <span className="text-sm font-medium">{job.progress}%</span>
              </div>
              <Progress value={job.progress} indicatorColor="bg-green-500" className="w-full " />
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-5">
          {role === "ADMIN" && (
            <EditJobForm job={job} users={users} />
          )}
          {role === "ADMIN" && (
            <DeleteButton jobId={job.id} setSheetOpen={setSheetOpen} />
          )}
        </CardFooter>
      </Card>
      <StakeholdersList job={job} />
      <CommentsList jobId={job.id} />
    </>
  );
}
