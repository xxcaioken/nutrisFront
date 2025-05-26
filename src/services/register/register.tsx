import { axiosInstance } from "../api/axiosInstance";

interface RegisterRequest {
  email: string;
  password: string;
  nome: string;
}

interface AuthResponse {
  token: string;
}

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post(`/register`, data);
  return response.data;
};
