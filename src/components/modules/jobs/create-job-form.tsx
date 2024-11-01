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
import JobsService from "@/services/job.service";
import { GetAllUsersApiResponse } from "@/app/lib/definitions";
import { jobStatus } from "@/app/lib/constants";
import { Slider } from "@/components/ui/slider";

export default function CreateJobForm({
  users,
}: {
  users: GetAllUsersApiResponse;
}) {
  const [sliderValue, setSliderValue] = useState(0);
  const { useHandleCreateJob } = JobsService();
  const {
    mutate: handleCreateJob,
    isPending,
    isSuccess,
  } = useHandleCreateJob();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const selectedJobStatus = String( await formData.get("status"))?.split(" ").join("_")
    formData.set('status', selectedJobStatus)
    formData.append("progress", String(sliderValue))

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
            <Select name="status">
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
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
