import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // O endereço do seu Backend NestJS
});

// Interceptor: Antes de cada requisição, ele insere o Token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Vamos salvar como 'token'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;