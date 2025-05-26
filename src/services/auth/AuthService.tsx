import { axiosInstance } from '../api/axiosInstance';

const AUTH_URL = '/auth';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  nome: string;
}

interface AuthResponse {
  token: string;
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post(`${AUTH_URL}/login`, data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post(`${AUTH_URL}/register`, data);
  return response.data;
};

export const getCurrentUser = async (): Promise<any> => {
  const response = await axiosInstance.get(`${AUTH_URL}/me`);
  return response.data;
};
