import api from './api';

// --- PUBLIC PRODUCT FUNCTIONS ---

export const getAllProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductDetails = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};


// --- CATEGORY FUNCTIONS ---

export const getAllCategories = async () => {
    try {
        const response = await api.get('/categories');
        // Assuming the API returns { success: true, data: [...] }
        return response.data.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};


// --- ARTISAN-SPECIFIC PRODUCT FUNCTIONS ---

export const getMyProducts = async () => {
    try {
        const response = await api.get('/products/my-products');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching artisan's products:", error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await api.post('/products/create', productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

export const updateProduct = async (productId, productData) => {
    try {
        const response = await api.put(`/products/${productId}`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    } catch (error) {
        console.error(`Error updating product ${productId}:`, error);
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await api.delete(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting product ${productId}:`, error);
        throw error;
    }
};


// --- REVIEW FUNCTIONS (for reference, no changes needed here) ---

export const getReviewsForProduct = async (productId) => {
    try {
        const response = await api.get(`/reviews/${productId}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching reviews for product ${productId}:`, error);
        return [];
    }
};

export const submitReview = async (productId, reviewData) => {
    try {
        const response = await api.post(`/reviews/${productId}`, reviewData);
        return response.data.data;
    } catch (error) {
        console.error(`Error submitting review for product ${productId}:`, error);
        throw error;
    }
};

export const updateReview = async (reviewId, reviewData) => {
    try {
        const response = await api.put(`/reviews/${reviewId}`, reviewData);
        return response.data.data;
    } catch (error) {
        console.error(`Error updating review ${reviewId}:`, error);
        throw error;
    }
};

export const checkUserPurchase = async (productId) => {
    try {
        const response = await api.get(`/orders/check-purchase/${productId}`);
        return response.data.data.hasPurchased;
    } catch (error) {
        if (error.response?.status !== 401) {
           console.error(`Error checking purchase status for product ${productId}:`, error);
        }
        return false;
    }
};
