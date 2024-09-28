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
import { useState } from "react";

export default function JobSheet({ job }) {
  const [isOpen, setIsOpen] = useState(false); // Manage sheet open state

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
          className="sm:max-w-[500px]"
          onClick={(e) => e.stopPropagation()}
        >
          {" "}
          {/* Prevent closing on click inside */}
          <SheetHeader>
            <SheetTitle>{job.title}</SheetTitle>
            <SheetDescription>{job.description}</SheetDescription>
          </SheetHeader>
          <Label>Owner</Label>
          <div>{job.owner.name}</div>
          {/* Add a close button */}
        </SheetContent>
      </Sheet>
    </>
  );
}
