import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs'; 
import User from '../models/userModel.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// GET /api/users/profile - Returns the profile of the logged-in user (Private)
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        return res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully."));
    } else {
        throw new ApiError(404, "User not found.");
    }
});

// PUT /api/users/profile - Updates the profile of the logged-in user (Private)
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    // Update name if provided
    if (req.body.name) {
        user.name = req.body.name;
    }

    // Update profile picture if a new file is uploaded
    if (req.file) {
        // Delete the old image from Cloudinary unless it's the default one
        if (user.profilePicture && !user.profilePicture.includes('default-avatar')) {
            await deleteFromCloudinary(user.profilePicture);
        }

        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        if (!cloudinaryResponse || !cloudinaryResponse.url) {
            throw new ApiError(500, "Failed to upload profile picture.");
        }
        user.profilePicture = cloudinaryResponse.url;
    }

    const updatedUser = await user.save();

    res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully."));
});


// POST /api/users/profile/addresses - Adds a new address for the logged-in user
export const addUserAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    const { addressLine1, addressLine2, city, state, postalCode, country } = req.body;
    if (!addressLine1 || !city || !state || !postalCode || !country) {
        throw new ApiError(400, "All required address fields must be provided.");
    }

    // If this is the first address, make it the default
    const isDefault = user.addresses.length === 0;

    user.addresses.push({ addressLine1, addressLine2, city, state, postalCode, country, isDefault });
    await user.save();
    res.status(201).json(new ApiResponse(201, user, "Address added successfully."));
});

// PUT /api/users/profile/addresses/:addressId - Updates an existing address
export const updateUserAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { addressId } = req.params;
    const { addressLine1, addressLine2, city, state, postalCode, country } = req.body;

    const address = user.addresses.id(addressId);
    if (!address) throw new ApiError(404, "Address not found.");

    address.addressLine1 = addressLine1 || address.addressLine1;
    address.addressLine2 = addressLine2 || address.addressLine2;
    address.city = city || address.city;
    address.state = state || address.state;
    address.postalCode = postalCode || address.postalCode;
    address.country = country || address.country;

    await user.save();
    res.status(200).json(new ApiResponse(200, user, "Address updated successfully."));
});

// DELETE /api/users/profile/addresses/:addressId - Deletes an address
export const deleteUserAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { addressId } = req.params;

    const address = user.addresses.id(addressId);
    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    user.addresses.pull({ _id: addressId });

    if (address.isDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
    }

    await user.save();
    res.status(200).json(new ApiResponse(200, user, "Address deleted successfully."));
});


// PATCH /api/users/profile/addresses/:addressId/default - Sets an address as default
export const setDefaultAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { addressId } = req.params;

    user.addresses.forEach(addr => {
        addr.isDefault = addr._id.toString() === addressId;
    });

    await user.save();
    res.status(200).json(new ApiResponse(200, user, "Default address updated successfully."));
});

// PUT /api/users/profile/change-password - Changes the user's password (Private)
export const updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Please provide current and new passwords.");
    }
    
    // 1. Find the user and include their password for comparison
    const user = await User.findById(req.user._id).select('+password');

    // 2. Check if the provided current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Incorrect current password.");
    }

    // 3. Set the new password. The 'pre-save' hook in userModel will hash it.
    user.password = newPassword;
    await user.save();

    res.status(200).json(new ApiResponse(200, {}, "Password updated successfully."));
});

// GET /api/users/profile/wishlist - Get the user's populated wishlist
export const getWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: 'wishlist',
        model: 'Product',
        populate: {
            path: 'category',
            model: 'Category',
            select: 'name'
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found.");
    }
    
    res.status(200).json(new ApiResponse(200, user.wishlist, "Wishlist fetched successfully."));
});

// POST /api/users/profile/wishlist/:productId - Add a product to the wishlist
export const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishlist: productId } }, // $addToSet prevents duplicates
        { new: true }
    ).select('-password');
    
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    res.status(200).json(new ApiResponse(200, user, "Product added to wishlist."));
});

// DELETE /api/users/profile/wishlist/:productId - Remove a product from the wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishlist: productId } },
        { new: true }
    ).select('-password');
    
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    res.status(200).json(new ApiResponse(200, user, "Product removed from wishlist."));
});