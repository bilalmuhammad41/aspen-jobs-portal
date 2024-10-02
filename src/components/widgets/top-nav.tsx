"use client";

import { CircleUser } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import { logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/provider/session-store-provider";
import { Label } from "../ui/label";

export default function TopNav() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const name = useSessionStore(state => state.name)

  const handleLogout = async () => {
    setIsPending(true);
    try {
      const result = await logout();
      if (result.success) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-3 items-center">
        
          <Label className="font-[600] text-gray-500">{name?.split(" ")[0]}</Label>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
      </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[170px]" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button className="w-full" disabled={isPending} onClick={handleLogout}>
            {isPending ? "Logging out..." : "Logout"}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
