// backend/models/orderModel.js
// We'll update the paymentDetails to be more specific for Razorpay.

import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        artisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
    }],
    shippingAddress: {
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
        enum: ['pending_payment', 'paid', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'failed'],
        default: 'pending_payment',
    },
    statusHistory: [{
        status: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
        details: { type: String }
    }],
    paymentDetails: {
        method: { type: String, required: true, enum: ['COD', 'Online'] },
        razorpay_order_id: { type: String },
        razorpay_payment_id: { type: String },
        razorpay_signature: { type: String },
        payment_status: { type: String, enum: ['pending', 'successful', 'failed'], default: 'pending' },
    },
    // A shared ID to group sub-orders from a single checkout
    orderGroupId: {
        type: String,
        required: true,
    },
    // **NEW:** Payout tracking fields
    payoutStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    payoutId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payout'
    }
}, { timestamps: true });

OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'items.artisanId': 1 });
OrderSchema.index({ orderGroupId: 1 });

const Order = mongoose.model('Order', OrderSchema);
export default Order;
