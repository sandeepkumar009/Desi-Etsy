import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Array of items in the order
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        artisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        image: { type: String, required: true }, // Store one image for quick display
        price: { type: Number, required: true }, // Price at the time of order
        quantity: { type: Number, required: true, min: 1 },
    }],
    shippingAddress: {
        // Denormalized address data, copied from user at time of order
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending_payment', 'paid', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending_payment',
    },
    // Tracks the history of status changes
    statusHistory: [{
        status: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
    }],
    paymentDetails: {
        paymentId: { type: String }, // From Razorpay
        method: { type: String, default: 'razorpay' },
        status: { type: String, enum: ['pending', 'successful', 'failed'], default: 'pending' },
    },
}, { timestamps: true });

OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'items.artisanId': 1 }); // To help artisans find their orders

const Order = mongoose.model('Order', OrderSchema);
export default Order;
