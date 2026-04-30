import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and force logout on 401 Unauthorized
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data: URLSearchParams) => api.post('/auth/login', data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  register: (data: any) => api.post('/auth/register', data)
};

export const resumesAPI = {
  upload: (formData: FormData) => api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  analyze: (resumeId: number, roleId: number) => api.post(`/resumes/${resumeId}/match`, { role_id: roleId }),
  getAll: () => api.get('/resumes/'),
  getRoles: () => api.get('/resumes/roles'),
  delete: (resumeId: number) => api.delete(`/resumes/${resumeId}`),
};

export default api;
