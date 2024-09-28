import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CreateJob, GetAllJobsApiResponse, GetJobApiResponse, Job, UpdateJobData } from '@/app/lib/definitions';
import { z } from 'zod';
import {toast} from 'sonner'

const API_URL = '/api/jobs';

// Define the CreateJobFormSchema using zod
const CreateJobFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  ownerId: z.string().min(1, "Owner ID is required"),
});

type CreateJobFormData = z.infer<typeof CreateJobFormSchema>;

export const useJobs = () => {
  return useQuery<Job[], Error>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await axios.get(API_URL);
      return response.data.data;
    },
  });
};

export const useJob = (id: number) => {
  return useQuery<Job, Error>({
    queryKey: ['job', id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}?id=${id}`);
      return response.data.data;
    },
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation<Job, Error, CreateJobFormData>({
    mutationFn: async (newJob) => {
      const response = await axios.post(API_URL, newJob);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation<Job, Error, { id: number; data: UpdateJobData }>({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`${API_URL}?id=${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', variables.id] });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await axios.delete(`${API_URL}?id=${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

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
  const useFetchSingleJob = (id: string | number | null) => {
    function fetchProduct(): Promise<GetJobApiResponse> {
      return axios.get(`/product/${id}`).then((res) => res.data);
    }

    return useQuery({
      queryFn: fetchProduct,
      queryKey: ["product", id],
      enabled: !!id,
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
      onError: (error) => {
        //@ts-ignore
        toast.error(error.response.data.error);
      },
      retry: 0,
    });
  };
  const useHandleEditJob = (productId: string | number | null) => {
    const queryClient = useQueryClient();
    function handleEditJob(data: FormData): Promise<any> {
      return axios.put(`/product/${productId}`, data).then((res) => res.data);
    }

    return useMutation({
      mutationFn: handleEditJob,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["product", productId] });
        toast.success("Product Edited Successfully");
      },
      retry: 0,
    });
  };

  const useHandleDeleteJob = () => {
    const queryClient = useQueryClient();
    async function handleDeleteJob(id: string | number): Promise<any> {
      return axios.delete(`/product/${id}`).then((res) => res.data);
    }

    return useMutation({
      mutationFn: handleDeleteJob,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Product Deleted Successfully");
      },
      onError: (error) => {
        //@ts-ignore
        toast.error(
          //@ts-ignore
          error.response?.data?.message || "Failed to delete product"
        );
      },
      retry: 0,
    });
  };

  return {
    useFetchAllJobs,
    useHandleCreateJob,
    useFetchSingleJob,
    useHandleEditJob,
    useHandleDeleteJob,
  };
};

export default JobsService;