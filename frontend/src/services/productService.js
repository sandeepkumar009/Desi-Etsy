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

export const getUserReviewForProduct = async (productId) => {
    try {
        const response = await api.get(`/reviews/user-review/${productId}`);
        return response.data.data; // This will be the review object or null
    } catch (error) {
        // It's normal for this to fail if no review exists, so we don't need to show an error
        if (error.response?.status !== 404) {
            console.error(`Error checking for existing review for product ${productId}:`, error);
        }
        return null; // Return null if not found or on error
    }
};

// --- NEW: Admin Product Management Functions ---

/**
 * Fetches all products for an admin, filterable by status.
 * @param {string} status - The status to filter by (e.g., 'pending_approval', 'active').
 * @returns {Promise<Array>} A list of products.
 */
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

/**
 * Updates the status of a specific product by an admin.
 * @param {string} productId - The ID of the product to update.
 * @param {string} status - The new status ('active', 'rejected').
 * @returns {Promise<object>} The result of the update operation.
 */
export const updateProductStatusByAdmin = async (productId, status) => {
    try {
        const response = await api.patch(`/products/admin/status/${productId}`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error updating status for product ${productId}:`, error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

// --- NEW: Admin Category Management Functions ---

/**
 * Creates a new category. (Admin only)
 * @param {object} categoryData - The data for the new category (e.g., { name, description }).
 * @returns {Promise<object>} The newly created category.
 */
export const createCategory = async (categoryData) => {
    try {
        const response = await api.post('/categories', categoryData);
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

/**
 * Updates an existing category. (Admin only)
 * @param {string} categoryId - The ID of the category to update.
 * @param {object} categoryData - The updated data for the category.
 * @returns {Promise<object>} The updated category.
 */
export const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await api.put(`/categories/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        console.error(`Error updating category ${categoryId}:`, error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

/**
 * Deletes a category. (Admin only)
 * @param {string} categoryId - The ID of the category to delete.
 * @returns {Promise<object>} The result of the delete operation.
 */
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
