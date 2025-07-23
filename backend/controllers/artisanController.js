/*
* FILE: backend/controllers/artisanController.js
*
* DESCRIPTION:
* This file is updated to add notification triggers for the artisan lifecycle.
* - Imports the 'createNotification' utility.
* - In 'applyForArtisan', it notifies all admins when a new application is submitted.
* - In 'updateArtisanStatus', it notifies the specific user when their application
* status is changed by an admin.
*/
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import Payout from '../models/payoutModel.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { createNotification } from '../utils/notificationUtils.js'; // <-- ADDED

const PLATFORM_COMMISSION_RATE = 0.15; // 15% commission

// --- NEW PAYOUT FUNCTIONS FOR ARTISANS ---
// ... (getMyPayoutSummary, getMyPayoutHistory, getMyPayoutInfo, updateMyPayoutInfo remain unchanged)
export const getMyPayoutSummary = asyncHandler(async (req, res) => {
    const artisanId = req.user._id;
    const unpaidOrders = await Order.find({
        'items.artisanId': artisanId,
        status: 'delivered',
        payoutStatus: 'pending'
    });
    let pendingSales = 0;
    for (const order of unpaidOrders) {
        for (const item of order.items) {
            if (item.artisanId.toString() === artisanId.toString()) {
                pendingSales += item.price * item.quantity;
            }
        }
    }
    const pendingCommission = pendingSales * PLATFORM_COMMISSION_RATE;
    const netPendingPayout = pendingSales - pendingCommission;
    const pastPayouts = await Payout.find({ artisanId: artisanId, status: 'completed' });
    const lifetimeEarnings = pastPayouts.reduce((acc, payout) => acc + payout.amount, 0);
    const summary = {
        pendingSales,
        pendingCommission,
        netPendingPayout,
        lifetimeEarnings,
        payoutsCount: pastPayouts.length
    };
    res.status(200).json(new ApiResponse(200, summary, "Artisan payout summary fetched successfully."));
});
export const getMyPayoutHistory = asyncHandler(async (req, res) => {
    const artisanId = req.user._id;
    const history = await Payout.find({ artisanId: artisanId, status: 'completed' }).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, history, "Payout history fetched successfully."));
});
export const getMyPayoutInfo = asyncHandler(async (req, res) => {
    const artisan = await User.findById(req.user._id).select('artisanProfile.payoutInfo');
    if (!artisan || !artisan.artisanProfile) {
        throw new ApiError(404, "Artisan profile not found.");
    }
    res.status(200).json(new ApiResponse(200, artisan.artisanProfile.payoutInfo, "Payout info fetched."));
});
export const updateMyPayoutInfo = asyncHandler(async (req, res) => {
    const { accountHolderName, accountNumber, ifscCode, bankName } = req.body;
    if (!accountHolderName || !accountNumber || !ifscCode || !bankName) {
        throw new ApiError(400, "All payout fields are required.");
    }
    const artisan = await User.findById(req.user._id);
    if (!artisan || !artisan.artisanProfile) {
        throw new ApiError(404, "Artisan profile not found.");
    }
    artisan.artisanProfile.payoutInfo = { accountHolderName, accountNumber, ifscCode, bankName };
    await artisan.save();
    res.status(200).json(new ApiResponse(200, artisan.artisanProfile.payoutInfo, "Payout information updated successfully."));
});
// ---

// POST /api/artisans/apply - Authenticated users submit artisan applications
export const applyForArtisan = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { brandName, story } = req.body;

    if (!brandName || !story) {
        throw new ApiError(400, 'Please provide a brand name and your story.');
    }

    const user = await User.findById(userId);

    if (!user) throw new ApiError(404, 'User not found.');
    if (user.role === 'artisan' || user.role === 'admin') {
        throw new ApiError(400, 'You are already an artisan or admin.');
    }

    let bannerImageUrl = 'https://res.cloudinary.com/diuhkgpnm/image/upload/v1752398215/default-banner_mwsqhb.png';
    if (req.file) {
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        if (cloudinaryResponse && cloudinaryResponse.url) {
            bannerImageUrl = cloudinaryResponse.url;
        }
    }

    user.role = 'artisan';
    user.artisanProfile = {
        brandName,
        story,
        bannerImage: bannerImageUrl,
        status: 'pending',
    };

    const updatedUser = await user.save();
    const userToReturn = await User.findById(updatedUser._id).select('-password');

    // --- ADDED: Notify Admins Trigger ---
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
        await createNotification(
            admin._id,
            `New artisan application from ${user.name} requires review.`,
            `/admin/artisan-verification`,
            'admin'
        );
    }
    // ------------------------------------

    return res.status(200).json(
        new ApiResponse(200, { user: userToReturn }, "Application to become an artisan submitted successfully. Please wait for admin approval.")
    );
});

