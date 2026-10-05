import api from './axios';

export const getAssignments = async () => {
  const response = await api.get('/driver-assignments');

  return response.data;
};

export const getAssignmentById = async (id) => {
  const response = await api.get(`/driver-assignments/${id}`);

  return response.data;
};

export const createAssignment = async (data) => {
  const response = await api.post('/driver-assignments', data);

  return response.data;
};

export const updateAssignment = async (id, data) => {
  const response = await api.put(`/driver-assignments/${id}`, data);

  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await api.delete(`/driver-assignments/${id}`);

  return response.data;
};
