'use client'
import { Comment } from "@/app/lib/definitions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSessionStore } from "@/provider/session-store-provider";
import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MoreVertical, Trash } from "lucide-react";
import { useState } from "react";

export default function CommentItem({comment, deleteComment}: {comment:Comment, deleteComment: UseMutateFunction<any, AxiosError<{
  message: string;
}, any>, string | number, unknown>}) {
  const userId = useSessionStore(state => state.userId)
  const role = useSessionStore(state => state.role)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const handleDelete = () => {
    deleteComment(comment.id)
    setIsDeleteDialogOpen(false)
  }
  const getInitials = (name: string) => {
    return name?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  return (
    <div className="flex items-start space-x-4 border rounded-lg md:p-4 p-3 max-md:pr-1">
    <Avatar className="md:h-10 h-8 md:w-10 w-8">
      <AvatarImage
        src={`/avatars/${comment.user.id}.png`}
        alt={comment.user.name}
      />
      <AvatarFallback className="max-md:text-[12px]">{getInitials(comment.user.name)}</AvatarFallback>
    </Avatar>
    <div className="space-y-1 flex-1">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold max-md:text-[12px]">{comment.user.name}</p>
        <div className="flex items-center md:space-x-2 space-x-1">
          <span className="text-xs text-muted-foreground max-md:text-[10px]">
            {new Date(comment.createdAt).toLocaleDateString()}{" "}
            {new Date(comment.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
         {((comment.user.id == userId) || (role === 'ADMIN')) && <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className=" text-red-500" onSelect={() => setIsDeleteDialogOpen(true)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>}
        </div>
      </div>
      <p className="text-sm">{comment.content}</p>
    </div>

    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this comment?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the comment.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
  );
}
