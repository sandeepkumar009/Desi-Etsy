import api from './api';

export const getArtisanOrders = async () => {
    try {
        const response = await api.get('/orders/my-orders');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching artisan orders:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const updateOrderStatus = async (orderId, status, details = {}) => {
    try {
        const payload = { status, details };
        const response = await api.put(`/orders/${orderId}/status`, payload);
        return response.data.data;
    } catch (error) {
        console.error(`Error updating order status for ${orderId}:`, error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};
