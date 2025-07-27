import api from './api';

export const updateUserProfile = async (formData) => {
    try {
        const response = await api.put('/users/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const addUserAddress = async (addressData) => {
    try {
        const response = await api.post('/users/profile/addresses', addressData);
        return response.data.data;
    } catch (error) {
        console.error("Error adding address:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const updateUserAddress = async (addressId, addressData) => {
    try {
        const response = await api.put(`/users/profile/addresses/${addressId}`, addressData);
        return response.data.data;
    } catch (error) {
        console.error("Error updating address:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const deleteUserAddress = async (addressId) => {
    try {
        const response = await api.delete(`/users/profile/addresses/${addressId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error deleting address:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const setDefaultUserAddress = async (addressId) => {
    try {
        const response = await api.patch(`/users/profile/addresses/${addressId}/default`);
        return response.data.data;
    } catch (error) {
        console.error("Error setting default address:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const changePassword = async (passwordData) => {
    try {
        const response = await api.put('/users/profile/change-password', passwordData);
        return response.data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

// WISHLIST FUNCTIONS
export const getWishlist = async () => {
    try {
        const response = await api.get('/users/profile/wishlist');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const addToWishlist = async (productId) => {
    try {
        const response = await api.post(`/users/profile/wishlist/${productId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const removeFromWishlist = async (productId) => {
    try {
        const response = await api.delete(`/users/profile/wishlist/${productId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};