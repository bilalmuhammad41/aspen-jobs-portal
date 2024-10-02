import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";

export async function GET(req: NextRequest, { params }: { params: {jobId: string} }) {
  const jobId = params.jobId;
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    if (jobId) {
      const job = await prisma.job.findUnique({
        where: { id: Number(jobId) },
      });
      if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }

      const comments = await prisma.comment.findMany({
        where: {
            jobId: Number(jobId),
        },
        include:{
          user:{
            select:{
              name: true,
              role: true,
              id: true,
            }
          }
        }
      });

      return NextResponse.json({
        message: "Comments retrieved successfully",
        data: comments,
      });
    }

    return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}