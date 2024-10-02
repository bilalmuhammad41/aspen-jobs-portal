import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import CommentsList from "./comments-list";
import StakeholdersList from "./stakeholder-list";
import VoteButtons from "./vote-buttons";
import { Job } from "@/app/lib/definitions";

export default function JobSheet({ job }: { job: Job }) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{job?.title}</CardTitle>
          <CardDescription className="text-base">
            {job?.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Owner
              </Label>
              <div className="text-lg font-semibold">
                {job?.owner.name}
              </div>
            </div>
            <VoteButtons job={job} />
          </div>
        </CardContent>
      </Card>
      <StakeholdersList job={job} />
      <CommentsList jobId={job?.id} />
    </>
  );
}
