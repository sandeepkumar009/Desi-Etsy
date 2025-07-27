import asyncHandler from 'express-async-handler';
import Notification from '../models/notificationModel.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, notifications, 'Notifications fetched successfully.'));
});

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


export const markAllAsRead = asyncHandler(async (req, res) => {
    const { role } = req.body; 

    if (!role || !['customer', 'artisan', 'admin'].includes(role)) {
        throw new ApiError(400, 'A valid role is required to mark notifications as read.');
    }

    await Notification.updateMany(
        { user: req.user._id, role: role, isRead: false },
        { $set: { isRead: true } }
    );
    
    res.status(200).json(new ApiResponse(200, {}, `All ${role} notifications marked as read.`));
});
