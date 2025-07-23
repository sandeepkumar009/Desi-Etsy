/*
* FILE: frontend/src/context/AuthContext.jsx
*
* DESCRIPTION:
* This file is updated to wrap the application with the NotificationProvider.
* By placing NotificationProvider inside AuthProvider, we ensure that the
* notification system has access to the authenticated user's data and is
* only active when a user is logged in.
*/
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import Loader from '../components/common/Loader';
import * as userService from '../services/userService';
import { toast } from 'react-toastify'; 
import { NotificationProvider } from './NotificationContext'; // <-- ADDED

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    }, []);

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
                        setUser(data.data);
                    }
                } catch (error) {
                    console.error("Token validation failed on initial load:", error);
                    logout();
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, [token, logout]);

    const login = async (newToken) => {
        localStorage.setItem('token', newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        const { data } = await api.get('/users/profile');
        setUser(data.data);
        setToken(newToken);
    };

    const updateUser = (newUserData) => {
        setUser(currentUser => ({
            ...currentUser,
            ...newUserData,
            artisanProfile: {
                ...currentUser?.artisanProfile,
                ...newUserData.artisanProfile,
            },
        }));
    };

    const toggleWishlist = async (productId) => {
        if (!user) {
            toast.error("Please log in to manage your wishlist.");
            return;
        }
        const isWishlisted = user.wishlist.includes(productId);
        try {
            const updatedUser = isWishlisted
                ? await userService.removeFromWishlist(productId)
                : await userService.addToWishlist(productId);
            updateUser(updatedUser); 
            toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
        } catch (error) {
            toast.error("Could not update wishlist. Please try again.");
        }
    };

    const authContextValue = { user, token, loading, login, logout, updateUser, toggleWishlist };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader text="Authenticating..." /></div>;
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            {/* --- MODIFIED: Wrap children with NotificationProvider --- */}
            <NotificationProvider>
                {children}
            </NotificationProvider>
        </AuthContext.Provider>
    );
};
