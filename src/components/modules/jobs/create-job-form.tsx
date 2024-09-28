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
import { useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateJobForm({ users }) {
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);

    console.log(formData);
    try {
      await fetch("/api/jobs", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
