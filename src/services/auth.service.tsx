import { useMutation } from "@tanstack/react-query";

import axios from "@/lib/config/axios-instance";
import tokenService from "@/services/token.service.ts";
import { loginApiResponse } from "@/lib/types/user";
import { z } from "zod";
import { loginFormSchema } from "@/lib/schemas";
import { useAuthStore } from "@/store/auth-store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthService = () => {
  //Note:Replace Any from here according to the types defined acc to the backend schema.....
  //Admin Log In
  const {setUser}=useAuthStore()
  const navigate=useNavigate();
  const useHandleLoginInService = () => {
    function handleLogInRequest(
      data: z.infer<typeof loginFormSchema>
    ): Promise<loginApiResponse> {
      return axios.post(`/auth/login`, data).then((res) => res.data);
    }

    const onSuccess = (response: loginApiResponse) => {
      if(response.data.user.role==="Admin" || response.data.user.role==="Super Admin"){
        setUser(response.data.user);
        tokenService.setUser(response.data.user);
        tokenService.setTokenRetries(5);
        tokenService.saveLocalAccessToken(response.data.access_token);
        navigate("/products/view")
      }
      else{
        toast.error("Only Admin can login.");
      }
      
    };
    // const onError = (error: errorType) => {
    //     toast.error(error.response.data.message);
    // };

    return useMutation({
      mutationFn: handleLogInRequest,
      onError:(error)=>{
        //@ts-ignore
        toast.error(error.response.data.message)
      },
      onSuccess,
      retry: 0,
    });
  };
  return {
    useHandleLoginInService,
  };
};

export default AuthService;
