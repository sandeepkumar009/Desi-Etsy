import api from './api';

export const getArtisanProfile = async (artisanId) => {
    try {
        const response = await api.get(`/artisans/profile/${artisanId}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching profile for artisan ${artisanId}:`, error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const updateMyArtisanProfile = async (profileData) => {
    try {
        const response = await api.put('/artisans/my-profile', profileData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    } catch (error) {
        console.error('Error updating artisan profile:', error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const getMyPayoutSummary = async () => {
    try {
        const response = await api.get('/artisans/my-payout-summary');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching payout summary:', error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const getMyPayoutHistory = async () => {
    try {
        const response = await api.get('/artisans/my-payout-history');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching payout history:', error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const getMyPayoutInfo = async () => {
    try {
        const response = await api.get('/artisans/my-payout-info');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching payout info:', error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const updateMyPayoutInfo = async (payoutData) => {
    try {
        const response = await api.put('/artisans/my-payout-info', payoutData);
        return response.data;
    } catch (error) {
        console.error('Error updating payout info:', error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

// Admin functions for artisan management
export const getAllArtisansByStatus = async (status) => {
    try {
        const response = await api.get('/artisans/admin/all', {
            params: { status }
        });
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching artisans with status ${status}:`, error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const updateArtisanStatus = async (artisanId, status) => {
    try {
        const response = await api.patch(`/artisans/admin/status/${artisanId}`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error updating status for artisan ${artisanId}:`, error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};
