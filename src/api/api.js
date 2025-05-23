import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gildedpages-dgekewc2cvdchnet.canadacentral-01.azurewebsites.net/api' || import.meta.env.VITE_API_BASE_URL || localStorage.getItem('apiBaseURL') || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
