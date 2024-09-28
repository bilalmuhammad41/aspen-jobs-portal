import { MoreHorizontal, PlusCircleIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

import { Job } from "@/app/lib/definitions";
import { GetUser } from "@/app/lib/definitions";
import { useFormState } from "react-dom";
import { createJob, getAllJobs } from "@/app/actions/jobs";
import { JobData } from "@/app/lib/definitions";
import { GetAllJobsApiResponse } from "@/app/lib/definitions";
import { getAllUsers } from "@/app/actions/user";
import { ErrorApiResponse } from "@/app/lib/definitions";
import CreateJobForm from "./create-job-form";

export default async function JobsTable() {
  const jobs = await getAllJobs();
  const users = await getAllUsers();

  return (
    <>
      <Card>
        <CardHeader className="">
          <CardTitle className="flex justify-between w-full">
            Aspen Jobs
            <div className="flex gap-4">
              <Input placeholder="Search" className="font-normal" />
              <CreateJobForm users={users} />
            </div>
          </CardTitle>

          <CardDescription>View and manage all jobs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs?.data?.map((job) => (
                <TableRow>
                  <TableCell className="font-medium">{job.title}</TableCell>

                  <TableCell>{job.description}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {job.owner.name}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <JobSheet job={job} />
                        </DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-10</strong> of <strong>32</strong> products
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
const JobSheet = ({ job }) => {
  const [isOpen, setIsOpen] = useState(false); // Manage sheet open state

  const handleOpen = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up to the dropdown
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="outline" onClick={handleOpen}>
        View
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent onClick={(e) => e.stopPropagation()}>
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
};
