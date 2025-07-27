import api from './api';

export const getPayoutSummary = async () => {
    try {
        const response = await api.get('/payouts/summary');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching payout summary:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const recordPayout = async (payoutData) => {
    try {
        const response = await api.post('/payouts/record', payoutData);
        return response.data;
    } catch (error) {
        console.error("Error recording payout:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};
