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

export interface RegisterResponse {
  data: {
    to: string;
    token: string;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      is_verified: boolean;
      created_at: string;
      updated_at: string;
      ip_address: string;
      user_agent: string;
      registration_type: string;
      email_verified_at?: string | null;
    };
  };
}

export interface AuthResponse {
  status: boolean;
  data: {
    user: User;
    is_verified: boolean;
    to: string;
  };
  message: string;
  plan: string | null;
}

export interface LoginResponse {
  status: boolean;
  data: {
    to: string;
    token: string;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      is_verified: boolean;
      created_at: string;
      updated_at: string;
      ip_address: string;
      user_agent: string;
      registration_type: string;
      email_verified_at?: string | null;
    };
  }
}

interface ForgotPasswordResponse {
  status: boolean;
  message: string;
}

interface CheckoutResponse {
  status: boolean;
  to: string;
  message?: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  ip_address: string;
  user_agent: string;
  registration_type: string;
  email_verified_at?: string | null;
  photo_url?: string | null;
  google_id?: string | null;
  stripe_id?: string | null;
  pm_type?: string | null;
  pm_last_four?: string | null;
  referral_code?: string;
  referral_balance?: string;
  referral_amount_used?: string;
  combination?: number;
  comparison?: number;
  summary?: number;
  trial_ends_at?: string | null;
  subscriptions?: any[];
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/login', credentials);
    console.log('login response data', response.data);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    const response = await api.post('/register', credentials);
    console.log('register data', response.data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    console.log(response,'logged out')
    return response.data;
  },

  getUser: async (): Promise<AuthResponse> => {
    const response = await api.post('/auth');
    console.log('getuser response')
    return response.data;
  },

  verifyEmail: async (data: { code: string }) => {
    try {
      const response = await api.post('/email/verify', data);
      console.log('verification data', response);
      return response.data;
    } catch (error: any) {
      console.error('Verification API error:', {
        status: error.response?.status,
        data: error.response?.data,
        code: data.code
      });
      throw error;
    }
  },

  resendVerification: async () => {
    const response = await api.post('/resend/code');
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
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

  checkout: async (data: { 
    plan: 'free' | 'standard' | 'plus' | 'custom';
    billing_cycle: 'monthly' | 'yearly';
  }): Promise<CheckoutResponse> => {
    const response = await api.post('/checkout', data);
    return response.data;
  },
};