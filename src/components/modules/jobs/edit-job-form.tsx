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
import { Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import JobsService from "@/services/job.service";
import { GetAllUsersApiResponse, Job } from "@/app/lib/definitions";

export default function EditJobForm({
  job,
  users,
}: {
  job: Job;
  users: GetAllUsersApiResponse | undefined;
}) {
  const { useHandleEditJob } = JobsService();
  const {
    mutate: handleEditJob,
    isPending,
    isSuccess,
  } = useHandleEditJob(job.id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formElement, setFormElement] = useState<HTMLFormElement | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setIsConfirmDialogOpen(true);

    setFormElement(formElement);
  };

  const handleConfirmSubmit = async () => {
    if (!formElement) return; // Ensure formElement is set

    try {
      const formData = new FormData(formElement); // Create FormData from the saved form element
      await handleEditJob(formData); // Ensure the job is awaited
      setIsConfirmDialogOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    isSuccess && setIsDialogOpen(false);
  }, [isSuccess]);

  return (
    <>
      {/* Main Dialog for Editing */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="ml-auto mr-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <Pencil className="w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>
              Modify the following details to update the job.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="title" className="">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Title"
                defaultValue={job.title} // Prepopulate with job data
                className="col-span-3"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Job description"
                defaultValue={job.description} // Prepopulate with job data
                className="w-full"
              />
            </div>

            {/* Owner */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="ownerId" className="">
                Owner
              </Label>
              <Select name="ownerId" defaultValue={String(job.owner.id)}>
                {" "}
                {/* Prepopulate with job.ownerId */}
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select an Owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Available people</SelectLabel>
                    {users?.data?.map((user) => (
                      <SelectItem key={user.id} value={String(user.id)}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button disabled={isPending} type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Edit</DialogTitle>
            <DialogDescription>
              Are you sure you want to save the changes to this job?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="default"
              onClick={handleConfirmSubmit}
              disabled={isPending}
            >
              Confirm
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
