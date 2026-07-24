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
      if (typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (impersonatedTenantId && config.headers) {
      if (typeof config.headers.set === 'function') {
        config.headers.set('x-impersonate-tenant-id', impersonatedTenantId);
      } else {
        config.headers['x-impersonate-tenant-id'] = impersonatedTenantId;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let refreshPromise: Promise<string> | null = null;

// Response Interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken, updateTokens, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${API_URL}/v1/auth/refresh`, { refreshToken })
          .then(({ data }) => {
            if (data.success) {
              const newToken = data.accessToken;
              const newRefreshToken = data.refreshToken || refreshToken;
              
              updateTokens(newToken, newRefreshToken);
              return newToken;
            } else {
              throw new Error('Refresh failed');
            }
          })
          .catch((err) => {
            logout();
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            throw err;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      return refreshPromise.then((token) => {
        // Axios v1+ compatibility for modifying headers
        if (originalRequest.headers && typeof originalRequest.headers.set === 'function') {
          originalRequest.headers.set('Authorization', `Bearer ${token}`);
        } else {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        
        // Fix for Axios parsing JSON strings twice on retry
        if (originalRequest.data && typeof originalRequest.data === 'string' && originalRequest.headers?.['Content-Type']?.includes('application/json')) {
          try {
             originalRequest.data = JSON.parse(originalRequest.data);
          } catch (e) {
             // Let it pass if it's not valid JSON (edge cases)
          }
        }
        
        return api(originalRequest);
      });
    }

    return Promise.reject(error);
  }
);

export default api;
