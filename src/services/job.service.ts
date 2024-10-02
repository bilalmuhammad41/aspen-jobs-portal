import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  GetAllJobsApiResponse,
  GetJobApiResponse,
  CommentApiResponse,
} from "@/app/lib/definitions";
import { toast } from "sonner";
import { VoteType } from "@prisma/client";

const API_URL = "/api/jobs";

const JobsService = () => {
  const useFetchAllJobs = (
    page?: number,
    limit?: number,
    searchQuery?: string
  ) => {
    async function fetchAllJobs(): Promise<GetAllJobsApiResponse> {
      const response = await axios.get(API_URL);
      return response.data;
    }

    return useQuery({
      queryFn: fetchAllJobs,
      queryKey: ["jobs", page, limit, searchQuery],
    });
  };

  const useFetchSingleJob = (jobId: string | number | null) => {
    async function fetchJob(): Promise<GetJobApiResponse> {
      return axios.get(`${API_URL}/${jobId}`).then((res) => res.data);
    }

    return useQuery({
      queryFn: fetchJob,
      queryKey: ["job", jobId],
      enabled: !!jobId,
    });
  };

  const useFetchAllJobComments = (jobId: string | number | null) => {
    async function fetchComments(): Promise<CommentApiResponse> {
      return axios.get(`${API_URL}/${jobId}/comments`).then((res) => res.data);
    }

    return useQuery({
      queryFn: fetchComments,
      queryKey: ["jobComments", jobId],
      enabled: !!jobId,
    });
  };

  const useHandleCreateJob = () => {
    const queryClient = useQueryClient();
    async function handleCreateJob(formData: FormData): Promise<any> {
      const response = await axios.post(API_URL, formData);
      return response.data.data;
    }

    return useMutation({
      mutationFn: handleCreateJob,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        toast.success("Job Created Successfully");
      },
      onError: (error: AxiosError<{ error: string }>) => {
        toast.error(error.response?.data?.error || "Failed to create job");
      },
      retry: 0,
    });
  };

  const useHandleAddComment = (jobId: string | number | null) => {
    const queryClient = useQueryClient();
    async function handleAddComment(data: FormData): Promise<any> {
      const response = await axios.post(`${API_URL}/${jobId}/comments`, data).then((res) => res.data);
      return response.data.data;
    }
    const onSuccess = ()=>{
      queryClient.invalidateQueries({ queryKey: ["jobComments", jobId] });
        toast.success("Comment added successfully");
    }
    return useMutation({
      mutationFn: handleAddComment,
      onSuccess,
      onError: (error: AxiosError<{ error: string }>) => {
        toast.error(
          error.response?.data?.error || "Failed to add comment"
        );
      },
      retry: 0,
    });
  };
  const useHandleEditJob = (jobId: string | number | null) => {
    const queryClient = useQueryClient();
    async function handleEditJob(data: FormData): Promise<any> {
      return axios.put(`${API_URL}/${jobId}`, data).then((res) => res.data);
    }

    return useMutation({
      mutationFn: handleEditJob,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["job", jobId] });
        toast.success("Job Edited Successfully");
      },
      retry: 0,
    });
  };

  const useHandleDeleteJob = () => {
    const queryClient = useQueryClient();
    async function handleDeleteJob(id: string | number): Promise<any> {
      return axios.delete(`${API_URL}/${id}`).then((res) => res.data);
    }

    return useMutation({
      mutationFn: handleDeleteJob,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        toast.success("Job Deleted Successfully");
      },
      onError: (error: AxiosError<{ message: string }>) => {
        toast.error(error.response?.data?.message || "Failed to delete job");
      },
      retry: 0,
    });
  };

  const useHandleAddVote = () => {
    const queryClient = useQueryClient();
    async function handleVoteJob({
      jobId,
      userId,
      voteType,
    }: {
      jobId: number;
      userId: number;
      voteType: VoteType;
    }): Promise<any> {
      return axios
        .post(`${API_URL}/${jobId}/vote`, { userId, voteType })
        .then((res) => res.data);
    }

    return useMutation({
      mutationFn: handleVoteJob,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["job", variables.jobId] });
        toast.success("Vote recorded successfully");
      },
      onError: (error: AxiosError<{ message: string }>) => {
        toast.error(error.response?.data?.message || "Failed to record vote");
      },
      retry: 0,
    });
  };

  return {
    useFetchAllJobs,
    useFetchSingleJob,
    useFetchAllJobComments,
    useHandleAddComment,
    useHandleCreateJob,
    useHandleEditJob,
    useHandleDeleteJob,
    useHandleAddVote,
  };
};

export default JobsService;
