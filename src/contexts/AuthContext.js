import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
} from 'react';
import api from '../services/api'; // axios instance

const AuthContext = createContext();

const initialState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
    error: null,
    validationErrors: {},
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
        case 'REGISTER_START':
            return { ...state, loading: true, error: null };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                error: null,
            };
        case 'LOGIN_FAILURE':
        case 'REGISTER_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload.message,
                validationErrors: action.payload.errors || {},
                isAuthenticated: false,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
            };
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload,
                loading: false,
            };
        case 'CLEAR_ERRORS':
            return {
                ...state,
                error: null,
                validationErrors: {},
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Fetch current user if token exists
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const response = await api.get('/v1/me');
                    dispatch({ type: 'SET_USER', payload: response.data });
                } catch (error) {
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                    dispatch({ type: 'SET_USER', payload: null });
                }
            } else {
                dispatch({ type: 'SET_USER', payload: null });
            }
        };

        initAuth();
    }, []);

    const login = async (email, password, remember = false) => {
        dispatch({ type: 'LOGIN_START' });

        try {
            const response = await api.post('/v1/login', {
                email,
                password,
                remember,
            });

            const userData = response.data;
            const token = userData.token;

            const { token: _, ...user } = userData;

            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token },
            });

            return { success: true };
        } catch (error) {
            const errorData = error.response?.data;
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: {
                    message: errorData?.message || 'Login failed',
                    errors: errorData?.errors || {},
                },
            });

            return {
                success: false,
                message: errorData?.message || 'Login failed',
                errors: errorData?.errors || {},
            };
        }
    };

    const register = async (userData) => {
        dispatch({ type: 'REGISTER_START' });

        try {
            const response = await api.post('/v1/register', userData);

            const registeredUser = response.data;
            const token = registeredUser.token;

            const { token: _, ...user } = registeredUser;

            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            dispatch({
                type: 'REGISTER_SUCCESS',
                payload: { user, token },
            });

            return { success: true };
        } catch (error) {
            const errorData = error.response?.data;
            dispatch({
                type: 'REGISTER_FAILURE',
                payload: {
                    message: errorData?.message || 'Registration failed',
                    errors: errorData?.errors || {},
                },
            });

            return {
                success: false,
                message: errorData?.message || 'Registration failed',
                errors: errorData?.errors || {},
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/v1/logout');
        } catch (error) {
            console.warn('Logout failed:', error);
        }

        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        dispatch({ type: 'LOGOUT' });
    };

    const clearErrors = useCallback(() => {
        dispatch({ type: 'CLEAR_ERRORS' });
    }, []);

    const value = {
        ...state,
        login,
        register,
        logout,
        clearErrors,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
