// frontend/src/services/payoutService.js
// This new service handles all API calls related to payouts for the admin.

import api from './api';

/**
 * Fetches the summary of pending payouts for all artisans. (Admin only)
 * @returns {Promise<Array>} A list of artisans with pending payments.
 */
export const getPayoutSummary = async () => {
    try {
        const response = await api.get('/payouts/summary');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching payout summary:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

/**
 * Records a payout transaction in the system. (Admin only)
 * @param {object} payoutData - The details of the payout.
 * @returns {Promise<object>} The newly created payout record.
 */
export const recordPayout = async (payoutData) => {
    try {
        const response = await api.post('/payouts/record', payoutData);
        return response.data;
    } catch (error) {
        console.error("Error recording payout:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};
