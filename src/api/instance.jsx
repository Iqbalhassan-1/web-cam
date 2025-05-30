import axios from 'axios';
import { BASE_URL } from './apiRoutes';

const api = axios.create({
  baseURL:BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    const { status } = error.response || {};
    if (status === 401) {
      console.warn("Unauthorized - redirecting to login...");
    } else if (status === 500) {
      console.error("Server error. Please try again later.");
    }
    return Promise.reject(error);
  }
);

export default api;
