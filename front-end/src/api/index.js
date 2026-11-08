import axios from 'axios';

const API = axios.create({
  baseURL: '/api/v1',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('hms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (data) => API.post('/auth/reset-password', data);

// Rooms
export const getRooms = () => API.get('/rooms');
export const getRoom = (id) => API.get(`/rooms/${id}`);
export const createRoom = (data) => API.post('/rooms', data);
export const updateRoom = (id, data) => API.put(`/rooms/${id}`, data);
export const deleteRoom = (id) => API.delete(`/rooms/${id}`);

// Residents
export const getResidents = () => API.get('/residents');
export const getResident = (id) => API.get(`/residents/${id}`);
export const createResident = (data) => API.post('/residents', data);
export const updateResident = (id, data) => API.put(`/residents/${id}`, data);
export const deleteResident = (id) => API.delete(`/residents/${id}`);

// Fees
export const getFeeHeads = () => API.get('/fees/heads');
export const createFeeHead = (data) => API.post('/fees/heads', data);
export const getInvoices = () => API.get('/fees/invoices');
export const createInvoice = (data) => API.post('/fees/invoices', data);
export const recordPayment = (id, data) => API.put(`/fees/invoices/${id}/pay`, data);

// Dashboard
export const getDashboardStats = () => API.get('/dashboard/stats');

// Profile
export const updateProfile = (data) => API.put('/auth/profile', data);
export const changePassword = (data) => API.put('/auth/password', data);

export default API;
