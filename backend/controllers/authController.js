import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import generateToken from '../utils/generateToken.js';

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

    const user = await User.create({
        name,
        email,
        password,
        role: 'customer',
        authProviders: ['email'],
    });

    const createdUser = await User.findById(user._id).select('-password');
    const token = generateToken(createdUser._id, createdUser.role);

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

// POST /api/auth/logout - Log out the currently authenticated user (Private)
export const logoutUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, {}, "Logged out successfully."));
});
