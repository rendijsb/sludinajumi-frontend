import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000,
    withCredentials: true,
});

let csrfTokenFetched = false;

const getCsrfToken = async () => {
    if (!csrfTokenFetched) {
        try {
            await api.get('/sanctum/csrf-cookie');
            csrfTokenFetched = true;
        } catch (error) {
            console.warn('Failed to fetch CSRF token:', error);
        }
    }
};

api.interceptors.request.use(
    async (config) => {
        if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
            await getCsrfToken();
        }

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

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
            error.message = 'Pieprasījums pārsniedza laika limitu';
        }

        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                    csrfTokenFetched = false; // Reset CSRF token flag
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

                case 419:
                    csrfTokenFetched = false;
                    break;

                case 422:
                    break;

                case 429:
                    error.message = 'Pārāk daudz pieprasījumu. Lūdzu, mēģiniet vēlāk';
                    break;

                case 500:
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

export const apiHelpers = {
    init: getCsrfToken,

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