// src/components/Navigation.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, Plus, User, LogOut, Menu, X, Bell } from 'lucide-react';

export const Navigation: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setUserMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and main navigation */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-indigo-600">Sludinājumi.lv</span>
                        </Link>

                        {/* Desktop navigation */}
                        <div className="hidden md:ml-8 md:flex md:space-x-8">
                            <Link
                                to="/"
                                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                            >
                                Sākums
                            </Link>
                            <Link
                                to="/categories"
                                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                            >
                                Kategorijas
                            </Link>
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="flex-1 max-w-lg mx-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Meklēt sludinājumus..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Right side buttons */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                {/* Add advertisement button */}
                                <Link
                                    to="/create-ad"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">Pievienot sludinājumu</span>
                                    <span className="sm:hidden">Pievienot</span>
                                </Link>

                                {/* Notifications */}
                                <button className="p-2 text-gray-400 hover:text-gray-500">
                                    <Bell className="h-6 w-6" />
                                </button>

                                {/* User menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                        <span className="ml-2 text-gray-700 hidden md:block">{user?.name}</span>
                                    </button>

                                    {userMenuOpen && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                            <div className="py-1">
                                                <Link
                                                    to="/profile"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    Mans profils
                                                </Link>
                                                <Link
                                                    to="/my-ads"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    Mani sludinājumi
                                                </Link>
                                                <Link
                                                    to="/favorites"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    Favorīti
                                                </Link>
                                                <div className="border-t border-gray-100">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <LogOut className="h-4 w-4 mr-2" />
                                                        Iziet
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                                >
                                    Pieteikties
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Reģistrēties
                                </Link>
                            </>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link
                                to="/"
                                className="text-gray-700 hover:text-indigo-600 block px-3 py-2 text-base font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Sākums
                            </Link>
                            <Link
                                to="/categories"
                                className="text-gray-700 hover:text-indigo-600 block px-3 py-2 text-base font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Kategorijas
                            </Link>
                            {isAuthenticated && (
                                <>
                                    <Link
                                        to="/my-ads"
                                        className="text-gray-700 hover:text-indigo-600 block px-3 py-2 text-base font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Mani sludinājumi
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="text-gray-700 hover:text-indigo-600 block px-3 py-2 text-base font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Mans profils
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};