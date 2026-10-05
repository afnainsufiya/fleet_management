import api from './axios';

export const getFuelRecords = async () => {
  const response = await api.get('/fuel');

  return response.data;
};

export const getFuelRecordById = async (id) => {
  const response = await api.get(`/fuel/${id}`);

  return response.data;
};

export const createFuelRecord = async (fuelData) => {
  const response = await api.post('/fuel', fuelData);

  return response.data;
};

export const updateFuelRecord = async (id, fuelData) => {
  const response = await api.put(`/fuel/${id}`, fuelData);

  return response.data;
};

export const deleteFuelRecord = async (id) => {
  const response = await api.delete(`/fuel/${id}`);

  return response.data;
};
