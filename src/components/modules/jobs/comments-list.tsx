"use client";

import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Comment } from "@/app/lib/definitions";
import { LoaderCircle } from "lucide-react";
import JobsService from "@/services/job.service";

interface CommentsListProps {
  jobId: number;
}

export default function CommentsList({ jobId }: CommentsListProps) {
  const { useFetchAllJobComments } = JobsService();
  const { data: comments, isLoading } = useFetchAllJobComments(jobId);
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">All Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="pr-4">
          {isLoading ? (
            <div className="w-full flex justify-center items-center">
              <LoaderCircle className="animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {comments && comments?.data.length > 0 ? (
                comments?.data?.map((comment: Comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start space-x-4 bg-gray-50 rounded-lg p-4"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`/avatars/${comment?.user.id}.png`}
                        alt={comment?.user.name}
                      />
                      <AvatarFallback>
                        {getInitials(comment?.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-semibold">
                          {comment?.user.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(comment?.createdAt).toLocaleDateString()}{" "}
                          {new Date(comment?.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment?.content}</p>
                      <p className="text-xs text-gray-500">
                        User ID: {comment?.user.id}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No comments yet.</p>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
