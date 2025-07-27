import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import * as notificationService from '../services/notificationService';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    
    useEffect(() => {
        if (user && token) {
            const newSocket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', {
                auth: { token }
            });
            setSocket(newSocket);
            newSocket.emit('add_user', user._id);

            const fetchInitialNotifications = async () => {
                try {
                    const initialNotifications = await notificationService.getNotifications();
                    setNotifications(initialNotifications);
                } catch (error) {
                    console.error("Could not fetch initial notifications", error);
                }
            };
            fetchInitialNotifications();

            return () => newSocket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user, token]);

    useEffect(() => {
        if (!socket) return;

        socket.on('new_notification', (newNotification) => {
            setNotifications(prev => [newNotification, ...prev]);
            toast.info(`🔔 ${newNotification.message}`);
        });

        return () => {
            socket.off('new_notification');
        };
    }, [socket]);

    const markAsRead = useCallback(async (id) => {
        try {
            await notificationService.markNotificationAsRead(id);
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            toast.error("Failed to mark as read.");
        }
    }, []);
    
    const markAllAsRead = useCallback(async (role) => {
        const unreadIds = notifications.filter(n => n.role === role && !n.isRead).map(n => n._id);
        if (unreadIds.length === 0) return;

        try {
            await notificationService.markAllNotificationsAsRead(role);
            setNotifications(prev =>
                prev.map(n => (n.role === role ? { ...n, isRead: true } : n))
            );
        } catch (error) {
            toast.error(`Failed to mark all ${role} notifications as read.`);
        }
    }, [notifications]);

    const customerNotifications = useMemo(() => notifications.filter(n => n.role === 'customer'), [notifications]);
    const artisanNotifications = useMemo(() => notifications.filter(n => n.role === 'artisan'), [notifications]);
    const adminNotifications = useMemo(() => notifications.filter(n => n.role === 'admin'), [notifications]);

    const customerUnreadCount = useMemo(() => customerNotifications.filter(n => !n.isRead).length, [customerNotifications]);
    const artisanUnreadCount = useMemo(() => artisanNotifications.filter(n => !n.isRead).length, [artisanNotifications]);
    const adminUnreadCount = useMemo(() => adminNotifications.filter(n => !n.isRead).length, [adminNotifications]);

    const value = {
        notifications,
        customerNotifications,
        artisanNotifications,
        adminNotifications,
        customerUnreadCount,
        artisanUnreadCount,
        adminUnreadCount,
        markAsRead,
        markAllAsRead,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
