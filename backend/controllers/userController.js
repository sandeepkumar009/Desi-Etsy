import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// GET /api/users/profile - Returns the profile of the logged-in user (Private)
const getUserProfile = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user) {
        return res.status(200).json(new ApiResponse(200, { user }, "User profile fetched successfully."));
    } else {
        throw new ApiError(404, "User not found.");
    }
});

export { getUserProfile };
