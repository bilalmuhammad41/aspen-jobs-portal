import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";

export async function GET(req: NextRequest, { params }: { params: {jobId: string, commentId: string } }) {
  const jobId = params.jobId;
  const commentId = params.commentId;
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

      const comment = await prisma.comment.findUnique({
        where: {
            id: Number(commentId),
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
        message: "Comment retrieved successfully",
        data: comment,
      });
    }

    return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest, { params }: { params: {commentId: string } }) {
  const commentId = params.commentId;
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    if (commentId) {
      const comment = await prisma.comment.findUnique({
        where: { id: Number(commentId) },
      });
      if (!comment) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }

      const deletedComment  = await prisma.comment.delete({where: {id: Number(commentId)}})
      return NextResponse.json({
        message: "Comment deleted successfully",
        data: deletedComment,
      });
    }

    return NextResponse.json({ error: "Invalid Comment ID" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
