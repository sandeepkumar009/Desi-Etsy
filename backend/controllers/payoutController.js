/*
* FILE: backend/controllers/payoutController.js
*
* DESCRIPTION:
* This file is updated to add a notification trigger when a payout is recorded.
* - Imports the 'createNotification' utility.
* - In 'recordPayout', after an admin successfully records a payout, it
* sends a notification to the artisan to inform them.
*/
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import Payout from '../models/payoutModel.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { createNotification } from '../utils/notificationUtils.js'; // <-- ADDED

const PLATFORM_COMMISSION_RATE = 0.15; // 15% commission

// ... (getPayoutSummary remains unchanged)
export const getPayoutSummary = asyncHandler(async (req, res) => {
    const unpaidOrders = await Order.find({
        status: 'delivered',
        payoutStatus: 'pending'
    }).populate({
        path: 'items.artisanId',
        model: 'User',
        select: 'name artisanProfile.brandName artisanProfile.payoutInfo'
    });
    const payoutSummary = {};
    for (const order of unpaidOrders) {
        for (const item of order.items) {
            if (!item.artisanId || !item.artisanId._id) continue;
            const artisanId = item.artisanId._id.toString();
            if (!payoutSummary[artisanId]) {
                payoutSummary[artisanId] = {
                    artisanInfo: item.artisanId,
                    totalSales: 0,
                    orderIds: [],
                };
            }
            payoutSummary[artisanId].totalSales += item.price * item.quantity;
            if (!payoutSummary[artisanId].orderIds.includes(order._id.toString())) {
                payoutSummary[artisanId].orderIds.push(order._id.toString());
            }
        }
    }
    const summaryArray = Object.values(payoutSummary).map(summary => {
        const commission = summary.totalSales * PLATFORM_COMMISSION_RATE;
        const netPayable = summary.totalSales - commission;
        return {
            artisanId: summary.artisanInfo._id,
            brandName: summary.artisanInfo.artisanProfile.brandName,
            accountHolderName: summary.artisanInfo.artisanProfile.payoutInfo.accountHolderName,
            totalSales: summary.totalSales,
            commission,
            netPayable,
            orderCount: summary.orderIds.length,
            orderIds: summary.orderIds,
            payoutInfo: summary.artisanInfo.artisanProfile.payoutInfo,
        };
    });
    res.status(200).json(new ApiResponse(200, summaryArray, "Payout summary fetched successfully."));
});
// ---

/**
 * @desc    Record a payout to an artisan
 * @route   POST /api/payouts/record
 * @access  Private/Admin
 */
export const recordPayout = asyncHandler(async (req, res) => {
    const { artisanId, amount, orderIds, transactionReference } = req.body;
    const adminId = req.user._id;

    if (!artisanId || !amount || !orderIds || orderIds.length === 0) {
        throw new ApiError(400, "Missing required payout information.");
    }

    const newPayout = await Payout.create({
        adminId,
        artisanId,
        amount,
        orderIds,
        transactionReference,
        status: 'completed'
    });

    await Order.updateMany(
        { _id: { $in: orderIds } },
        { $set: { payoutStatus: 'paid', payoutId: newPayout._id } }
    );

    // --- ADDED: Notify Artisan Trigger ---
    await createNotification(
        artisanId,
        `A payout of ₹${amount} has been processed for you.`,
        '/seller/payouts',
        'artisan'
    );
    // ------------------------------------

    res.status(201).json(new ApiResponse(201, newPayout, "Payout recorded successfully."));
});
