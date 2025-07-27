import api from './api';

// PUBLIC PRODUCT FUNCTIONS
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


// CATEGORY FUNCTIONS
export const getAllCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};


// ARTISAN-SPECIFIC PRODUCT FUNCTIONS
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


// REVIEW FUNCTIONS
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

export const getUserReviewForProduct = async (productId) => {
    try {
        const response = await api.get(`/reviews/user-review/${productId}`);
        return response.data.data;
    } catch (error) {
        if (error.response?.status !== 404) {
            console.error(`Error checking for existing review for product ${productId}:`, error);
        }
        return null;
    }
};

// Admin Product Management Functions
export const getProductsForAdmin = async (status) => {
    try {
        const response = await api.get('/products/admin/all', {
            params: { status }
        });
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching products for admin with status ${status}:`, error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const updateProductStatusByAdmin = async (productId, status) => {
    try {
        const response = await api.patch(`/products/admin/status/${productId}`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error updating status for product ${productId}:`, error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

// Admin Category Management Functions
export const createCategory = async (categoryData) => {
    try {
        const response = await api.post('/categories', categoryData);
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await api.put(`/categories/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        console.error(`Error updating category ${categoryId}:`, error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const deleteCategory = async (categoryId) => {
    console.log(`Deleting category with ID: ${categoryId}`);
    try {
        const response = await api.delete(`/categories/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting category ${categoryId}:`, error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};
