import { GetAllUsersApiResponse } from "@/app/lib/definitions";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";

const API_URL = "/api/user";

const UsersService = () => {

  
  const useHandleGetAllUsers = () => {
    async function handleGetAllUsers(): Promise<GetAllUsersApiResponse> {
      const response = await axios.get(`${API_URL}`).then((res) => res.data);
      return response;
    }
  return useQuery({
      queryFn: handleGetAllUsers,
      queryKey: ["users"]
    });
  };


  return {
   
    useHandleGetAllUsers,
   
  };
};

export default UsersService;
