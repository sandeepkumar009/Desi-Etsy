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
    type: String, 
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
