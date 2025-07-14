import mongoose from 'mongoose';

// Notification Model * Stores notifications for users about various platform events.
const NotificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Optional: The user who triggered the notification (e.g., a customer who placed an order)
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    type: {
        type: String,
        enum: [
            'new_order',
            'order_status_update',
            'new_review',
            'new_message',
            'product_approved',
            'product_rejected',
            'global_announcement'
        ],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    // A link to navigate to when the notification is clicked (e.g., /orders/orderId)
    link: {
        type: String,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

NotificationSchema.index({ recipientId: 1 });

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
