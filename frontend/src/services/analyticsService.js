import api from './api';

export const getAnalytics = async (timePeriod = '30d') => {
    try {
        const response = await api.get('/analytics', {
            params: { timePeriod }
        });
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching analytics for period ${timePeriod}:`, error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const getAdminSummary = async () => {
    try {
        const response = await api.get('/analytics/summary');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching admin dashboard summary:', error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};
