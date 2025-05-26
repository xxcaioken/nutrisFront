import { axiosInstance } from '../../services/api/axiosInstance';

export const getUserProfile = async () => {
  const response = await axiosInstance.get('/profile/me'); //aq tem que chamar o serviço de profile
  return response.data;
};
