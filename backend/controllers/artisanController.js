import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// POST /api/artisans/apply - Authenticated users submit artisan applications
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

// GET /api/artisans/profile/:artisanId - Public route to get an artisan's shop profile
export const getArtisanPublicProfile = asyncHandler(async (req, res) => {
    const { artisanId } = req.params;

    const artisan = await User.findById(artisanId).select(
        'name profilePicture role artisanProfile.brandName artisanProfile.story artisanProfile.bannerImage'
    );

    if (!artisan || artisan.role !== 'artisan') {
        throw new ApiError(404, 'Artisan not found.');
    }

    res.status(200).json(new ApiResponse(200, artisan, 'Artisan profile fetched successfully.'));
});


export const updateArtisanProfile = asyncHandler(async (req, res) => {
    const artisan = await User.findById(req.user._id);

    if (!artisan) {
        throw new ApiError(404, 'Artisan not found.');
    }

    // Update text fields if they exist in the request
    if (req.body.brandName) {
        artisan.artisanProfile.brandName = req.body.brandName;
    }
    if (req.body.story) {
        artisan.artisanProfile.story = req.body.story;
    }

    // Handle image uploads
    if (req.files) {
        // If a new profile picture is uploaded
        if (req.files.profileImage) {
            if (artisan.profilePicture) {
                // Avoid deleting the default placeholder image
                if (!artisan.profilePicture.includes('pravatar')) {
                   await deleteFromCloudinary(artisan.profilePicture);
                }
            }
            const profileUpload = await uploadOnCloudinary(req.files.profileImage[0].path);
            if (!profileUpload.url) throw new ApiError(400, 'Profile image upload failed');
            artisan.profilePicture = profileUpload.url;
        }

        // If a new banner image is uploaded
        if (req.files.bannerImage) {
            if (artisan.artisanProfile.bannerImage) {
                 // Avoid deleting the default placeholder image
                if (!artisan.artisanProfile.bannerImage.includes('placehold.co')) {
                   await deleteFromCloudinary(artisan.artisanProfile.bannerImage);
                }
            }
            const bannerUpload = await uploadOnCloudinary(req.files.bannerImage[0].path);
            if (!bannerUpload.url) throw new ApiError(400, 'Banner image upload failed');
            artisan.artisanProfile.bannerImage = bannerUpload.url;
        }
    }

    const updatedArtisan = await artisan.save();
    
    // Return the updated user object without the password
    const userToReturn = await User.findById(updatedArtisan._id).select('-password');

    res.status(200).json(new ApiResponse(200, userToReturn, 'Profile updated successfully.'));
});
