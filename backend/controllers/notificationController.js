/*
* FILE: backend/controllers/notificationController.js
*
* DESCRIPTION:
* This file is updated to make the 'markAllAsRead' function role-specific.
* It now expects a 'role' in the request body and will only update notifications
* that match the user's ID AND the provided role. This prevents marking
* customer notifications as read when the user is in their seller dashboard, and vice versa.
*/
import asyncHandler from 'express-async-handler';
import Notification from '../models/notificationModel.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, notifications, 'Notifications fetched successfully.'));
});

// @desc    Mark a single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        throw new ApiError(404, 'Notification not found or you do not have permission.');
    }

    res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read.'));
});


// @desc    Mark all notifications for a specific role as read
// @route   POST /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
    const { role } = req.body; // <-- ADDED: Expect role from request body

    if (!role || !['customer', 'artisan', 'admin'].includes(role)) {
        throw new ApiError(400, 'A valid role is required to mark notifications as read.');
    }

    // --- MODIFIED: Added 'role' to the query filter ---
    await Notification.updateMany(
        { user: req.user._id, role: role, isRead: false },
        { $set: { isRead: true } }
    );
    // ---------------------------------------------------

    res.status(200).json(new ApiResponse(200, {}, `All ${role} notifications marked as read.`));
});
