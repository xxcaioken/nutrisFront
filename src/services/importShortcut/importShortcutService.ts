import { axiosInstance } from '../api/axiosInstance';
import { ImportShortcutDto, CreateImportShortcutDto, UpdateImportShortcutDto } from './importShortcutTypes';

const BASE_URL = '/ImportShortcut';

export const importShortcutService = {
  getByUsuarioEscolaId: async (usuarioEscolaId: number): Promise<ImportShortcutDto[]> => {
    const response = await axiosInstance.get(`${BASE_URL}/usuarioescola/${usuarioEscolaId}`);
    return response.data;
  },

  create: async (data: CreateImportShortcutDto): Promise<ImportShortcutDto> => {
    const response = await axiosInstance.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateImportShortcutDto): Promise<ImportShortcutDto> => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  },
}; 