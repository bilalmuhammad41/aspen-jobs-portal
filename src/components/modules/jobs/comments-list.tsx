"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Comment } from "@/app/lib/definitions";

interface CommentsListProps {
  comments?: Comment[];
}

export default function CommentsList({ comments = [] }: CommentsListProps) {
  const [commentsList, setCommentsList] = useState<Comment[]>([]);

  useEffect(() => {
    setCommentsList(comments);
  }, [comments]);

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
          <div className="space-y-6">
            {commentsList.length > 0 ? (
              commentsList.map((comment: Comment) => (
                <div
                  key={comment.id}
                  className="flex items-start space-x-4 bg-gray-50 rounded-lg p-4"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`/avatars/${comment.user.id}.png`}
                      alt={comment.user.name}
                    />
                    <AvatarFallback>
                      {getInitials(comment.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">{comment.user.name}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                    <p className="text-xs text-gray-500">
                      User ID: {comment.user.id}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
