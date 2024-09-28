"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

export default function JobSheet({ job }) {
  const [isOpen, setIsOpen] = useState(false); // Manage sheet open state
  const [upvotes, setUpvotes] = useState(job.upvotes || 0);
  const [downvotes, setDownvotes] = useState(job.downvotes || 0);
  const [userVote, setUserVote] = useState(job.userVote || null); // Tracks user's current vote (UPVOTE, DOWNVOTE, or null)

  const { useHandleAddVote } = VoteService();
  const { mutate: handleUpdateVote } = useHandleAddVote();

  const handleVote = (voteType) => {
    // Backend will handle deletion of the previous vote if it's the same
    if (userVote === voteType) {
      // Unselecting the vote
      setUserVote(null);
    } else {
      // Switching or casting a new vote
      setUserVote(voteType);
    }

    // Update the vote count locally based on the vote type
    if (voteType === "UPVOTE") {
      setUpvotes(upvotes + (userVote === "UPVOTE" ? -1 : 1));
      if (userVote === "DOWNVOTE") setDownvotes(downvotes - 1); // Remove previous downvote if switching
    } else if (voteType === "DOWNVOTE") {
      setDownvotes(downvotes + (userVote === "DOWNVOTE" ? -1 : 1));
      if (userVote === "UPVOTE") setUpvotes(upvotes - 1); // Remove previous upvote if switching
    }

    // Send the vote to the backend
    handleUpdateVote({ jobId: job.id, voteType });
  };

  const handleOpen = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up to the dropdown
    setIsOpen(true);
  };
  return (
    <>
      <Button className="w-full" variant="link" onClick={handleOpen}>
        View
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          className="sm:max-w-[500px] gap-4 flex flex-col overflow-y-scroll"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Prevent closing on click inside */}
          <Card>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>{job.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Label>Owner</Label>
              <div>{job.owner.name}</div>
              {/* Upvote and Downvote Buttons */}
              <div className="flex space-x-4 mt-4">
                <Button
                  variant={userVote === "UPVOTE" ? "solid" : "outline"}
                  className={`text-green-500 border-green-500 ${
                    userVote === "UPVOTE"
                      ? "bg-green-100"
                      : "hover:bg-green-100"
                  }`}
                  onClick={() => handleVote("UPVOTE")}
                >
                  Upvote {upvotes}
                </Button>
                <Button
                  variant={userVote === "DOWNVOTE" ? "solid" : "outline"}
                  className={`text-red-500 border-red-500 ${
                    userVote === "DOWNVOTE" ? "bg-red-100" : "hover:bg-red-100"
                  }`}
                  onClick={() => handleVote("DOWNVOTE")}
                >
                  Downvote {downvotes}
                </Button>
              </div>
            </CardContent>
          </Card>
          <CommentsList />
        </SheetContent>
      </Sheet>
    </>
  );
}
