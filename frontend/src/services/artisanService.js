import api from './api';

// --- NEW PAYOUT/FINANCIAL FUNCTIONS ---

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

// **NEW:** Get the logged-in artisan's payout information
export const getMyPayoutInfo = async () => {
    try {
        const response = await api.get('/artisans/my-payout-info');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching payout info:', error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

// **NEW:** Update the logged-in artisan's payout information
export const updateMyPayoutInfo = async (payoutData) => {
    try {
        const response = await api.put('/artisans/my-payout-info', payoutData);
        return response.data;
    } catch (error) {
        console.error('Error updating payout info:', error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

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

// --- NEW: Admin functions for artisan management ---

/**
 * Fetches all artisans, filterable by status. (Admin only)
 * @param {string} status - The status to filter by (e.g., 'pending', 'approved').
 * @returns {Promise<Array>} A list of artisan users.
 */
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

/**
 * Updates the status of a specific artisan. (Admin only)
 * @param {string} artisanId - The ID of the artisan to update.
 * @param {string} status - The new status ('approved', 'rejected', 'suspended').
 * @returns {Promise<object>} The result of the update operation.
 */
export const updateArtisanStatus = async (artisanId, status) => {
    try {
        const response = await api.patch(`/artisans/admin/status/${artisanId}`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error updating status for artisan ${artisanId}:`, error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};
