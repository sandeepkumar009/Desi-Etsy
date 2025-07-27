import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/userModel.js';

// Middleware: Verifies JWT and attaches user to request (Protects private routes)
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            
            if (!req.user) {
                return next(new ApiError(401, 'The user belonging to this token no longer exists.'));
            }

            next();
        } catch (error) {
            return next(new ApiError(401, 'Not authorized, token failed.'));
        }
    }

    if (!token) {
        return next(new ApiError(401, 'Not authorized, no token provided.'));
    }
});

// Middleware: Restricts access to specific user roles (e.g., admin, artisan)
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ApiError(403, `Forbidden. You must have one of the following roles: [${roles.join(', ')}]`));
        }
        next();
    };
};
