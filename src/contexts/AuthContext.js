import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, loading: true, error: null };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                error: null
            };
        case 'LOGIN_FAILURE':
            return { ...state, loading: false, error: action.payload, isAuthenticated: false };
        case 'LOGOUT':
            return { ...state, isAuthenticated: false, user: null, token: null };
        case 'REGISTER_START':
            return { ...state, loading: true, error: null };
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                error: null
            };
        case 'REGISTER_FAILURE':
            return { ...state, loading: false, error: action.payload, isAuthenticated: false };
        case 'SET_USER':
            return { ...state, user: action.payload, isAuthenticated: true };
        default:
            return state;
    }
};

const initialState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchCurrentUser();
        }
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await api.get('/v1/me');
            if (response.data.success) {
                dispatch({ type: 'SET_USER', payload: response.data.data });
            }
        } catch (error) {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        }
    };

    const login = async (email, password) => {
        dispatch({ type: 'LOGIN_START' });
        try {
            const response = await api.post('/v1/login', { email, password });

            if (response.data.success) {
                const { user, token } = response.data.data;
                localStorage.setItem('token', token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: { user, token }
                });
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Pieteikšanās neizdevās';
            dispatch({ type: 'LOGIN_FAILURE', payload: message });
            return { success: false, error: message };
        }
    };

    const register = async (userData) => {
        dispatch({ type: 'REGISTER_START' });
        try {
            const response = await api.post('/v1/register', userData);

            if (response.data.success) {
                const { user, token } = response.data.data;
                localStorage.setItem('token', token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                dispatch({
                    type: 'REGISTER_SUCCESS',
                    payload: { user, token }
                });
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Reģistrācija neizdevās';
            dispatch({ type: 'REGISTER_FAILURE', payload: message });
            return { success: false, error: message, errors: error.response?.data?.errors };
        }
    };

    const logout = async () => {
            await api.post('/v1/logout');


        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        dispatch({ type: 'LOGOUT' });
    };

    const value = {
        ...state,
        login,
        register,
        logout,
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