import { JobStatus } from "@prisma/client";

export const jobStatus = [
  "PENDING",
  "IN PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "FAILED",
  "ON HOLD",
];
export const getStatusColor = (status: string) => {
  switch (status) {
    case JobStatus.COMPLETED:
      return 'bg-green-500'
    case JobStatus.IN_PROGRESS:
      return 'bg-blue-500'
    case JobStatus.PENDING:
      return 'bg-yellow-500'
    case JobStatus.FAILED:
      return 'bg-red-500'
    case JobStatus.CANCELLED:
      return 'bg-slate-500'
    default:
      return 'bg-gray-500'
  }
}