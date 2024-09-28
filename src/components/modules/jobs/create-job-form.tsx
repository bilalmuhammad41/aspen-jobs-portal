"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import JobsService, { useCreateJob } from "@/services/job.service";

export default function CreateJobForm({ users }) {
  const { useHandleCreateJob } = JobsService();
  const {
    mutate: handleCreateJob,
    isPending,
    isSuccess,
  } = useHandleCreateJob();
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    handleCreateJob(formData);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    if (isSuccess) {
      setIsDialogOpen(false);
    }
  }, [isSuccess]);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setIsDialogOpen(true)}>
          <PlusCircleIcon className="w-4 mr-2" /> New Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a new Job</DialogTitle>
          <DialogDescription>
            Enter the following details to create a job.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Title"
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="username" className="">
              Description
            </Label>
            <Textarea
              className="w-full"
              id="description"
              name="description"
              placeholder="Job description"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ownerId" className="">
              Owner
            </Label>
            <Select name="ownerId">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an Owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available people</SelectLabel>
                  {users?.data?.map((user) => (
                    <SelectItem
                      key={user.id}
                      value={String(user.id)}
                      onClick={(e) => setSelectedOwnerId(e.value)}
                    >
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button disabled={isPending} type="submit">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
