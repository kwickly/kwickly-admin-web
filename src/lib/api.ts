import axios from 'axios';

import { useAuthStore } from '@/store/useAuth';

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
    const { token, impersonatedTenantId } = useAuthStore.getState();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (impersonatedTenantId && config.headers) {
      config.headers['x-impersonate-tenant-id'] = impersonatedTenantId;
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
    // Global 401 Unauthorized handling -> clear store and redirect to login
    if (error.response?.status === 401) {
      console.warn("Unauthorized access - redirecting to login.");
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
