/*
* FILE: backend/utils/notificationUtils.js
*
* DESCRIPTION:
* This is a new utility file to centralize the logic for creating and
* sending notifications. This keeps our controllers cleaner and avoids
* code duplication. The `createNotification` function will:
* 1. Save the notification to the database.
* 2. Emit a real-time event via Socket.IO to the specific user if they are online.
*/
import Notification from '../models/notificationModel.js';
import { getIo, getSocketId } from '../socket.js';

/**
 * Creates and sends a notification.
 * @param {string} userId - The ID of the user to notify.
 * @param {string} message - The notification message.
 * @param {string} link - The link for the notification.
 * @param {string} role - The role of the user being notified.
 */
export const createNotification = async (userId, message, link, role) => {
  try {
    if (!userId || !message || !link || !role) {
        console.error('Missing parameters for createNotification', { userId, message, link, role });
        return;
    }
    // 1. Create and save the notification to the database
    const notification = new Notification({
      user: userId,
      message,
      link,
      role
    });
    await notification.save();

    // 2. Get the Socket.IO instance and the user's socket ID
    const io = getIo();
    const userSocketId = getSocketId(userId.toString());

    // 3. If the user is connected, emit a real-time event
    if (userSocketId) {
      io.to(userSocketId).emit('new_notification', notification);
    }
  } catch (error) {
    // Avoid crashing the main operation if notification fails
    console.error('Error creating notification:', error);
  }
};
