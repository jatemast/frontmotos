import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taller_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const mensaje =
      error.response?.data?.message || error.message || 'Ocurrio un error inesperado al conectar con el servidor.';

    if (error.response?.status === 401) {
      localStorage.removeItem('taller_token');
      localStorage.removeItem('taller_usuario');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject({ ...error, mensaje, details: error.response?.data?.details });
  }
);

export default api;
