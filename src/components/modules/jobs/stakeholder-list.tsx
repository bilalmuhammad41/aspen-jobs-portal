import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderCircle, Mail, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import StakeholderService from "@/services/stakeholder.service";
import { Card } from "@/components/ui/card";
import { Job } from "@/app/lib/definitions";
import { useSessionStore } from "@/provider/session-store-provider";

const StakeholdersList = ({ job }: { job: Job }) => {
  const [isStakeholderDialogOpen, setIsStakeholderDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { useHandleBecomeStakeholder } = StakeholderService();
  const {
    mutate: handleBecomeStakeholderRequest,
    isPending,
    isSuccess,
  } = useHandleBecomeStakeholder(job?.id);

  const userId = useSessionStore((state) => state.userId);

  const isUserStakeholder = job?.jobStakeholders?.some(
    (stakeholder) => stakeholder?.user?.id == userId
  );

  const handleBecomeStakeholder = async () => {
    await handleBecomeStakeholderRequest(job?.id);
  };
  useEffect(() => {
    if (isSuccess) {
      setIsConfirmDialogOpen(false)
    }
  }, [isSuccess])

  const totalStakeholders =
    (job?.jobStakeholders?.length || 0) +
    (job?.externalStakeholders?.length || 0);

  return (
    <div className="flex items-center justify-between">
      <Dialog
        open={isStakeholderDialogOpen}
        onOpenChange={setIsStakeholderDialogOpen}
      >
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Stakeholders ({totalStakeholders})</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Stakeholders</DialogTitle>
            <DialogDescription>
              List of all stakeholders for this job.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full pr-4">
            {[
              ...(job?.jobStakeholders || []),
              ...(job?.externalStakeholders || []),
            ].map((stakeholder, index) => (
              <Card
                key={index}
                className="py-4 border-b last:border-b-0 px-5 my-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{stakeholder.user.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {stakeholder.user.email}
                  </div>
                </div>
              </Card>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={isUserStakeholder || isPending}
          >
            {isUserStakeholder ? "You are a Stakeholder" : "Become a Stakeholder"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Become a Stakeholder</DialogTitle>
            <DialogDescription>
              Are you sure you want to become a stakeholder for this job?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={isPending} onClick={handleBecomeStakeholder}>
              {isPending ?
              <LoaderCircle className="animate-spin"/>:
              "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StakeholdersList;
