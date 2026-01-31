import axios from 'axios';

// O Vite usa 'import.meta.env' para acessar variáveis de ambiente.
// Se a variável VITE_API_URL não estiver definida, ele usa o localhost como fallback.
const api = axios.create({
  // Forçamos o TypeScript a tratar import.meta como 'any'
  baseURL: (import.meta as any).env.VITE_API_URL || 'http://localhost:3000',
});

// Interceptor: Antes de cada requisição, ele insere o Token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;