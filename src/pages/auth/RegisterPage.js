import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        terms_accepted: false
    });
    const [clientErrors, setClientErrors] = useState({});
    const [touched, setTouched] = useState({});

    const { register, loading, error, validationErrors, isAuthenticated, clearErrors } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        // Clear errors when component mounts
        clearErrors();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const validateField = (name, value) => {
        const errors = {};

        switch (name) {
            case 'name':
                if (!value.trim()) {
                    errors.name = 'Vārds ir obligāts';
                } else if (value.trim().length < 2) {
                    errors.name = 'Vārdam jābūt vismaz 2 simboli garam';
                } else if (value.length > 255) {
                    errors.name = 'Vārds nedrīkst būt garāks par 255 simboliem';
                }
                break;
            case 'email':
                if (!value.trim()) {
                    errors.email = 'E-pasta adrese ir obligāta';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors.email = 'E-pasta adrese nav derīga';
                } else if (value.length > 255) {
                    errors.email = 'E-pasta adrese nedrīkst būt garāka par 255 simboliem';
                }
                break;
            case 'phone':
                if (value && !/^[\+]?[0-9\s\-\(\)]+$/.test(value)) {
                    errors.phone = 'Telefona numura formāts nav pareizs';
                } else if (value.length > 20) {
                    errors.phone = 'Telefona numurs nedrīkst būt garāks par 20 simboliem';
                }
                break;
            case 'password':
                if (!value) {
                    errors.password = 'Parole ir obligāta';
                } else if (value.length < 8) {
                    errors.password = 'Parolei jābūt vismaz 8 simboli garai';
                } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
                    errors.password = 'Parolei jāsatur gan burti, gan cipari';
                }
                break;
            case 'password_confirmation':
                if (!value) {
                    errors.password_confirmation = 'Paroles apstiprinājums ir obligāts';
                } else if (value !== formData.password) {
                    errors.password_confirmation = 'Paroles nesakrīt';
                }
                break;
            case 'terms_accepted':
                if (!value) {
                    errors.terms_accepted = 'Jāpiekrīt lietošanas noteikumiem';
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
            const fieldErrors = validateField(field, formData[field]);
            Object.assign(errors, fieldErrors);
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
        if (touched[name]) {
            const fieldErrors = validateField(name, newValue);
            setClientErrors(prev => ({
                ...prev,
                ...fieldErrors
            }));
        }

        // Special case: if password changes, revalidate password_confirmation
        if (name === 'password' && touched.password_confirmation && formData.password_confirmation) {
            const confirmErrors = validateField('password_confirmation', formData.password_confirmation);
            setClientErrors(prev => ({
                ...prev,
                ...confirmErrors
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
        const allFields = Object.keys(formData);
        const touchedState = allFields.reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {});
        setTouched(touchedState);

        const errors = validateAllFields();
        setClientErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        const result = await register(formData);

        if (result.success) {
            navigate('/', { replace: true });
        }
    };

    // Combine client-side and server-side errors
    const allErrors = { ...clientErrors, ...validationErrors };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Reģistrācija</h1>
                    <p className="auth-subtitle">Izveidojiet jaunu kontu</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">
                            Vārds *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-input ${allErrors.name ? 'error' : ''}`}
                            placeholder="Jūsu vārds"
                            disabled={loading}
                            autoComplete="name"
                            autoFocus
                        />
                        {allErrors.name && (
                            <div className="form-error">{allErrors.name[0] || allErrors.name}</div>
                        )}
                    </div>

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
                        />
                        {allErrors.email && (
                            <div className="form-error">{allErrors.email[0] || allErrors.email}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="phone">
                            Telefona numurs
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-input ${allErrors.phone ? 'error' : ''}`}
                            placeholder="+371 20000000"
                            disabled={loading}
                            autoComplete="tel"
                        />
                        {allErrors.phone && (
                            <div className="form-error">{allErrors.phone[0] || allErrors.phone}</div>
                        )}
                    </div>

                    <div className="form-row">
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
                                placeholder="Vismaz 8 simboli"
                                disabled={loading}
                                autoComplete="new-password"
                            />
                            {allErrors.password && (
                                <div className="form-error">{allErrors.password[0] || allErrors.password}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password_confirmation">
                                Apstiprināt paroli *
                            </label>
                            <input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`form-input ${allErrors.password_confirmation ? 'error' : ''}`}
                                placeholder="Atkārtojiet paroli"
                                disabled={loading}
                                autoComplete="new-password"
                            />
                            {allErrors.password_confirmation && (
                                <div className="form-error">{allErrors.password_confirmation[0] || allErrors.password_confirmation}</div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-checkbox">
                            <input
                                type="checkbox"
                                name="terms_accepted"
                                checked={formData.terms_accepted}
                                onChange={handleChange}
                                disabled={loading}
                                className={allErrors.terms_accepted ? 'error' : ''}
                            />
                            <span>
                                Piekrītu <Link to="/terms" target="_blank" className="terms-link">lietošanas noteikumiem</Link> un{' '}
                                <Link to="/privacy" target="_blank" className="terms-link">privātuma politikai</Link> *
                            </span>
                        </label>
                        {allErrors.terms_accepted && (
                            <div className="form-error">{allErrors.terms_accepted[0] || allErrors.terms_accepted}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full btn-lg"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="btn-spinner"></span>
                                Notiek reģistrācija...
                            </>
                        ) : (
                            'Reģistrēties'
                        )}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>vai</span>
                </div>

                <div className="auth-links">
                    <span>Jau ir konts? </span>
                    <Link to="/login" className="auth-link auth-link-primary">
                        Pieteikties šeit
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;