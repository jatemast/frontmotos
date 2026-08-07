import api from './client';

export const AuthAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  yo: () => api.get('/auth/yo'),
};

export const ClientesAPI = {
  listar: (params) => api.get('/clientes', { params }),
  obtener: (id) => api.get(`/clientes/${id}`),
  crear: (data) => api.post('/clientes', data),
  actualizar: (id, data) => api.put(`/clientes/${id}`, data),
  eliminar: (id) => api.delete(`/clientes/${id}`),
};

export const MotosAPI = {
  listar: (params) => api.get('/motos', { params }),
  obtener: (id) => api.get(`/motos/${id}`),
  crear: (data) => api.post('/motos', data),
  actualizar: (id, data) => api.put(`/motos/${id}`, data),
  eliminar: (id) => api.delete(`/motos/${id}`),
};

export const OrdenesAPI = {
  listar: (params) => api.get('/ordenes', { params }),
  obtener: (id) => api.get(`/ordenes/${id}`),
  crear: (data) => api.post('/ordenes', data),
  actualizar: (id, data) => api.put(`/ordenes/${id}`, data),
  cambiarEstado: (id, estado) => api.patch(`/ordenes/${id}/estado`, { estado }),
  eliminar: (id) => api.delete(`/ordenes/${id}`),
};

export const ItemsAPI = {
  listar: (ordenId) => api.get(`/ordenes/${ordenId}/items`),
  crear: (ordenId, data) => api.post(`/ordenes/${ordenId}/items`, data),
  actualizar: (ordenId, itemId, data) => api.put(`/ordenes/${ordenId}/items/${itemId}`, data),
  eliminar: (ordenId, itemId) => api.delete(`/ordenes/${ordenId}/items/${itemId}`),
};
