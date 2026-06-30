import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle expired token globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
};

// Interview endpoints
export const interviewAPI = {
  start:        (data) => api.post('/interviews/start', data),
  submitAnswer: (data) => api.post('/interviews/answer', data),
  end:          (id)   => api.patch(`/interviews/${id}/end`),
  getHistory:   ()     => api.get('/interviews/history'),
  getOne:       (id)   => api.get(`/interviews/${id}`),
};