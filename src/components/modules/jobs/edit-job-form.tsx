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
import { Slider } from "@/components/ui/slider";
import { jobStatus } from "@/app/lib/constants";

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
  const [sliderValue, setSliderValue] = useState((job?.progress));
  const [formElement, setFormElement] = useState<HTMLFormElement | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setIsConfirmDialogOpen(true);

    setFormElement(formElement);
  };

  const handleConfirmSubmit = async () => {
    if (!formElement) return;

    try {
      const formData = new FormData(formElement); 
      formData.append("progress", String(sliderValue))
      await handleEditJob(formData);
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
                defaultValue={job.title}
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
                defaultValue={job.description}
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
            <div className="flex flex-col gap-2">
            <Label htmlFor="status" className="">
              Status
            </Label>
            <Select defaultValue={job.status} name="status">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Job Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Job Status</SelectLabel>
                  {jobStatus.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="status" className="">
              Progress
            </Label>
            <div className=" flex gap-5 w-full">
              <Slider
              className="max-w-[200px]"
                value={[sliderValue]}
                onValueChange={(e)=> setSliderValue(e[0])}
                max={100}
                step={1}
              />
              <Input
              className="max-w-[100px]"
                type="text"
                value={sliderValue}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{1,3}$/.test(value) && Number(value) <= 100) {
                    setSliderValue(Number(value));
                  } else if (value === "") {
                    setSliderValue(0);
                  }
                }}
              />
            </div>
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
