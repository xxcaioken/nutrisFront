import axios from 'axios';

//const API_BASE_URL = 'https://localhost:5161/api'; // Altere para sua URL real
const API_BASE_URL = 'http://localhost:5161/api'; // sem https

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para adicionar o token JWT automaticamente
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