// ... (getArtisanPublicProfile, updateArtisanProfile, getAllArtisans remain unchanged)
export const getArtisanPublicProfile = asyncHandler(async (req, res) => {
    const { artisanId } = req.params;
    const artisan = await User.findById(artisanId).select('name profilePicture role artisanProfile.brandName artisanProfile.story artisanProfile.bannerImage');
    if (!artisan || artisan.role !== 'artisan') {
        throw new ApiError(404, 'Artisan not found.');
    }
    res.status(200).json(new ApiResponse(200, artisan, 'Artisan profile fetched successfully.'));
});
export const updateArtisanProfile = asyncHandler(async (req, res) => {
    const artisan = await User.findById(req.user._id);
    if (!artisan) throw new ApiError(404, 'Artisan not found.');
    if (req.body.brandName) artisan.artisanProfile.brandName = req.body.brandName;
    if (req.body.story) artisan.artisanProfile.story = req.body.story;
    if (req.files) {
        if (req.files.profileImage) {
            if (artisan.profilePicture && !artisan.profilePicture.includes('pravatar')) {
               await deleteFromCloudinary(artisan.profilePicture);
            }
            const profileUpload = await uploadOnCloudinary(req.files.profileImage[0].path);
            if (!profileUpload.url) throw new ApiError(400, 'Profile image upload failed');
            artisan.profilePicture = profileUpload.url;
        }
        if (req.files.bannerImage) {
            if (artisan.artisanProfile.bannerImage && !artisan.artisanProfile.bannerImage.includes('placehold.co')) {
               await deleteFromCloudinary(artisan.artisanProfile.bannerImage);
            }
            const bannerUpload = await uploadOnCloudinary(req.files.bannerImage[0].path);
            if (!bannerUpload.url) throw new ApiError(400, 'Banner image upload failed');
            artisan.artisanProfile.bannerImage = bannerUpload.url;
        }
    }
    const updatedArtisan = await artisan.save();
    const userToReturn = await User.findById(updatedArtisan._id).select('-password');
    res.status(200).json(new ApiResponse(200, userToReturn, 'Profile updated successfully.'));
});
export const getAllArtisans = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const query = { role: 'artisan' };
    if (status && status !== 'all') {
        query['artisanProfile.status'] = status;
    }
    const artisans = await User.find(query)
        .select('name email profilePicture artisanProfile createdAt')
        .sort({ createdAt: -1 });
    if (!artisans) throw new ApiError(404, 'No artisans found.');
    res.status(200).json(new ApiResponse(200, artisans, 'Artisans fetched successfully.'));
});
// ---

/**
 * @desc    Update an artisan's status (approve, reject, suspend)
 * @route   PATCH /api/artisans/admin/status/:artisanId
 * @access  Private/Admin
 */
export const updateArtisanStatus = asyncHandler(async (req, res) => {
    const { artisanId } = req.params;
    const { status } = req.body;

    if (!status || !['approved', 'rejected', 'suspended'].includes(status)) {
        throw new ApiError(400, 'Invalid status provided.');
    }

    const artisan = await User.findById(artisanId);

    if (!artisan || artisan.role !== 'artisan') {
        throw new ApiError(404, 'Artisan not found.');
    }

    artisan.artisanProfile.status = status;
    await artisan.save({ validateBeforeSave: false });

    // --- ADDED: Notify User Trigger ---
    const statusMessage = status.charAt(0).toUpperCase() + status.slice(1); // Capitalize status
    await createNotification(
        artisan._id,
        `Your artisan application has been ${statusMessage}.`,
        'seller/dashboard', // A generic link for the user
        'customer' // Their role might still be customer if rejected
    );
    // ----------------------------------

    res.status(200).json(new ApiResponse(200, { artisanId, newStatus: status }, `Artisan has been ${status}.`));
});
