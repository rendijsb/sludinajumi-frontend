import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });
    const [validationErrors, setValidationErrors] = useState({});

    const { login, loading, error, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.email) {
            errors.email = 'E-pasts ir obligāts';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'E-pasta formāts nav pareizs';
        }

        if (!formData.password) {
            errors.password = 'Parole ir obligāta';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Pieteikšanās</h1>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            E-pasta adrese
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-input ${validationErrors.email ? 'error' : ''}`}
                            placeholder="jūsu@epasts.lv"
                            disabled={loading}
                        />
                        {validationErrors.email && (
                            <div className="form-error">{validationErrors.email}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            Parole
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`form-input ${validationErrors.password ? 'error' : ''}`}
                            placeholder="Ievadiet paroli"
                            disabled={loading}
                        />
                        {validationErrors.password && (
                            <div className="form-error">{validationErrors.password}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-checkbox">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={formData.remember}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <span>Atcerēties mani</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full btn-lg"
                        disabled={loading}
                    >
                        {loading ? 'Notiek pieteikšanās...' : 'Pieteikties'}
                    </button>
                </form>

                <div className="auth-link">
                    <Link to="/forgot-password">Aizmirsi paroli?</Link>
                </div>

                <div className="auth-link">
                    Nav konta? <Link to="/register">Reģistrēties šeit</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;