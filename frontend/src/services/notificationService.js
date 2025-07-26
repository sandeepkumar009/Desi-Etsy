import api from './api';

export const getNotifications = async () => {
    try {
        const { data } = await api.get('/notifications');
        return data.data;
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        throw error;
    }
};

export const markNotificationAsRead = async (notificationId) => {
    try {
        const { data } = await api.patch(`/notifications/${notificationId}/read`);
        return data.data;
    } catch (error) {
        console.error("Failed to mark notification as read:", error);
        throw error;
    }
};

export const markAllNotificationsAsRead = async (role) => {
    try {
        const { data } = await api.post('/notifications/read-all', { role });
        return data;
    } catch (error) {
        console.error(`Failed to mark all ${role} notifications as read:`, error);
        throw error;
    }
};
