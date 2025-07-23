import api from './api';

export const getCart = async () => {
    const { data } = await api.get('/cart');
    return data.data;
};

export const addToCart = async (productId, quantity) => {
    const { data } = await api.post('/cart', { productId, quantity });
    return data.data;
};

export const updateCartItemQuantity = async (productId, quantity) => {
    const { data } = await api.put(`/cart/${productId}`, { quantity });
    return data.data;
};

export const removeFromCart = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    return data.data;
};

export const mergeCarts = async (localCart) => {
    const { data } = await api.post('/cart/merge', { localCart });
    return data.data;
};