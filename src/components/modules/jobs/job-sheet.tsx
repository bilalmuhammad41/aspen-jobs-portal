"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useState } from "react";
import CommentsList from "./comments-list";
import VoteService from "@/services/vote.service";
import { LoaderCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import StakeholdersList from "./stakeholder-list";
import JobsService from "@/services/job.service";
import { VoteType } from "@prisma/client";
import { Job } from "@/app/lib/definitions";

export default function JobSheet({ jobId }: { jobId: number }) {
  const [isOpen, setIsOpen] = useState(false);

  const { useHandleAddVote } = VoteService();
  const { mutate: handleUpdateVote } = useHandleAddVote(jobId);

  const handleVote = (voteType: VoteType) => {
    handleUpdateVote({ jobId: jobId, voteType });
  };

  const { useFetchSingleJob } = JobsService();
  const { data: jobData, isLoading,} = useFetchSingleJob(jobId);

 
  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

 

  const job: Job | undefined = jobData?.data;
  const userVote = job?.userVote || null;

  if (!job) {
    return null;
  }

  return (
    <>
      <Button disabled={isLoading} className="w-full bg-green-500 text-white font-[500] hover:bg-green-400" variant={'secondary'} onClick={handleOpen}>
        {isLoading? 
         <LoaderCircle className="animate-spin" />
         : "View"}
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          className="sm:max-w-[500px] gap-4 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
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
                  <Label className="text-sm font-medium text-gray-500">
                    Owner
                  </Label>
                  <div className="text-lg font-semibold">
                    {job.owner.name}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex items-center space-x-2 ${
                      userVote === "UPVOTE" ? "bg-green-100 text-green-600" : ""
                    }`}
                    onClick={() => handleVote("UPVOTE")}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{job.upvotes}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex items-center space-x-2 ${
                      userVote === "DOWNVOTE" ? "bg-red-100 text-red-600" : ""
                    }`}
                    onClick={() => handleVote("DOWNVOTE")}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>{job.downvotes}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <StakeholdersList job={job} />
          <CommentsList comments={job.comments} />
        </SheetContent>
      </Sheet>
    </>
  );
}
