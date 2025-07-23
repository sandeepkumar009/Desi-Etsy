// backend/models/payoutModel.js
// This is a new model to keep a record of every payout transaction.

import mongoose from 'mongoose';

const PayoutSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    artisanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    // The list of order IDs that this payout covers
    orderIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }],
    status: {
        type: String,
        enum: ['completed', 'failed'],
        default: 'completed',
    },
    // Optional field for the admin to add a reference/transaction ID from their bank
    transactionReference: {
        type: String,
    },
}, { timestamps: true });

const Payout = mongoose.model('Payout', PayoutSchema);
export default Payout;
