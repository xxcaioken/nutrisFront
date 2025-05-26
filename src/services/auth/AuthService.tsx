import { axiosInstance } from '../api/axiosInstance';

const AUTH_URL = '/auth';

interface LoginRequest {
  email: string;
  password: string;
}


interface AuthResponse {
  token: string;
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post(`${AUTH_URL}/login`, data);
  return response.data;
};
