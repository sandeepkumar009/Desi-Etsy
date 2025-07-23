// frontend/src/services/orderService.js
// Adding the new functions to call our checkout endpoints.

import api from './api';

// --- NEW CHECKOUT FUNCTIONS ---
export const createOrder = async (orderData) => {
    try {
        const response = await api.post('/orders/create', orderData);
        return response.data; // Includes success flag, data, and message
    } catch (error) {
        console.error("Error creating order:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

// **NEW**
export const createDirectOrder = async (orderData) => {
    try {
        const response = await api.post('/orders/buy-now', orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating direct order:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const verifyPayment = async (paymentData) => {
    try {
        const response = await api.post('/orders/verify-payment', paymentData);
        return response.data;
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};


// --- EXISTING FUNCTIONS ---
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

export const getCustomerOrders = async () => {
    try {
        const response = await api.get('/orders/customer/my-orders');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching customer orders:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const getCustomerOrderDetail = async (orderId) => {
    try {
        const response = await api.get(`/orders/customer/my-orders/${orderId}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching order detail for ${orderId}:`, error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};
