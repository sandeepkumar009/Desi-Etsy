/*
* FILE: backend/controllers/authController.js
*
* DESCRIPTION:
* This file is updated to add a notification trigger upon new user registration.
* - Imports the 'createNotification' utility.
* - In 'registerCustomer', after a user is successfully created, it calls
* 'createNotification' to send a welcome message to the new user.
*/
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import generateToken from '../utils/generateToken.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { createNotification } from '../utils/notificationUtils.js'; // <-- ADDED

// POST /api/auth/register - Register a new customer using email and password (Public)
export const registerCustomer = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, 'Please provide name, email, and password.');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(409, 'User with this email already exists.');
    }

    let profilePictureUrl = 'https://res.cloudinary.com/diuhkgpnm/image/upload/v1752398214/default-avatar_adllv2.png'; // Default profile picture URL
    if (req.file) {
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        if (cloudinaryResponse && cloudinaryResponse.url) {
            profilePictureUrl = cloudinaryResponse.url;
        }
    }

    const user = await User.create({
        name,
        email,
        password,
        profilePicture: profilePictureUrl,
        role: 'customer',
        authProviders: ['email'],
    });

    const createdUser = await User.findById(user._id).select('-password');
    const token = generateToken(createdUser._id, createdUser.role);

    // --- ADDED: Welcome Notification Trigger ---
    if (createdUser) {
        await createNotification(
            createdUser._id,
            "Welcome to Desi Etsy! We're excited to have you.",
            "/dashboard/profile",
            "customer"
        );
    }
    // -----------------------------------------

    return res.status(201).json(
        new ApiResponse(201, { user: createdUser, token }, "Customer registered successfully.")
    );
});

// POST /api/auth/login - Log in user and return JWT token (Public)
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'Please provide email and password.');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
        throw new ApiError(401, 'Invalid email or password.');
    }

    const token = generateToken(user._id, user.role);
    const loggedInUser = await User.findById(user._id).select('-password');

    return res.status(200).json(
        new ApiResponse(200, { user: loggedInUser, token }, "Login successful.")
    );
});

// GET /api/auth/google/callback - Handle Google OAuth callback and issue JWT (Public)
export const googleAuthCallback = asyncHandler(async (req, res) => {
    const user = req.user;
    const token = generateToken(user._id, user.role);

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
});

// POST /api/auth/logout - Log out the currently authenticated user (Private)
export const logoutUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, {}, "Logged out successfully."));
});
