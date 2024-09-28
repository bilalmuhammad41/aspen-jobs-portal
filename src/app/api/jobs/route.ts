import { createJob, getAllJobs } from "@/app/actions/jobs";
import { JobData } from "@/app/lib/definitions";
import { NextResponse } from "next/server";
// Adjust the path as needed

export async function GET() {
  const jobs = await getAllJobs(); // Call the server action
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const jobData: JobData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    ownerId: formData.get("ownerId") as string,
  };

  const job = await createJob(jobData);
  return NextResponse.json(job);
}
