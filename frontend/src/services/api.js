import axios from 'axios';

const API_URL = 'https://chainguard-backend.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || { 
      success: false, 
      message: error.message || 'Network error' 
    });
  }
);

// Auth services
export const authService = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },
  
  register: async (name, email, password) => {
    return api.post('/auth/register', { name, email, password });
  },
  
  getProfile: async () => {
    return api.get('/auth/profile');
  },
  
  logout: async () => {
    return api.post('/auth/logout');
  }
};

// Validation services
export const validationService = {
  validateTransaction: async (data) => {
    return api.post('/validations', data);
  },
  
  getValidations: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/validations${queryParams ? '?' + queryParams : ''}`);
  },
  
  getValidationById: async (id) => {
    return api.get(`/validations/${id}`);
  },
  
  revalidateTransaction: async (id) => {
    return api.post(`/validations/${id}/revalidate`);
  },
  
  deleteValidation: async (id) => {
    return api.delete(`/validations/${id}`);
  }
};

// Stats services
export const statsService = {
  getOverallStats: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/stats/overall${queryParams ? '?' + queryParams : ''}`);
  }
};

export default api;