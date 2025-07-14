import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import Loader from '../components/common/Loader';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };

    // This useEffect handles the initial authentication check on page load
    useEffect(() => {
        const initializeAuth = async () => {
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp < currentTime) {
                        logout();
                    } else {
                        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        const { data } = await api.get('/users/profile');
                        setUser(data.data.user);
                    }
                } catch (error) {
                    console.error("Token validation failed on initial load:", error);
                    logout();
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (newToken) => {
        try {
            localStorage.setItem('token', newToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            const { data } = await api.get('/users/profile');
            setUser(data.data.user);
            setToken(newToken);
        } catch (error) {
            console.error("Login process failed:", error);
            logout(); 
            throw error; // Re-throw error to be caught by the calling component
        }
    };

    const authContextValue = { user, token, loading, login, logout };

    if (loading) {
        return <Loader text="Authenticating..." />;
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
