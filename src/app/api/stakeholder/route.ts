import prisma from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const session = await getSession();
  const userId = session?.userId;
  const { jobId } = body;

  if (!session) {
    return NextResponse.json("Unauthorized. Please login.", { status: 401 });
  }
  if (!jobId) {
    return NextResponse.json("JobId is required", { status: 400 });
  }

  try {
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      return NextResponse.json("Job not found", { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const createStakeholder = await prisma.jobStakeholder.create({
      data: {
        jobId: Number(jobId),
        userId: Number(user?.id),
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return NextResponse.json(createStakeholder, { status: 201 });
  } catch (error) {}
  return NextResponse.json(request.body);
}
export async function DELETE(request: NextRequest) {
  const session = await getSession();

  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");
  const stakeholderUserId = searchParams.get("userId");

  if (!jobId || !stakeholderUserId) {
    return NextResponse.json({ error: "Missing jobId or userId" }, { status: 400 });
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id: Number(jobId) },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const deletedStakeholder = await prisma.jobStakeholder.delete({
      where: {
        jobId_userId: {
          jobId: Number(jobId),
          userId: Number(stakeholderUserId),
        },
      },
    });

    return NextResponse.json({
      message: "Stakeholder removed successfully",
      data: deletedStakeholder,
    });
  } catch (error) {
    console.error("Error removing stakeholder:", error);
    return NextResponse.json({ error: "Error removing stakeholder" }, { status: 500 });
  }
}