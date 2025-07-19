import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createReview = async (req, res, next) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    try {
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

        res.status(201).json(new ApiResponse(201, newReview, 'Review submitted successfully.'));
    } catch (error) {
        next(error);
    }
};

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

        // Check if the user is the owner of the review
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
