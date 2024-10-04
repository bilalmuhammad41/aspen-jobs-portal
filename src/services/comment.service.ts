import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const API_URL = "/api/comments";

const CommentService = () => {

  
  const useHandleAddComment = (jobId: string | number | null) => {
    const queryClient = useQueryClient();
    async function handleAddComment(data: FormData): Promise<any> {
      const response = await axios.post(`${API_URL}`, data).then((res) => res.data);
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

  const useHandleDeleteComment = (jobId: string | number | null) => {
    const queryClient = useQueryClient();
    async function handleDeleteJob(commentId: string | number): Promise<any> {
      return axios.delete(`${API_URL}/${commentId}`,).then((res) => res.data);
    }

    return useMutation({
      mutationFn: handleDeleteJob,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["jobComments", jobId] });
        toast.success("Comment Deleted Successfully");
      },
      onError: (error: AxiosError<{ message: string }>) => {
        toast.error(error.response?.data?.message || "Failed to delete comment. Please try again later.");
      },
      retry: 0,
    });
  };

  

  return {
   
    useHandleAddComment,
    useHandleDeleteComment,
   
  };
};

export default CommentService;
