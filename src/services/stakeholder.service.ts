import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  GetJobApiResponse,
  GetJobStakeholdersApiResponse,
} from "@/app/lib/definitions";
import { toast } from "sonner";

const API_URL = "/api/stakeholder";

const StakeholderService = () => {
  const useFetchAllStakeholdersByJobId = (
    jobId: string | number | undefined,
    page?: number,
    limit?: number,
    searchQuery?: string
  ) => {
    async function fetchAllStakeholdersByJobId(): Promise<GetJobStakeholdersApiResponse> {
      const response = await axios.get(`${API_URL}/${jobId}`);
      return response.data;
    }

    return useQuery({
      queryFn: fetchAllStakeholdersByJobId,
      queryKey: ["stakeholders", page, limit, searchQuery],
    });
  };

  const useFetchSingleJob = (id: string | number | null) => {
    async function fetchJob(): Promise<GetJobApiResponse> {
      return axios.get(`${API_URL}/${id}`).then((res) => res.data);
    }

    return useQuery({
      queryFn: fetchJob,
      queryKey: ["job", id],
      enabled: !!id,
    });
  };

  const useHandleAddStakeholderToJob = () => {
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
  const useHandleBecomeStakeholder = ( jobId: string | number) => {
    const queryClient = useQueryClient();
    async function handleBecomeStakeholder(
      jobId: string | number
    ): Promise<any> {
      const response = await axios.post(API_URL, { jobId });
      return response.data.data;
    }
    const onSuccess = ()=>{
         queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["job", jobId] });
        toast.success("Successfully became stakeholder");
    }

    return useMutation({
      mutationFn: handleBecomeStakeholder,
      onSuccess: onSuccess,
      onError: (error: AxiosError<{ error: string }>) => {
        toast.error(
          error.response?.data?.error || "Failed to become stakeholder"
        );
      },
      retry: 0,
    });
  };

  const useHandleRemoveStakeholder = (jobId: string | number, ) => {
    const queryClient = useQueryClient();
    async function handleRemoveStakeholder(userId: string | number): Promise<any> {
      return axios.delete(`${API_URL}?jobId=${jobId}&userId=${userId}`).then((res) => res.data);
    }
    const onSuccess = () =>{
      
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      toast.success("Stakeholder Removal was Successful");
    }
    return useMutation({
      mutationFn: handleRemoveStakeholder,
      onSuccess,
      onError: (error: AxiosError<{ message: string }>) => {
        toast.error(error.response?.data?.message || "Failed to removel stakeholder");
      },
      retry: 0,
    });
  };

  return {
    useFetchAllStakeholdersByJobId,
    useHandleBecomeStakeholder,
    useFetchSingleJob,
    useHandleAddStakeholderToJob,
    useHandleRemoveStakeholder,
  };
};

export default StakeholderService;
