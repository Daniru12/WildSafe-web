import api from '../utils/api';

const resourceService = {
  getAllResources: async (status = '') => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/resources${params}`);
    return response.data;
  },
  getResource: async (id) => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },
  createResource: async (resourceData) => {
    const response = await api.post('/resources', resourceData);
    return response.data;
  },
  updateResource: async (id, resourceData) => {
    const response = await api.put(`/resources/${id}`, resourceData);
    return response.data;
  },
  assignResource: async (id, staffId) => {
    const response = await api.put(`/resources/${id}/assign`, { staffId });
    return response.data;
  },
  releaseResource: async (id) => {
    const response = await api.put(`/resources/${id}`, { status: 'AVAILABLE', assignedTo: null });
    return response.data;
  },
  getAllStaff: async () => {
    const response = await api.get('/staff');
    return response.data;
  },
  deleteResource: async (id) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  }
};

export default resourceService;
