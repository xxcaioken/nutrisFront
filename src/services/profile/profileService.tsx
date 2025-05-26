import { axiosInstance } from '../api/axiosInstance';

export interface UserProfile {
  id: string;
  email: string;
  nome: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await axiosInstance.get('/profile');
  return response.data;
};
