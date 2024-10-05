"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Comment } from "@/app/lib/definitions";
import { ChevronUp, LoaderCircle, Plus } from "lucide-react";
import JobsService from "@/services/job.service";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CommentItem from "./comment-item";
import CommentService from "@/services/comment.service";

interface CommentsListProps {
  jobId: number;
}

export default function CommentsList({ jobId }: CommentsListProps) {
  const { useFetchAllJobComments } = JobsService();
  const { useHandleAddComment, useHandleDeleteComment} = CommentService()
  const { mutate: handleAddCommentApi, isPending: isAddComment } = useHandleAddComment(jobId);
  const [newComment, setNewComment] = useState<string>("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { data: comments, isLoading } = useFetchAllJobComments(jobId);
  const{ mutate: handleDeleteComment} = useHandleDeleteComment(jobId)
  

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', newComment);
    formData.append('jobId', String(jobId));
    handleAddCommentApi(formData);
    setNewComment("");
    setIsFormVisible(false)
  };

  return (
    <Card className="w-full mx-auto shadow-none border-none">
      <CardHeader className="flex flex-row pt-3 px-0 items-center justify-between">
        <CardTitle className="md:text-lg text-md font-semibold">All Comments</CardTitle>
        <Button
          variant="outline"
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="flex max-md:text-[12px] items-center md:gap-2 gap-1"
        >
          {isFormVisible ? (
            <>
              Hide
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Add Comment
              <Plus size={15}/>
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="pb-3 max-md:px-0">
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isFormVisible ? "max-h-96" : "max-h-0"
          }`}
        >
          <form className="space-y-4 mb-6" onSubmit={handleAddComment}>
            <Textarea
              placeholder="Add your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[70px]"
            />
            <Button type="submit" className="w-full" disabled={isAddComment}>
              {isAddComment ? 'Submitting...' : 'Submit Comment'}
            </Button>
          </form>
        </div>
        <ScrollArea type="always" className="pr-4">
          {isLoading ? (
            <div className="w-full flex justify-center items-center">
              <LoaderCircle className="animate-spin" />
            </div>
          ) : (
            <div className="space-y-6 max-h-[450px] ">
              {comments && comments?.data.length > 0 ? (
                comments?.data?.map((comment: Comment, index: number) => (
                  <CommentItem key={index} comment={comment} deleteComment = {handleDeleteComment}/>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No comments yet.
                </p>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
