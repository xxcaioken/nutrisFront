import { axiosInstance } from "../api/axiosInstance";

export interface EscolaDTO {
  id: string;
  nome: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  dataCriacao: string;
}

export const schoolService = {
  async getAll(): Promise<EscolaDTO[]> {
    const response = await axiosInstance.get<EscolaDTO[]>('/escola');
    return response.data;
  },

  async getById(id: string): Promise<EscolaDTO> {
    const response = await axiosInstance.get<EscolaDTO>(`/escola/${id}`);
    return response.data;
  },

  async create(escola: Omit<EscolaDTO, 'id' | 'dataCriacao'>): Promise<EscolaDTO> {
    const response = await axiosInstance.post<EscolaDTO>('/escola', escola);
    return response.data;
  },

  async update(id: string, escola: Omit<EscolaDTO, 'id' | 'dataCriacao'>): Promise<EscolaDTO> {
    const response = await axiosInstance.put<EscolaDTO>(`/escola/${id}`, escola);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/escola/${id}`);
  }
}; 