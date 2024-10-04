"use client";

import { getStatusColor } from "@/app/lib/constants";
import CommentsList from "@/components/modules/jobs/comments-list";
import VoteButtons from "@/components/modules/jobs/vote-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import JobsService from "@/services/job.service";
import { ChevronDown, ChevronUp, LoaderCircle, MessageSquare, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import StakeholderService from "@/services/stakeholder.service";
import { useSessionStore } from "@/provider/session-store-provider";

interface JobItemProp {
  jobId: number;
}
export default function JobItem({ jobId }: JobItemProp) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const { useFetchSingleJob } = JobsService()
  const { data: jobData } = useFetchSingleJob(jobId)
  const { useHandleBecomeStakeholder } = StakeholderService()
  const {
    mutate: handleBecomeStakeholderRequest,
    isPending,
    isSuccess,
  } = useHandleBecomeStakeholder(jobId)

  const userId = useSessionStore((state) => state.userId)

  const isUserStakeholder = jobData?.data?.jobStakeholders?.some(
    (stakeholder) => stakeholder?.user?.id == userId
  )

  const handleBecomeStakeholder = async () => {
    await handleBecomeStakeholderRequest(jobId)
  }

  useEffect(() => {
    if (isSuccess) {
      setIsConfirmDialogOpen(false)
    }
  }, [isSuccess])

  return (
    <Card className="w-full ">
      <CardHeader className=" flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-2xl">{jobData?.data?.title}</CardTitle>
        </div>
        <Badge
          className={`${getStatusColor(
            jobData?.data?.status as string
          )} text-white flex-nowrap whitespace-nowrap h-7`}
        >
          {jobData?.data?.status?.split("_").join(" ")}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-black">
          {jobData?.data?.description}
        </CardDescription>
        <div className="flex flex-col gap-2 w-full py-5">
          <div className="flex items-center space-x-4">
            <User className="h-5 w-5 text-gray-500" />
            <div className="font-semibold">Owner:</div>
            <div>{jobData?.data?.owner?.name}</div>
          </div>
          <div className="flex items-center space-x-4">
            <Users className="h-5 w-5 text-gray-500" />
            <div className="font-semibold">Stakeholders:</div>
            <div className="flex flex-wrap gap-2">
              {jobData?.data?.jobStakeholders?.length === 0 ? (
                <i className="text-gray-500">No Stakeholders</i>
              ) : (
                jobData?.data?.jobStakeholders?.map((stakeholder) => (
                  <Badge
                    key={stakeholder?.user?.id}
                    variant="secondary"
                  >
                    {stakeholder?.user?.name}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogTrigger asChild>
            {!isUserStakeholder 
            ?
            <Button
              disabled={ isPending}
              className=""
            >
            Become a Stakeholder
            </Button>
          :
          <Badge variant="outline" className="w-auto h-7 bg-green-100 rounded-full">You are a Stakeholder in this job</Badge>
          }
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Become a Stakeholder</DialogTitle>
              <DialogDescription>
                Are you sure you want to become a stakeholder for this job?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsConfirmDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button disabled={isPending} onClick={handleBecomeStakeholder}>
                {isPending ?
                <LoaderCircle className="animate-spin"/> :
                "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex items-center justify-between pt-4">
          <VoteButtons job={jobData?.data} />
          <div className="space-y-2 w-full ml-auto max-w-[200px]">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-gray-500">
                Progress
              </Label>
              <span className="text-sm font-medium">
                {jobData?.data?.progress}%
              </span>
            </div>
            <Progress
              value={jobData?.data?.progress}
              indicatorColor="bg-green-500"
              className="w-full "
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <Button
          onClick={() => setShowComments(!showComments)}
          variant="outline"
          className="w-full max-w-[180px]"
        >
          {showComments ? <span className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Hide Comments
          </span> : <span className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            View Comments
          </span>}
          {showComments ? <ChevronUp className="ml-2" size={15}/> : <ChevronDown className="ml-2" size={15}/>}
        </Button>
        {showComments && <CommentsList jobId={jobId}/>}
      </CardFooter>
    </Card>
  )
}
