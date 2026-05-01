import api from './api';

export const clientService = {
  getAll: async () => {
    const response = await api.get('/clients');
    return response.data.clients || [];
  },

  getById: async (clientId) => {
    const response = await api.get(`/clients/${clientId}`);
    return response.data;
  },

  create: async (clientData) => {
    const response = await api.post('/clients/register', clientData);
    return response.data;
  },

  update: async (clientId, updateData) => {
    const response = await api.put(`/clients/${clientId}`, updateData);
    return response.data;
  },

  delete: async (clientId) => {
    const response = await api.delete(`/clients/${clientId}`);
    return response.data;
  },
};
