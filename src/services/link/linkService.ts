// Assumindo que você tem um apiClient configurado
import { axiosInstance } from '../api/axiosInstance';
import { LinkDto, CreateLinkDto, UpdateLinkDto } from './linkTypes';

const BASE_URL = '/Link';

export const linkService = {
  getByUsuarioEscolaId: async (usuarioEscolaId: number): Promise<LinkDto[]> => {
    const response = await axiosInstance.get(`${BASE_URL}/usuarioescola/${usuarioEscolaId}`);
    return response.data;
  },

  create: async (data: CreateLinkDto): Promise<LinkDto> => {
    const response = await axiosInstance.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateLinkDto): Promise<LinkDto> => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  },
}; 