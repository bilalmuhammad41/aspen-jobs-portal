"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CommentsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Comments</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {/* Comment 1 */}
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex self-start">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Olivia Martin</p>
            <p className="text-sm text-muted-foreground">
              olivia.martin@email.com
            </p>
            <p className="text-sm">Great job on this project!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
