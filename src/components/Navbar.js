import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setShowUserMenu(false);
    };

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    Sludinājumi.lv
                </Link>

                <ul className="navbar-nav">
                    <li>
                        <Link to="/">Sākums</Link>
                    </li>

                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link to="/create-ad" className="btn btn-primary">
                                    Ievietot sludinājumu
                                </Link>
                            </li>
                            <li className="user-menu" style={{ position: 'relative' }}>
                                <button
                                    onClick={toggleUserMenu}
                                    className="user-menu-button"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        color: '#4a5568'
                                    }}
                                >
                                    <div className="user-avatar" style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: '#3182ce',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}>
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{user?.name}</span>
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="currentColor"
                                        style={{ transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                                    >
                                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    </svg>
                                </button>

                                {showUserMenu && (
                                    <div className="user-dropdown" style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: '0',
                                        background: 'white',
                                        borderRadius: '8px',
                                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                                        minWidth: '200px',
                                        zIndex: '1000',
                                        marginTop: '8px',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <Link
                                            to="/profile"
                                            onClick={() => setShowUserMenu(false)}
                                            style={{
                                                display: 'block',
                                                padding: '12px 16px',
                                                textDecoration: 'none',
                                                color: '#4a5568',
                                                borderBottom: '1px solid #e2e8f0'
                                            }}
                                        >
                                            Mans profils
                                        </Link>
                                        <Link
                                            to="/my-ads"
                                            onClick={() => setShowUserMenu(false)}
                                            style={{
                                                display: 'block',
                                                padding: '12px 16px',
                                                textDecoration: 'none',
                                                color: '#4a5568',
                                                borderBottom: '1px solid #e2e8f0'
                                            }}
                                        >
                                            Mani sludinājumi
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                background: 'none',
                                                border: 'none',
                                                textAlign: 'left',
                                                color: '#e53e3e',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Iziet
                                        </button>
                                    </div>
                                )}
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login">Pieteikties</Link>
                            </li>
                            <li>
                                <Link to="/register" className="btn btn-primary">
                                    Reģistrēties
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;