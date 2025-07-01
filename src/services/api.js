import axios from 'axios';
import { useState } from 'react';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000, // 10 second timeout
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
    (response) => {
        return response;
    },
    (error) => {
        // Handle different types of errors
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
            error.message = 'Pieprasījums pārsniedza laika limitu';
        }

        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    break;

                case 403:
                    // Forbidden
                    error.message = data?.message || 'Jums nav atļaujas veikt šo darbību';
                    break;

                case 404:
                    // Not found
                    error.message = data?.message || 'Resurss nav atrasts';
                    break;

                case 422:
                    // Validation errors - these are handled by the components
                    break;

                case 429:
                    // Too many requests
                    error.message = 'Pārāk daudz pieprasījumu. Lūdzu, mēģiniet vēlāk';
                    break;

                case 500:
                    // Server error
                    error.message = data?.message || 'Servera kļūda. Lūdzu, mēģiniet vēlāk';
                    break;

                default:
                    error.message = data?.message || 'Nezināma kļūda';
                    break;
            }
        } else if (error.request) {
            // Network error
            error.message = 'Savienojuma kļūda. Pārbaudiet interneta savienojumu';
        }

        return Promise.reject(error);
    }
);

// API helper functions for common operations
export const apiHelpers = {
    // Authentication
    auth: {
        login: (credentials) => api.post('/v1/login', credentials),
        register: (userData) => api.post('/v1/register', userData),
        logout: () => api.post('/v1/logout'),
        me: () => api.get('/v1/me'),
        refresh: () => api.post('/v1/refresh'),
    },

    // Future endpoints can be added here
    // advertisements: {
    //     list: (params) => api.get('/v1/advertisements', { params }),
    //     create: (data) => api.post('/v1/advertisements', data),
    //     update: (id, data) => api.put(`/v1/advertisements/${id}`, data),
    //     delete: (id) => api.delete(`/v1/advertisements/${id}`),
    // },

    // categories: {
    //     list: () => api.get('/v1/categories'),
    // },
};

// Utility function to handle API responses consistently
export const handleApiResponse = async (apiCall) => {
    try {
        const response = await apiCall;
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
            errors: error.response?.data?.errors || {},
            status: error.response?.status,
        };
    }
};

// Hook for handling loading states
export const useApiCall = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = async (apiCall) => {
        setLoading(true);
        setError(null);

        try {
            const result = await handleApiResponse(apiCall);
            return result;
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { execute, loading, error };
};

export default api;