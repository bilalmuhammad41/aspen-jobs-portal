import JobListWrapper from "./jobs/jobs-list-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function UserJobsModule() {
  return (
    <>
      <Card className="border-none shadow-none p-0">
        <CardHeader className="p-0 pb-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Explore Aspen Jobs</CardTitle>
              <CardDescription>
                Find, explore and interact with jobs to do at Aspen
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 relative">
          <JobListWrapper />
        </CardContent>
      </Card>
    </>
  );
}
