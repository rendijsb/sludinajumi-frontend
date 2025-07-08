import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    is_active: boolean;
    email_verified_at: string;
    phone_verified_at: string;
    role: {
        id: number;
        name: string;
        display_name: string;
    };
}

export interface LoginData {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterData {
    name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
    terms_accepted: boolean;
}

export interface AuthResponse {
    data: User;
    token?: string;
}

export const authAPI = {
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post('/login', data);
        return response.data;
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post('/register', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post('/logout');
    },

    getMe: async (): Promise<User> => {
        const response = await api.get('/me');
        return response.data.data;
    },

    refresh: async (): Promise<AuthResponse> => {
        const response = await api.post('/refresh');
        return response.data;
    },
};