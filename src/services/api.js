import axios from 'axios';

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }

    // Default to localhost for development
    return 'http://localhost:8000';
};

const api = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    timeout: 10000,
    withCredentials: false, // Changed: API routes don't need credentials
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);

        // Add authorization header if token exists
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log('Request headers:', config.headers);

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log(`Response from ${response.config.url}:`, response.status);
        return response;
    },
    (error) => {
        console.error('Response error:', error);

        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
            error.message = 'Pieprasījums pārsniedza laika limitu';
        }

        if (error.response) {
            const { status, data } = error.response;
            console.error(`HTTP ${status} Error:`, data);

            switch (status) {
                case 401:
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    break;

                case 403:
                    error.message = data?.message || 'Jums nav atļaujas veikt šo darbību';
                    break;

                case 404:
                    error.message = data?.message || 'Resurss nav atrasts';
                    break;

                case 422:
                    // Validation errors - pass through
                    console.log('Validation errors:', data.errors);
                    break;

                case 429:
                    error.message = 'Pārāk daudz pieprasījumu. Lūdzu, mēģiniet vēlāk';
                    break;

                case 500:
                    console.error('Server error details:', data);
                    error.message = data?.message || 'Servera kļūda. Lūdzu, mēģiniet vēlāk';
                    break;

                default:
                    error.message = data?.message || 'Nezināma kļūda';
                    break;
            }
        } else if (error.request) {
            // Network error
            console.error('Network error - no response received');
            console.error('Request details:', error.request);
            error.message = 'Savienojuma kļūda. Pārbaudiet interneta savienojumu';
        } else {
            console.error('Request setup error:', error.message);
        }

        return Promise.reject(error);
    }
);

export const apiHelpers = {
    auth: {
        login: (credentials) => api.post('/api/v1/login', credentials),
        register: (userData) => api.post('/api/v1/register', userData),
        logout: () => api.post('/api/v1/logout'),
        me: () => api.get('/api/v1/me'),
        refresh: () => api.post('/api/v1/refresh'),
    },
};

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

export default api;