/*
* FILE: backend/controllers/reviewController.js
*
* DESCRIPTION:
* This file is updated to add a notification trigger when a new review is created.
* - Imports the 'createNotification' utility.
* - In 'createReview', after a review is successfully submitted, it finds the
* product's artisan and sends them a notification about the new review.
*/
import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { createNotification } from '../utils/notificationUtils.js'; // <-- ADDED

export const createReview = async (req, res, next) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    try {
        const purchaseOrder = await Order.findOne({ 
            userId, 
            'items.productId': productId,
            status: 'delivered' 
        });

        if (!purchaseOrder) {
            throw new ApiError(403, "You can only review products you have purchased and received.");
        }

        const product = await Product.findById(productId);
        if (!product || product.status !== 'active') {
            throw new ApiError(404, 'Product not found or is not active.');
        }

        const existingReview = await Review.findOne({ productId, userId });
        if (existingReview) {
            throw new ApiError(400, 'You have already reviewed this product. Please edit your existing review.');
        }

        const newReview = new Review({ productId, userId, rating, comment });
        await newReview.save();

        // --- ADDED: Notify Artisan Trigger ---
        if (product.artisanId) {
            await createNotification(
                product.artisanId,
                `You received a ${rating}-star review on '${product.name}'.`,
                // `/seller/products/${product._id}`, // Link to the product page
                `/seller/products`,
                'artisan'
            );
        }
        // ------------------------------------

        res.status(201).json(new ApiResponse(201, newReview, 'Review submitted successfully.'));
    } catch (error) {
        next(error);
    }
};

// ... (getProductReviews, updateReview, getUserReviewForProduct remain unchanged)
export const getProductReviews = async (req, res, next) => {
    const { productId } = req.params;
    try {
        const reviews = await Review.find({ productId })
            .populate('userId', 'name profilePicture')
            .sort({ createdAt: -1 });
        if (!reviews) {
            return res.status(200).json(new ApiResponse(200, [], 'No reviews found for this product.'));
        }
        res.status(200).json(new ApiResponse(200, reviews, 'Reviews fetched successfully.'));
    } catch (error) {
        next(error);
    }
};
export const updateReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;
    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            throw new ApiError(404, 'Review not found.');
        }
        if (review.userId.toString() !== userId.toString()) {
            throw new ApiError(403, 'You are not authorized to update this review.');
        }
        review.rating = rating;
        review.comment = comment;
        await review.save();
        res.status(200).json(new ApiResponse(200, review, 'Review updated successfully.'));
    } catch (error) {
        next(error);
    }
};
export const getUserReviewForProduct = async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.user._id;
    try {
        const review = await Review.findOne({ productId, userId });
        res.status(200).json(new ApiResponse(200, review, 'User review fetched successfully.'));
    } catch (error) {
        next(error);
    }
};
