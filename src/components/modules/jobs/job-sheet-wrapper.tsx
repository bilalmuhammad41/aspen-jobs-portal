"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LoaderCircle } from "lucide-react";
import JobSheet from "./job-sheet";
import JobsService from "@/services/job.service";

export default function JobSheetWrapper({ jobId }: { jobId: number }) {
  const [isOpen, setIsOpen] = useState(false);

  const { useFetchSingleJob } = JobsService();
  const { data: jobData, isLoading,} = useFetchSingleJob(jobId);
  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <Button
        className="w-full bg-green-500 text-white font-[500] hover:bg-green-400"
        variant={'secondary'}
        onClick={handleOpen}
      >
        {!isLoading ? "View" : <LoaderCircle className="animate-spin" />}
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          className="sm:max-w-[500px] gap-4 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <JobSheet job={jobData?.data} />
        </SheetContent>
      </Sheet>
    </>
  );
}