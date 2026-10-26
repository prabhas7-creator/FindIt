import axios from 'axios';

// In development, Vite proxies '/api' to 'http://localhost:5000'
// In production, VITE_API_BASE_URL can point to Render backend URL
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true, // Send and receive HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Also attach Authorization header if token is in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('findit_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract error messages cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
