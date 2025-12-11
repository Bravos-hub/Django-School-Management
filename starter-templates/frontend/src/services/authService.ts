import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  token: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', credentials);
    return response.data.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', data);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async (): Promise<AuthResponse['user']> => {
    const response = await api.get<{ success: boolean; data: AuthResponse['user'] }>('/auth/me');
    return response.data.data;
  },
};
