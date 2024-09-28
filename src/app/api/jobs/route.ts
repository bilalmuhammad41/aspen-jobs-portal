import { createJob, getAllJobs } from "@/app/actions/jobs";
import { NextResponse } from "next/server";
// Adjust the path as needed

export async function GET() {
  const jobs = await getAllJobs(); // Call the server action
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const job = await createJob(formData);
  return NextResponse.json(job);
}
