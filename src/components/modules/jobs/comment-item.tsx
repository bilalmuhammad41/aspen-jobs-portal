import { Comment } from "@/app/lib/definitions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CommentItem({comment}: {comment:Comment}) {
  const getInitials = (name: string) => {
    return name?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  return (
    <div
      key={comment?.id}
      className="flex items-start space-x-4 border rounded-lg p-4"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={`/avatars/${comment?.user?.id}.png`}
          alt={comment?.user?.name}
        />
        <AvatarFallback>{getInitials(comment?.user?.name)}</AvatarFallback>
      </Avatar>
      <div className="space-y-1 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{comment?.user?.name}</p>
          <span className="text-xs text-muted-foreground">
            {new Date(comment?.createdAt).toLocaleDateString()}{" "}
            {new Date(comment?.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="text-sm">{comment?.content}</p>
      </div>
    </div>
  );
}
