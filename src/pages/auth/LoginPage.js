import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });
    const [clientErrors, setClientErrors] = useState({});
    const [touched, setTouched] = useState({});

    const { login, loading, error, validationErrors, isAuthenticated, clearErrors } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    useEffect(() => {
        // Clear errors when component mounts
        clearErrors();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const validateField = (name, value) => {
        const errors = {};

        switch (name) {
            case 'email':
                if (!value.trim()) {
                    errors.email = 'E-pasta adrese ir obligāta';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors.email = 'E-pasta adrese nav derīga';
                } else if (value.length > 255) {
                    errors.email = 'E-pasta adrese nedrīkst būt garāka par 255 simboliem';
                }
                break;
            case 'password':
                if (!value) {
                    errors.password = 'Parole ir obligāta';
                }
                break;
            default:
                break;
        }

        return errors;
    };

    const validateAllFields = () => {
        const errors = {};

        Object.keys(formData).forEach(field => {
            if (field !== 'remember') {
                const fieldErrors = validateField(field, formData[field]);
                Object.assign(errors, fieldErrors);
            }
        });

        return errors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Clear client-side errors for this field
        if (clientErrors[name]) {
            setClientErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Real-time validation for touched fields
        if (touched[name] && type !== 'checkbox') {
            const fieldErrors = validateField(name, newValue);
            setClientErrors(prev => ({
                ...prev,
                ...fieldErrors
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        // Validate on blur
        const fieldErrors = validateField(name, value);
        setClientErrors(prev => ({
            ...prev,
            ...fieldErrors
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouched({
            email: true,
            password: true
        });

        const errors = validateAllFields();
        setClientErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        const result = await login(formData.email, formData.password, formData.remember);

        if (result.success) {
            navigate(from, { replace: true });
        }
    };

    // Combine client-side and server-side errors
    const allErrors = { ...clientErrors, ...validationErrors };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Pieteikšanās</h1>
                    <p className="auth-subtitle">Pieteikties savā kontā</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            E-pasta adrese *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-input ${allErrors.email ? 'error' : ''}`}
                            placeholder="jūsu@epasts.lv"
                            disabled={loading}
                            autoComplete="email"
                            autoFocus
                        />
                        {allErrors.email && (
                            <div className="form-error">{allErrors.email[0] || allErrors.email}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            Parole *
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-input ${allErrors.password ? 'error' : ''}`}
                            placeholder="Ievadiet paroli"
                            disabled={loading}
                            autoComplete="current-password"
                        />
                        {allErrors.password && (
                            <div className="form-error">{allErrors.password[0] || allErrors.password}</div>
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
                        {loading ? (
                            <>
                                <span className="btn-spinner"></span>
                                Notiek pieteikšanās...
                            </>
                        ) : (
                            'Pieteikties'
                        )}
                    </button>
                </form>

                <div className="auth-links">
                    <Link to="/forgot-password" className="auth-link">
                        Aizmirsi paroli?
                    </Link>
                </div>

                <div className="auth-divider">
                    <span>vai</span>
                </div>

                <div className="auth-links">
                    <span>Nav konta? </span>
                    <Link to="/register" className="auth-link auth-link-primary">
                        Reģistrēties šeit
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;