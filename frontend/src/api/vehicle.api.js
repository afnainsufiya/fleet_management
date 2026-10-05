import api from './axios';

export const getVehicles = async (params = { limit: 100 }) => {
  const response = await api.get('/vehicles', { params });

  return response.data;
};

export const getVehicleById = async (id) => {
  const response = await api.get(`/vehicles/${id}`);

  return response.data;
};

export const createVehicle = async (vehicleData) => {
  const response = await api.post(
    '/vehicles',
    vehicleData
  );

  return response.data;
};

export const updateVehicle = async (id, vehicleData) => {
  const response = await api.put(
    `/vehicles/${id}`,
    vehicleData
  );

  return response.data;
};

export const deleteVehicle = async (id) => {
  const response = await api.delete(
    `/vehicles/${id}`
  );

  return response.data;
};