import prisma from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import { JobStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const jobId = params.jobId;
  const session = await getSession();
  const userId = session?.userId;

  try {
    const job = await prisma.job.findUnique({
      where: { id: Number(jobId) },
      select: {
        id: true,
        title: true,
        description: true,
        ownerId: true,
        owner: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        comments: true,
        jobStakeholders: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        externalStakeholders: true,
        upvotes: true,
        downvotes: true,
        status: true,
        progress: true,
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Fetch the user's vote for this job, if it exists
    const userVote = await prisma.vote.findUnique({
      where: {
        userId_jobId: {
          userId: userId || 0,
          jobId: Number(jobId),
        },
      },
      select: {
        voteType: true,
      },
    });

    return NextResponse.json({
      message: "Job fetched successfully",
      data: {
        ...job,
        userVote: userVote ? userVote.voteType : null,
      },
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Error fetching job" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const session = await getSession();
  const formData = await request.formData();
  const body = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    ownerId: Number(formData.get("ownerId")) as number,
    status: formData.get("status") as JobStatus,
    progress: Number(formData.get("progress")),
  };
  const { jobId } = params;
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const updatedJob = await prisma.job.update({
      where: { id: Number(jobId) },
      data: body,
      select: {
        id: true,
        title: true,
        description: true,
        ownerId: true,

        owner: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        status: true,
        progress: true,
      },
    });

    return NextResponse.json({
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Error updating job" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const jobId = params.jobId;
  const session = await getSession();
  const role = session?.role;

  if (role !== "ADMIN") {
    return NextResponse.json(
      { error: "You do not have permission to perform this task" },
      { status: 401 }
    );
  }
  try {
    const job = await prisma.job.findUnique({
      where: { id: Number(jobId) },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const deletedJob = await prisma.job.delete({
      where: { id: Number(jobId) },
    });

    return NextResponse.json({
      message: "Job deleted successfully",
      data: {
        deletedJob,
      },
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: "Error deleting job" }, { status: 500 });
  }
}
