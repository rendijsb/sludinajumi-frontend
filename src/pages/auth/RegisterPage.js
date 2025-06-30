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
    const [validationErrors, setValidationErrors] = useState({});

    const { register, loading, error, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

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

        if (!formData.name.trim()) {
            errors.name = 'Vārds ir obligāts';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Vārdam jābūt vismaz 2 simboli garam';
        }

        if (!formData.email) {
            errors.email = 'E-pasts ir obligāts';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'E-pasta formāts nav pareizs';
        }

        if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
            errors.phone = 'Telefona numura formāts nav pareizs';
        }

        if (!formData.password) {
            errors.password = 'Parole ir obligāta';
        } else if (formData.password.length < 8) {
            errors.password = 'Parolei jābūt vismaz 8 simboli garai';
        }

        if (!formData.password_confirmation) {
            errors.password_confirmation = 'Paroles apstiprinājums ir obligāts';
        } else if (formData.password !== formData.password_confirmation) {
            errors.password_confirmation = 'Paroles nesakrīt';
        }

        if (!formData.terms_accepted) {
            errors.terms_accepted = 'Jāpiekrīt lietošanas noteikumiem';
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

        const result = await register(formData);

        if (result.success) {
            navigate('/', { replace: true });
        } else if (result.errors) {
            setValidationErrors(result.errors);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Reģistrācija</h1>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
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
                            className={`form-input ${validationErrors.name ? 'error' : ''}`}
                            placeholder="Jūsu vārds"
                            disabled={loading}
                        />
                        {validationErrors.name && (
                            <div className="form-error">{validationErrors.name}</div>
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
                            className={`form-input ${validationErrors.email ? 'error' : ''}`}
                            placeholder="jūsu@epasts.lv"
                            disabled={loading}
                        />
                        {validationErrors.email && (
                            <div className="form-error">{validationErrors.email}</div>
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
                            className={`form-input ${validationErrors.phone ? 'error' : ''}`}
                            placeholder="+371 20000000"
                            disabled={loading}
                        />
                        {validationErrors.phone && (
                            <div className="form-error">{validationErrors.phone}</div>
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
                            className={`form-input ${validationErrors.password ? 'error' : ''}`}
                            placeholder="Vismaz 8 simboli"
                            disabled={loading}
                        />
                        {validationErrors.password && (
                            <div className="form-error">{validationErrors.password}</div>
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
                            className={`form-input ${validationErrors.password_confirmation ? 'error' : ''}`}
                            placeholder="Atkārtojiet paroli"
                            disabled={loading}
                        />
                        {validationErrors.password_confirmation && (
                            <div className="form-error">{validationErrors.password_confirmation}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-checkbox">
                            <input
                                type="checkbox"
                                name="terms_accepted"
                                checked={formData.terms_accepted}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <span>
                Piekrītu <Link to="/terms" target="_blank">lietošanas noteikumiem</Link> un{' '}
                                <Link to="/privacy" target="_blank">privātuma politikai</Link> *
              </span>
                        </label>
                        {validationErrors.terms_accepted && (
                            <div className="form-error">{validationErrors.terms_accepted}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full btn-lg"
                        disabled={loading}
                    >
                        {loading ? 'Notiek reģistrācija...' : 'Reģistrēties'}
                    </button>
                </form>

                <div className="auth-link">
                    Jau ir konts? <Link to="/login">Pieteikties šeit</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;