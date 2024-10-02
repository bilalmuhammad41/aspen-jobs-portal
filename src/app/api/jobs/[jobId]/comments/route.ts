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
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "An error occurred while fetching comments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: {jobId: string} }) {
  const body = await req.formData()
  const content = body.get("content") as string | null;
  const jobId = params.jobId;
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
  }

  try {
    if (jobId) {
      const job = await prisma.job.findUnique({
        where: { id: Number(jobId) },
      });
      if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }

      const newComment = await prisma.comment.create({
        data:{
          jobId: Number(jobId),
          userId: userId,
          content: content.trim()
        }
      })

      return NextResponse.json({
        message: "Comment added successfully",
        data: newComment,
      }, {status: 201});
    }

    return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "An error occurred while adding the comment" }, { status: 500 });
  }
}