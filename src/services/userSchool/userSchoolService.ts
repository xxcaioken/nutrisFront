import { axiosInstance } from "../api/axiosInstance";

export interface UserSchoolDTO {
  id: number;
  usuarioId: string;
  escolaId: string;
  linkPlanilha: string;
  dataCriacao: string;
  dataAtualizacao?: string;
  escola?: {
    id: string;
    nome: string;
  };
}

export const userSchoolService = {
  async getAll(): Promise<UserSchoolDTO[]> {
    const response = await axiosInstance.get<UserSchoolDTO[]>('/UsuarioEscola');
    return response.data;
  },

  async getById(id: number): Promise<UserSchoolDTO> {
    const response = await axiosInstance.get<UserSchoolDTO>(`/UsuarioEscola/${id}`);
    return response.data;
  },

  async getByUserId(userId: string): Promise<UserSchoolDTO[]> {
    const response = await axiosInstance.get<UserSchoolDTO[]>(`/UsuarioEscola/usuario/${userId}`);
    return response.data;
  },

  async create(userSchool: Omit<UserSchoolDTO, 'id' | 'dataCriacao' | 'dataAtualizacao'>): Promise<UserSchoolDTO> {
    const response = await axiosInstance.post<UserSchoolDTO>('/UsuarioEscola', userSchool);
    return response.data;
  },

  async update(id: number, userSchool: Omit<UserSchoolDTO, 'id' | 'dataCriacao' | 'dataAtualizacao'>): Promise<UserSchoolDTO> {
    const response = await axiosInstance.put<UserSchoolDTO>(`/UsuarioEscola/${id}`, userSchool);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/UsuarioEscola/${id}`);
  }
}; 