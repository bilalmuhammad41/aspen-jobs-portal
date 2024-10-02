"use client";

import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Job } from "@/app/lib/definitions";
import { VoteType } from "@prisma/client";
import VoteService from "@/services/vote.service";

export default function VoteButtons({ job }: { job: Job }) {
  const { useHandleAddVote } = VoteService();
  const { mutate: handleUpdateVote } = useHandleAddVote(job?.id);

  const handleVote = (voteType: VoteType) => {
    handleUpdateVote({ jobId: job?.id, voteType });
  };

  return (
    <div className="flex space-x-4">
      <Button
        variant="outline"
        size="sm"
        className={`flex items-center space-x-2 ${
          job?.userVote === "UPVOTE" ? "bg-green-100 text-green-600" : ""
        }`}
        onClick={() => handleVote("UPVOTE")}
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{job?.upvotes}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={`flex items-center space-x-2 ${
          job?.userVote === "DOWNVOTE" ? "bg-red-100 text-red-600" : ""
        }`}
        onClick={() => handleVote("DOWNVOTE")}
      >
        <ThumbsDown className="w-4 h-4" />
        <span>{job?.downvotes}</span>
      </Button>
    </div>
  );
}