import Error from "next/error";
import {
  ErrorApiResponse,
  CreateJobApiResponse,
  GetAllJobsApiResponse,
  UpdateJobData,
  UpdateJobApiResponse,
  JobData,
  GetJobApiResponse,
  FormState,
  CreateJobFormSchema,
} from "../lib/definitions";
import prisma from "../lib/prisma";
import { getSession } from "../lib/session";

// Action to create a job
export async function createJob(
  // state: FormState,
  data: FormData
): Promise<CreateJobApiResponse | ErrorApiResponse | { errors?: any }> {
  const validatedFields = CreateJobFormSchema.safeParse({
    title: data?.get("title"),
    description: data?.get("description"),
    ownerId: data?.get("ownerId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, description, ownerId } = validatedFields.data;
  const session = await getSession();
  console.log("Create Job Payload: ", validatedFields.data);

  // Check for admin permissions
  if (session?.role !== "ADMIN") {
    return {
      message: "Could not create a job",
      error: "You do not have permission to create a Job",
    };
  }

  if (!session) {
    return {
      message: "Could not create a job",
      error: "Session not found. Please log in.",
    };
  }

  // Check for admin permissions
  if (session.role !== "ADMIN") {
    return {
      message: "Could not create a job",
      error: "You do not have permission to create a Job",
    };
  }

  try {
    const job = await prisma.job.create({
      data: {
        title,
        description,
        ownerId: Number(ownerId),
        adminId: session.userId,
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
    return {
      message: "Job created Successfully",
      data: job,
    };
  } catch (error) {
    console.error("Error creating job:", error);
    return {
      message: "Error creating job",
      error: (error as Error & { digest?: string }) || "Unknown error",
    };
  }
}

// Action to update a job
export async function updateJob(
  id: number,
  data: UpdateJobData
): Promise<UpdateJobApiResponse | ErrorApiResponse> {
  try {
    const updatedJob = await prisma.job.update({
      where: { id },
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
      data,
    });

    return {
      message: "Successfully updated the job",
      data: updatedJob,
    };
  } catch (error) {
    console.error("Error updating job:", error);
    return {
      message: "Error updating job",
      error: (error as Error & { digest?: string }) || "Unknown error",
    };
  }
}

// Action to get all jobs
export async function getAllJobs(): Promise<
  GetAllJobsApiResponse | ErrorApiResponse
> {
  try {
    const allJobs = await prisma.job.findMany({
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
    return {
      message: "Jobs fetched successfully",
      data: allJobs,
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return {
      message: "Error fetching jobs",
      error: (error as Error & { digest?: string }) || "Unknown error",
    };
  }
}

// Action to get a specific job by ID
export async function getAJob(
  id: number
): Promise<GetJobApiResponse | ErrorApiResponse> {
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: id,
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

    if (!job) {
      return {
        error: "Job not found",
        message: "Could not fetch the job.",
      };
    }

    return {
      message: "Successfully fetched the job",
      data: job,
    };
  } catch (error) {
    console.error("Error fetching job:", error);
    return {
      message: "Error fetching job",
      error: (error as Error & { digest?: string }) || "Unknown error",
    };
  }
}
