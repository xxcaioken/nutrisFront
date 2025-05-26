import { axiosInstance } from '../api/axiosInstance';
import { UserProfile } from '../profile/profileService';

const AUTH_URL = '/auth';

interface LoginRequest {
  email?: string;
  password: string|null;
  googleToken?: string;
}


interface AuthResponse {
  token: string;
  user: UserProfile;
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    console.log('Dados sendo enviados para login:', data);
    const response = await axiosInstance.post(`${AUTH_URL}/login`, data);
    return response.data;
  } catch (error: any) {
    console.error('Erro detalhado:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export const loginByGoogle = async  (data: LoginRequest): Promise<AuthResponse> => {
  try {
    console.log('Dados sendo enviados para login:', data);
    const response = await axiosInstance.post(`${AUTH_URL}/google`, data);
    return response.data;
  } catch (error: any) {
    console.error('Erro detalhado:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};
