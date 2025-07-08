import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import './App.css';
import {Login} from "./pages/auth/Login.tsx";
import {Register} from "./pages/auth/Register.tsx";
import {CreateAd} from "./pages/advert/CreateAd.tsx";
import {Profile} from "./pages/profile/Profile.tsx";
import {MyAds} from "./pages/advert/MyAds.tsx";

const Categories: React.FC = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900">Kategorijas</h1>
        <p className="mt-4 text-gray-600">Šī lapa ir izstrādes procesā.</p>
    </div>
);

const AuthRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated ? <Navigate to="/" replace /> : <Login />
                }
            />
            <Route
                path="/register"
                element={
                    isAuthenticated ? <Navigate to="/" replace /> : <Register />
                }
            />
        </Routes>
    );
};

const AppContent: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Public routes without layout */}
                <Route path="/login" element={<AuthRoutes />} />
                <Route path="/register" element={<AuthRoutes />} />

                {/* Routes with layout */}
                <Route path="/" element={
                    <Layout>
                        <Routes>
                            <Route index element={<Home />} />
                            <Route path="categories" element={<Categories />} />

                            {/* Protected routes */}
                            <Route path="profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                            <Route path="my-ads" element={
                                <ProtectedRoute>
                                    <MyAds />
                                </ProtectedRoute>
                            } />
                            <Route path="create-ad" element={
                                <ProtectedRoute>
                                    <CreateAd />
                                </ProtectedRoute>
                            } />

                            {/* Catch all route */}
                            <Route path="*" element={
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                                    <p className="text-gray-600">Lapa nav atrasta</p>
                                </div>
                            } />
                        </Routes>
                    </Layout>
                } />
            </Routes>
        </Router>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;