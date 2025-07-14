import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// POST /api/artisans/apply - Authenticated users submit artisan applications (requires admin approval)
export const applyForArtisan = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { brandName, story } = req.body;

    if (!brandName || !story) {
        throw new ApiError(400, 'Please provide a brand name and your story.');
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, 'User not found.');
    }

    if (user.role === 'artisan' || user.role === 'admin') {
        throw new ApiError(400, 'You are already an artisan or admin.');
    }

    let bannerImageUrl = 'https://res.cloudinary.com/diuhkgpnm/image/upload/v1752398215/default-banner_mwsqhb.png'; // Default banner image URL
    if (req.file) {
        const bannerImageLocalPath = req.file.path;
        const cloudinaryResponse = await uploadOnCloudinary(bannerImageLocalPath);
        if (cloudinaryResponse && cloudinaryResponse.url) {
            bannerImageUrl = cloudinaryResponse.url;
        }
    }

    user.role = 'artisan';
    user.artisanProfile = {
        brandName,
        story,
        bannerImage: bannerImageUrl,
        status: 'pending', // Await admin approval
    };

    const updatedUser = await user.save();
    const userToReturn = await User.findById(updatedUser._id).select('-password');

    return res.status(200).json(
        new ApiResponse(200, { user: userToReturn }, "Application to become an artisan submitted successfully. Please wait for admin approval.")
    );
});
