import axios from 'axios';

// The base URL will automatically pick up VITE_API_URL from .env or .env.production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // We assume the token is stored in localStorage. Update this logic if using a zustand store.
    const token = localStorage.getItem('kwickly_auth_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // E.g. Global 401 Unauthorized handling -> redirect to login
    if (error.response?.status === 401) {
      console.warn("Unauthorized access - redirecting to login.");
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
