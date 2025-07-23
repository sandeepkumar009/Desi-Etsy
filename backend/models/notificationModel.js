/*
* FILE: backend/models/notificationModel.js
*
* DESCRIPTION:
* This is the Mongoose schema for our notifications. It's designed to be
* flexible enough to handle all the scenarios we've listed. It includes:
* - `user`: The ID of the user who will receive the notification.
* - `message`: The content of the notification.
* - `isRead`: A boolean to track if the user has seen the notification.
* - `link`: An optional URL for the user to click, taking them to the relevant page (e.g., an order detail page).
* - `role`: The role of the user, which helps in querying notifications for specific dashboards.
*/
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String, // e.g., /dashboard/orders/12345 or /admin/dashboard/products
  },
  role: {
    type: String,
    enum: ['customer', 'artisan', 'admin'],
    required: true,
  }
}, {
  timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
