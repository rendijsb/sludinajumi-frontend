import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
} from 'react';
import { apiHelpers } from '../services/api';

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
            return { ...state, loading: true, error: null, validationErrors: {} };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                error: null,
                validationErrors: {},
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

    // Initialize auth: fetch current user if token exists
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await apiHelpers.auth.me();
                    dispatch({ type: 'SET_USER', payload: response.data });
                } catch (error) {
                    console.warn('Failed to fetch user:', error);
                    localStorage.removeItem('token');
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
            const response = await apiHelpers.auth.login({
                email,
                password,
                remember,
            });

            const responseData = response.data;

            // Extract token and user data
            let token, user;

            if (responseData.token) {
                // Token is in response data directly
                token = responseData.token;
                user = { ...responseData };
                delete user.token; // Remove token from user object
            } else if (response.data.data && response.data.data.token) {
                // Token is nested in data
                token = response.data.data.token;
                user = { ...response.data.data };
                delete user.token;
            } else {
                throw new Error('No token received from server');
            }

            // Store token
            localStorage.setItem('token', token);

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token },
            });

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            const errorData = error.response?.data;
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: {
                    message: errorData?.message || error.message || 'Login failed',
                    errors: errorData?.errors || {},
                },
            });

            return {
                success: false,
                message: errorData?.message || error.message || 'Login failed',
                errors: errorData?.errors || {},
            };
        }
    };

    const register = async (userData) => {
        dispatch({ type: 'REGISTER_START' });

        try {
            const response = await apiHelpers.auth.register(userData);

            const responseData = response.data;

            // Extract token and user data
            let token, user;

            if (responseData.token) {
                // Token is in response data directly
                token = responseData.token;
                user = { ...responseData };
                delete user.token; // Remove token from user object
            } else if (response.data.data && response.data.data.token) {
                // Token is nested in data
                token = response.data.data.token;
                user = { ...response.data.data };
                delete user.token;
            } else {
                throw new Error('No token received from server');
            }

            // Store token
            localStorage.setItem('token', token);

            dispatch({
                type: 'REGISTER_SUCCESS',
                payload: { user, token },
            });

            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            const errorData = error.response?.data;
            dispatch({
                type: 'REGISTER_FAILURE',
                payload: {
                    message: errorData?.message || error.message || 'Registration failed',
                    errors: errorData?.errors || {},
                },
            });

            return {
                success: false,
                message: errorData?.message || error.message || 'Registration failed',
                errors: errorData?.errors || {},
            };
        }
    };

    const logout = async () => {
        try {
            await apiHelpers.auth.logout();
        } catch (error) {
            console.warn('Logout failed:', error);
        } finally {
            // Always clear local state regardless of API call success
            localStorage.removeItem('token');
            dispatch({ type: 'LOGOUT' });
        }
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