import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import { VoteType } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");
  const userId = searchParams.get("userId");

  try {
    // if (id) {
    //   const job = await prisma.job.findUnique({
    //     where: { id: Number(id) },
    //     select: {
    //       id: true,
    //       title: true,
    //       description: true,
    //       ownerId: true,
    //       owner: {
    //         select: {
    //           id: true,
    //           name: true,
    //           role: true,
    //         },
    //       },
    //       comments: true,
    //       jobStakeholders: true,
    //       upvotes: true,
    //       downvotes: true,
    //     },
    //   });
    //   if (!job) {
    //     return NextResponse.json({ error: "Job not found" }, { status: 404 });
    //   }
    //   return NextResponse.json({
    //     message: "Job fetched successfully",
    //     data: job,
    //   });
    // } else {
    //   const allJobs = await prisma.job.findMany({
    //     select: {
    //       id: true,
    //       title: true,
    //       description: true,
    //       ownerId: true,
    //       owner: {
    //         select: {
    //           id: true,
    //           name: true,
    //           role: true,
    //         },
    //       },
    //       comments: true,
    //       jobStakeholders: true,
    //       upvotes: true,
    //       downvotes: true,
    //     },
    //   });
    //   return NextResponse.json({
    //     message: "Jobs fetched successfully",
    //     data: allJobs,
    //   });
    // }
  } catch (error) {
    console.error("Error fetching job(s):", error);
    return NextResponse.json(
      { error: "Error fetching job(s)" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { jobId, voteType } = body;
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
        where: { id: jobId },
      });
      if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }

      const userVote = await prisma.vote.findUnique({
        where: {
          userId_jobId: {
            userId: userId!,
            jobId: jobId,
          },
        },
      });

      if (!userVote) {
        // User is voting for the first time
        await prisma.vote.create({
          data: {
            userId: userId!,
            jobId: jobId,
            voteType: voteType,
          },
        });
      } else if (userVote.voteType !== voteType) {
        // User is changing their vote
        await prisma.vote.update({
          where: {
            userId_jobId: {
              userId: userId!,
              jobId: jobId,
            },
          },
          data: {
            voteType: voteType,
          },
        });
      } else {
        // User is voting the same way again (remove their vote)
        await prisma.vote.delete({
          where: {
            userId_jobId: {
              userId: userId!,
              jobId: jobId,
            },
          },
        });
      }

      // Count total upvotes and downvotes from the votes table
      const upvotesCount = await prisma.vote.count({
        where: {
          jobId: jobId,
          voteType: VoteType.UPVOTE, // Use VoteType.UPVOTE
        },
      });

      const downvotesCount = await prisma.vote.count({
        where: {
          jobId: jobId,
          voteType: VoteType.DOWNVOTE, // Use VoteType.DOWNVOTE
        },
      });

      // Update job information with new counts
      const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: {
          upvotes: upvotesCount,
          downvotes: downvotesCount,
        },
      });

      return NextResponse.json({
        message: "Vote processed successfully",
        data: updatedJob,
      });
    }

    return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
