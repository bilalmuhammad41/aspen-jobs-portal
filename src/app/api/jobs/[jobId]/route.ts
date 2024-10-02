import prisma from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  // const { searchParams } = new URL(request.url);
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
