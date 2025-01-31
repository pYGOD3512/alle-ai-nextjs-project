import api from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials) => {
    const response = await api.post('/register', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.post(`/email/verify/${token}`);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: { 
    token: string; 
    email: string; 
    password: string; 
    password_confirmation: string 
  }) => {
    const response = await api.post('/reset-password', data);
    return response.data;
  },

  getUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },
};