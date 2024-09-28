import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { VoteType } from "@prisma/client";
import { toast } from "sonner";

const API_URL = "/api/vote";

const VoteService = () => {
  const useHandleAddVote = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({
        jobId,
        voteType,
      }: {
        jobId: number;
        voteType: VoteType;
      }) => {
        const response = await axios.post(API_URL, { jobId, voteType });
        return response.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["job", variables.jobId] });
        queryClient.invalidateQueries({
          queryKey: ["userVote", variables.jobId],
        });
        toast.success("Vote recorded successfully");
      },
      onError: (error) => {
        toast.error("Failed to record vote");
      },
    });
  };

  const useGetUserVote = (jobId: number, userId: number) => {
    return useQuery({
      queryKey: ["userVote", jobId, userId],
      queryFn: async () => {
        const response = await axios.get(
          `${API_URL}?jobId=${jobId}&userId=${userId}`
        );
        return response.data;
      },
    });
  };

  const useDeleteVote = (jobId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({ jobId }: { jobId: number }) => {
        const response = await axios.delete(`${API_URL}/${jobId}`);
        return response.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["job", variables.jobId] });
        queryClient.invalidateQueries({
          queryKey: ["userVote", variables.jobId],
        });
        toast.success("Unvote successful");
      },
      onError: (error) => {
        toast.error("Failed to  unvote");
      },
    });
  };

  return {
    useHandleAddVote,
    useDeleteVote,
    useGetUserVote,
  };
};

export default VoteService;
