import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8888/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.log('✅ Response:', response.config.url, response.status);
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as any)?.message || 'An error occurred';

      switch (status) {
        case 401:
          // Unauthorized - Clear token and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
          break;

        case 403:
          toast.error("You don't have permission to perform this action.");
          break;

        case 404:
          toast.error('Resource not found.');
          break;

        case 400:
          // Validation errors
          const validationErrors = (error.response.data as any)?.validationErrors;
          if (validationErrors) {
            Object.values(validationErrors).forEach((err) => {
              toast.error(err as string);
            });
          } else {
            toast.error(message);
          }
          break;

        case 500:
          toast.error('Server error. Please try again later.');
          break;

        default:
          toast.error(message);
      }

      console.error('❌ Error:', { status, message, url: error.config?.url });
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
      console.error('❌ Network Error:', error.message);
    } else {
      toast.error('An unexpected error occurred.');
      console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
