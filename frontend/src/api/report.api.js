import api from './axios';

export const getDashboardSummary = async () => {
  const response = await api.get('/reports/dashboard');

  return response.data;
};

export const getVehicleExpenseReport = async () => {
  const response = await api.get('/reports/vehicle-expenses');

  return response.data;
};

export const getFuelSummary = async () => {
  const response = await api.get('/reports/fuel-summary');

  return response.data;
};

export const getTripSummary = async () => {
  const response = await api.get('/reports/trip-summary');

  return response.data;
};

export const getMonthlyExpenseReport = async () => {
  const response = await api.get('/reports/monthly-expenses');

  return response.data;
};
