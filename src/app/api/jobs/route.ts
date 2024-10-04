import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import { CreateJobFormSchema } from "@/app/lib/definitions";
import { JobStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10; 
  const searchQuery = searchParams.get("search") || "";
  const offset = (page - 1) * limit;
  const session = await getSession();
  const userId = session?.userId;

  try {
   
    const allJobs = await prisma.job.findMany({
      skip: offset,
      take: limit,
      where: {
        OR: [
          {
            title: {
              contains: searchQuery, 
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchQuery,
              mode: "insensitive", 
            },
          },
        ],
      },
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
      orderBy: { createdAt: "desc" },
    });

    const totalJobs = await prisma.job.count();

    let jobsWithUserVotes = allJobs;

    if (userId) {
    
      const userVotes = await prisma.vote.findMany({
        where: {
          userId,
          jobId: { in: allJobs.map((job) => job.id) },
        },
        select: {
          jobId: true,
          voteType: true,
        },
      });

      
      const votesMap = userVotes.reduce((acc, vote) => {
        acc[vote.jobId] = vote.voteType;
        return acc;
      }, {} as Record<number, string>);

    
      jobsWithUserVotes = allJobs.map((job) => ({
        ...job,
        userVote: votesMap[job.id] || null,
      }));
    }

    return NextResponse.json({
      message: "Jobs fetched successfully",
      data: jobsWithUserVotes,
      pagination: {
        total: totalJobs,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalJobs / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Error fetching jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    const validatedFields = CreateJobFormSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("title"),
      ownerId: formData.get("ownerId"),
      status: formData.get("status"),
      progress: formData.get("progress"),
    });
    console.log(validatedFields.data);
    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description, ownerId, status, progress } = validatedFields.data;

    const job = await prisma.job.create({
      data: {
        title,
        description,
        ownerId: Number(ownerId),
        adminId: session.userId,
        progress: Number(progress),
        status: status as JobStatus,
      },
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
      },
    });

    return NextResponse.json(
      { message: "Job created successfully", data: job },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Error creating job" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    await prisma.job.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: "Error deleting job" }, { status: 500 });
  }
}
