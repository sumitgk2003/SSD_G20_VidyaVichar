import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // You can add Redux-based token logic here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Optionally, you can dispatch a Redux logout action here
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
