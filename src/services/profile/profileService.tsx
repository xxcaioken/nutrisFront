import { axiosInstance } from '../api/axiosInstance';

export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  isAdmin?:boolean;
}

export interface UserSchool {
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

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await axiosInstance.get('/profile');
  return response.data;
};

export const getUserSchools = async (userId: string): Promise<UserSchool[]> => {
  const response = await axiosInstance.get(`/UsuarioEscola/usuario/${userId}`);
  return response.data;
};
