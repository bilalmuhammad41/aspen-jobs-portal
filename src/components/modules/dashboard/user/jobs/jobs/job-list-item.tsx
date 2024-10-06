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
import {
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  MessageSquare,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import StakeholderService from "@/services/stakeholder.service";
import { useSessionStore } from "@/provider/session-store-provider";
import JobItemFallback from "./job-item-fallback";

interface JobItemProp {
  jobId: number;
  index: number;
}
export default function JobItem({ jobId, index }: JobItemProp) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { useFetchSingleJob } = JobsService();
  const { data: jobData, isLoading: isFetchJobLoading } =
    useFetchSingleJob(jobId);
  const { useHandleBecomeStakeholder } = StakeholderService();
  const {
    mutate: handleBecomeStakeholderRequest,
    isPending,
    isSuccess,
  } = useHandleBecomeStakeholder(jobId);

  const userId = useSessionStore((state) => state.userId);
  const { useFetchAllJobComments } = JobsService();

  const { data: comments, isLoading } = useFetchAllJobComments(jobId);

  const isUserStakeholder = jobData?.data?.jobStakeholders?.some(
    (stakeholder) => stakeholder?.user?.id == userId
  );

  const handleBecomeStakeholder = async () => {
    await handleBecomeStakeholderRequest(jobId);
  };

  useEffect(() => {
    if (isSuccess) {
      setIsConfirmDialogOpen(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!isFetchJobLoading) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, index * 100);

      return () => clearTimeout(timer);
    }
  }, [isFetchJobLoading, index]);

  return (
    <div
      className={`transition-opacity duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ transform: `translateY(${isVisible ? 0 : 20}px)` }}
    >
      {isFetchJobLoading ? (
        <JobItemFallback />
      ) : (
        <Card className="w-full ">
          <CardHeader className=" flex md:flex-row flex-col-reverse md:items-center justify-between space-y-0 max-md:p-3">
            <div className="space-y-1 max-md:mt-3">
              <CardTitle className="md:text-2xl text-xl">
                {jobData?.data?.title}
              </CardTitle>
            </div>
            <Badge
              className={`${getStatusColor(
                jobData?.data?.status as string
              )} text-white flex-nowrap whitespace-nowrap h-7 rounded-full max-md:h-6 max-md:text-[10px] max-md:w-min`}
            >
              {jobData?.data?.status?.split("_").join(" ")}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 max-md:p-3">
            <CardDescription className="text-black">
              {jobData?.data?.description}
            </CardDescription>
            <div className="flex flex-col md:gap-2 gap-1 w-full md:py-5 py-2 max-md:text-[12px]">
              <div className="flex items-center space-x-1">
                <User className="md:h-5 md:w-5 h-4 w-4 text-gray-500" />
                <div className="font-semibold">Owner:</div>
                <div>{jobData?.data?.owner?.name}</div>
              </div>
              <div className="flex md:items-center space-x-1">
                <Users className="md:h-5 md:w-5 h-4 w-4 text-gray-500" />
                <div className="font-semibold">Stakeholders:</div>
                <div className="flex flex-wrap md:gap-2 gap-1">
                  {jobData?.data?.jobStakeholders?.length === 0 ? (
                    <i className="text-gray-500">No Stakeholders</i>
                  ) : (
                    jobData?.data?.jobStakeholders?.map((stakeholder) => (
                      <Badge
                        key={stakeholder?.user?.id}
                        variant="secondary"
                        className="max-md:text-[10px]"
                      >
                        {stakeholder?.user?.name}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </div>
            <Dialog
              open={isConfirmDialogOpen}
              onOpenChange={setIsConfirmDialogOpen}
            >
              <DialogTrigger asChild>
                {!isUserStakeholder ? (
                  <Button
                    disabled={isPending}
                    className="max-md: max-md:text-[12px] max-md:h-9 max-md:w-[140px]"
                  >
                    Become a Stakeholder
                  </Button>
                ) : (
                  <Badge
                    variant="outline"
                    className="w-auto h-7 max-md:h-6 max-md:text-[10px] bg-green-100 rounded-full"
                  >
                    You are a Stakeholder in this job
                  </Badge>
                )}
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
                  <Button
                    className="max-md:mt-3"
                    disabled={isPending}
                    onClick={handleBecomeStakeholder}
                  >
                    {isPending ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="flex md:items-center md:flex-row max-md:gap-4 flex-col justify-between md:pt-4">
              <VoteButtons job={jobData?.data} />
              <div className="space-y-2 w-full md:ml-auto md:max-w-[200px]">
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
          <CardFooter className="flex flex-col items-start max-md:p-3">
            <Button
              onClick={() => setShowComments(!showComments)}
              variant="outline"
              className="w-full md:max-w-[180px] max-md:text-[12px]"
            >
              {showComments ? (
                <span className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Hide Comments
                </span>
              ) : (
                <span className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Comments ({comments?.data?.length})
                </span>
              )}
              {showComments ? (
                <ChevronUp className="ml-2" size={15} />
              ) : (
                <ChevronDown className="ml-2" size={15} />
              )}
            </Button>
            {showComments && <CommentsList jobId={jobId} comments={comments} isLoading={isLoading}/>}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
