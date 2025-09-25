// Frontend/frontend/src/api/customAxios.js
import axios from 'axios';

// Base URL from environment variable
const BASE_URL = process.env.REACT_APP_API_URL;

// API Client configuration
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 900000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// FinOps Client configuration
export const finopsClient = axios.create({
  baseURL: BASE_URL, // use same backend, adjust if different
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptors
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

finopsClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('finopsToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

finopsClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('finopsToken');
    }
    return Promise.reject(error);
  }
);
