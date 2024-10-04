import prisma from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  { params }: { params: { id: string } }
) {
  const jobId = params.id;
  const session = await getSession();
  const userId = session?.userId;

  try {
    const job = await prisma.job.findUnique({
      where: { id: Number(jobId) },
      include: {
        jobStakeholders: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        externalStakeholders: {
          include: {
            externalStakeholder: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const allStakeholders = [
      ...job.jobStakeholders.map(s => ({
        id: s.user.id,
        name: s.user.name,
        email: s.user.email,
        isExternal: false
      })),
      ...job.externalStakeholders.map(s => ({
        id: s.externalStakeholder.id,
        name: s.externalStakeholder.name,
        email: s.externalStakeholder.email,
        isExternal: true
      }))
    ];

    const isUserStakeholder = job.jobStakeholders.some(s => s.userId === userId);

    return NextResponse.json({
      message: "Stakeholders fetched successfully",
      data: allStakeholders,
      isUserStakeholder,
    });
  } catch (error) {
    console.error("Error fetching stakeholders:", error);
    return NextResponse.json({ error: "Error fetching stakeholders" }, { status: 500 });
  }
}
