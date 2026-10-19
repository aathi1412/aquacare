import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://aquacare.development.catalystappsail.in/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach bearer token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aquapure_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for consistent error unwrapping
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data || {
      success: false,
      message: error.message || 'An unexpected network error occurred.',
      errors: [error.message],
    };

    if (error.response?.status === 401) {
      // Clear token if expired
      localStorage.removeItem('aquapure_admin_token');
    }

    return Promise.reject(errorData);
  }
);

export default api;
