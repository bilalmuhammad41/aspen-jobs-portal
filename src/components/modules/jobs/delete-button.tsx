import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import JobsService from "@/services/job.service";
import { Dispatch, SetStateAction, useState } from "react";

export default function DeleteButton({jobId, setSheetOpen}:{jobId:number, setSheetOpen:Dispatch<SetStateAction<boolean>>}){
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { useHandleDeleteJob } = JobsService()
  const { mutate: handleDelete, isPending } = useHandleDeleteJob()
  const onDeleteConfirm = () => {
    handleDelete(jobId)
    setIsDeleteDialogOpen(false)
    setSheetOpen(false)
  }

  return(
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
    <DialogTrigger asChild>
      <Button className="flex gap-2 bg-white text-red-500 hover:bg-red-500 hover:text-white">
        <Trash size={15}/>
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure you want to delete this job?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the job and remove its data from our servers.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onDeleteConfirm} disabled={isPending}>
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}