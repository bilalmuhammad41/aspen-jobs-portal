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
import { LoaderCircle, Mail, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import StakeholderService from "@/services/stakeholder.service";
import { Card } from "@/components/ui/card";
import { Job } from "@/app/lib/definitions";
import { useSessionStore } from "@/provider/session-store-provider";

const StakeholdersList = ({ job }: { job: Job }) => {
  const [isStakeholderDialogOpen, setIsStakeholderDialogOpen] = useState(false);
  const [isConfirmRemoveDialogOpen, setIsConfirmRemoveDialogOpen] =
    useState(false);
  const [isConfirmBecomeDialogOpen, setIsConfirmBecomeDialogOpen] =
    useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState<null | {
    name: string;
    userId: number | string;
  }>(null);
  const { useHandleBecomeStakeholder, useHandleRemoveStakeholder } =
    StakeholderService();

  const {
    mutate: handleBecomeStakeholderRequest,
    isPending: isBecomingStakeholderPending,
    isSuccess: isBecomingStakeholderSuccess,
  } = useHandleBecomeStakeholder(job?.id);
  const {
    mutate: handleRemoveStakeholder,
    isPending: isRemovingStakeholderPending,
    isSuccess: isRemovingStakeholderSuccess,
  } = useHandleRemoveStakeholder(job?.id);
  const handleConfirmRemoveStakeholder = async () => {
    if (selectedStakeholder) {
      handleRemoveStakeholder(selectedStakeholder.userId);
    }
  };
  const userId = useSessionStore((state) => state.userId);

  const isUserStakeholder = job?.jobStakeholders?.some(
    (stakeholder) => stakeholder?.user?.id == userId
  );

  const handleBecomeStakeholder = async () => {
    await handleBecomeStakeholderRequest(job?.id);
  };
  useEffect(() => {
    if (isBecomingStakeholderSuccess) {
      setIsConfirmBecomeDialogOpen(false);
    }
    if (isRemovingStakeholderSuccess) {
      setIsConfirmRemoveDialogOpen(false);
    }
  }, [isBecomingStakeholderSuccess, isRemovingStakeholderSuccess]);

  const totalStakeholders =
    (job?.jobStakeholders?.length || 0) +
    (job?.externalStakeholders?.length || 0);

  return (
    <div className="flex items-center justify-between">
      {/* Stakeholders List Dialog */}
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Stakeholders</DialogTitle>
            <DialogDescription>
              List of all stakeholders for this job.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full pr-4">
            {[...job?.jobStakeholders, ...job?.externalStakeholders].map(
              (stakeholder, index) => (
                <Card
                  key={index}
                  className="py-4 border-b last:border-b-0 px-5 my-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium"> {stakeholder.user.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {stakeholder.user.email}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="text-red-500 border-red-500"
                      onClick={() => {
                        setSelectedStakeholder({
                          name: stakeholder.user.name,
                          userId: stakeholder.user.id,
                        });
                        setIsConfirmRemoveDialogOpen(true);
                      }}
                      disabled={isRemovingStakeholderPending}
                    >
                      <Trash2 size={20}/>
                    </Button>
                  </div>
                </Card>
              )
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Confirm Remove Stakeholder Dialog */}
      <Dialog
        open={isConfirmRemoveDialogOpen}
        onOpenChange={setIsConfirmRemoveDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedStakeholder ? `Remove ${selectedStakeholder.name}` : ""}
            </DialogTitle>
            <DialogDescription>
              {selectedStakeholder
                ? `Are you sure you want to remove ${selectedStakeholder.name} as a stakeholder?`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmRemoveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRemoveStakeholder}
              disabled={isRemovingStakeholderPending}
            >
              {isRemovingStakeholderPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Become Stakeholder Dialog */}
      <Dialog
        open={isConfirmBecomeDialogOpen}
        onOpenChange={setIsConfirmBecomeDialogOpen}
      >
        <DialogTrigger asChild>
          <Button
            disabled={isUserStakeholder || isBecomingStakeholderPending}
            onClick={() => setIsConfirmBecomeDialogOpen(true)}
          >
            {isUserStakeholder
              ? "You are a Stakeholder"
              : "Become a Stakeholder"}
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
              onClick={() => setIsConfirmBecomeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isBecomingStakeholderPending}
              onClick={handleBecomeStakeholder}
            >
              {isBecomingStakeholderPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StakeholdersList;
