import { axiosInstance } from "../api/axiosInstance";
import { UserProfile } from "../profile/profileService";

export interface UserDTO extends UserProfile {
  password?: string;
  escolaId?: string;
  roles?: string[];
}

export interface ChangePasswordDTO {
  newPassword: string;
}

export const userService = {
  async getAll(): Promise<UserDTO[]> {
    const response = await axiosInstance.get<UserDTO[]>('/user');
    return response.data;
  },

  async getById(id: string): Promise<UserDTO> {
    const response = await axiosInstance.get<UserDTO>(`/user/${id}`);
    return response.data;
  },

  async create(user: Omit<UserDTO, 'id'>): Promise<UserDTO> {
    const response = await axiosInstance.post<UserDTO>('/register', user);
    return response.data;
  },

  async update(id: string, user: Omit<UserDTO, 'id'>): Promise<UserDTO> {
    const response = await axiosInstance.put<UserDTO>(`/user/${id}`, user);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/user/${id}`);
  },

  async changePassword(id: string, data: ChangePasswordDTO): Promise<void> {
    await axiosInstance.put(`/user/${id}/change-password`, data);
  }
}; 