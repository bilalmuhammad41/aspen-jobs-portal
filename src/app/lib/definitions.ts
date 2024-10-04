import { User, VoteType } from "@prisma/client";
import Error from "next/error";
import { z } from "zod";

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().min(1, { message: "Password is required." }).trim(),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        server?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  name: string;
  userId: number;
  role: string;
  sessionId: number;
  expiresAt: Date;
};

export const CreateJobFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }).trim(),
  description: z
  .string()
  .min(1, { message: "Description is required." })
  .trim(),
  ownerId: z.string().min(1, { message: "Owner Id is required." }).trim(),
  status: z.string().min(1, { message: "Status is required." }).trim(),
  progress: z.string().min(1, { message: "Progress is required." }).trim(),
});

export interface ApiResponse {
  message: string;
}

// Job-related data interfaces
export interface JobData {
  title: string;
  description: string;
  ownerId: number | string;
}

// Update job data interface
export interface UpdateJobData {
  title?: string;
  description?: string;
  ownerId?: number;
}

export type Owner = {
  id: number;
  name: string;
  role: string;
};

// Job interface

export type CreateJob = {
  title: string;
  description: string;
  ownerId: number;
};

// API response for a single job
export interface GetJobApiResponse extends ApiResponse {
  data: Job;
}

// API response for multiple jobs
export interface GetAllJobsApiResponse extends ApiResponse {
  data: Job[];
  pagination: {
    total: number;     
    page: number;       
    limit: number;      
    totalPages: number; 
  };
}

export interface CreateJobApiResponse extends ApiResponse {
  data: Job;
}

export interface UpdateJobApiResponse extends ApiResponse {
  data: Job;
}

// User-related interfaces
export type GetUser = {
  id: number;
  name: string;
  role: string;
};

// API response for all users
export type GetAllUsersApiResponse = ApiResponse & {
  data: GetUser[];
};

export type ErrorApiResponse = ApiResponse & {
  error: string | Error;
};

export type GetJobStakeholdersApiResponse = {
  data: JobStakeholder[];
};

export type Job = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  upvotes: number;
  downvotes: number;
  owner: {
    id: number;
    name: string;
    role: "ADMIN" | "STAKEHOLDER";
  };
  admin: {
    id: number;
    name: string;
    role: "ADMIN" | "STAKEHOLDER";
  };
  comments: Comment[];
  votes: Vote[];
  jobStakeholders: JobStakeholder[];
  externalStakeholders: ExternalJobStakeholder[];
  userVote: VoteType;
  status: string;
  progress: number;
};
export type CommentApiResponse = {
  message: string;
  data: Comment[];
};
export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  user: {
    id: number;
    name: string;
  };
};

export type Vote = {
  id: number;
  voteType: "UPVOTE" | "DOWNVOTE";
  user: {
    id: number;
    name: string;
  };
};

export type JobStakeholder = {
  jobId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export type ExternalJobStakeholder = {
  jobId: number;
  externalStakeholder: {
    id: number;
    name: string;
    email: string;
  };
  user: User;
};
