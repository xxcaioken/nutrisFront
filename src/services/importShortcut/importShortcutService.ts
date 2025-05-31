import { axiosInstance } from '../api/axiosInstance';
import { ImportacaoManagerDto, CreateImportacaoManagerDto, UpdateImportacaoManagerDto } from './importShortcutTypes';

const BASE_URL = '/ImportacaoManager';

export const importacaoManagerService = {
  getAll: async (): Promise<ImportacaoManagerDto[]> => {
    const response = await axiosInstance.get(BASE_URL);
    return response.data;
  },

  getAtivos: async (): Promise<ImportacaoManagerDto[]> => {
    const response = await axiosInstance.get(`${BASE_URL}/ativos`);
    return response.data;
  },

  getById: async (id: number): Promise<ImportacaoManagerDto> => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  getByUsuarioEscolaId: async (usuarioEscolaId: number): Promise<ImportacaoManagerDto[]> => {
    const response = await axiosInstance.get(`${BASE_URL}/usuarioescola/${usuarioEscolaId}`);
    return response.data;
  },

  create: async (data: CreateImportacaoManagerDto): Promise<ImportacaoManagerDto> => {
    const response = await axiosInstance.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateImportacaoManagerDto): Promise<ImportacaoManagerDto> => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  },

  executarImportacao: async (id: number): Promise<void> => {
    const response = await axiosInstance.post(`${BASE_URL}/${id}/executar`);
    return response.data;
  },
}; 