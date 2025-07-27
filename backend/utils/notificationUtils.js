import Notification from '../models/notificationModel.js';
import { getIo, getSocketId } from '../socket.js';

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
    console.error('Error creating notification:', error);
  }
};
