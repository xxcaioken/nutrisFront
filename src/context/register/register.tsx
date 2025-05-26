import { axiosInstance } from '../../services/api/axiosInstance';

interface RegisterPayload {
  email: string;
  password: string;
  nome: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data;
};
