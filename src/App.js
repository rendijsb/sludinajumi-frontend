import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CreateAdPage from './pages/ads/CreateAdPage';
import AdDetailPage from './pages/ads/AdDetailPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/ad/:id" element={<AdDetailPage />} />
                <Route
                    path="/create-ad"
                    element={
                      <ProtectedRoute>
                        <CreateAdPage />
                      </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;