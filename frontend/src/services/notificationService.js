/*
* FILE: frontend/src/services/notificationService.js
*
* DESCRIPTION:
* The `markAllNotificationsAsRead` function is updated to accept a 'role'
* parameter. It now sends this role in the request body to the backend,
* allowing the server to identify which specific set of notifications to update.
*/
import api from './api';

/**
 * Fetches all notifications for the currently authenticated user.
 * @returns {Promise<Array>} A promise that resolves to an array of notification objects.
 */
export const getNotifications = async () => {
    try {
        const { data } = await api.get('/notifications');
        return data.data;
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        throw error;
    }
};

/**
 * Marks a single notification as read.
 * @param {string} notificationId - The ID of the notification to mark as read.
 * @returns {Promise<Object>} A promise that resolves to the updated notification object.
 */
export const markNotificationAsRead = async (notificationId) => {
    try {
        const { data } = await api.patch(`/notifications/${notificationId}/read`);
        return data.data;
    } catch (error) {
        console.error("Failed to mark notification as read:", error);
        throw error;
    }
};

/**
 * Marks all unread notifications for a specific role as read.
 * @param {string} role - The role ('customer', 'artisan', 'admin') for which to mark notifications.
 * @returns {Promise<Object>} A promise that resolves to a success message object.
 */
export const markAllNotificationsAsRead = async (role) => {
    try {
        // --- MODIFIED: Sending the role in the request body ---
        const { data } = await api.post('/notifications/read-all', { role });
        return data;
    } catch (error) {
        console.error(`Failed to mark all ${role} notifications as read:`, error);
        throw error;
    }
};
