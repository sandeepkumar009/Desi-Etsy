import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';

export const getArtisanAnalytics = asyncHandler(async (req, res) => {
    const artisanId = req.user._id;
    const { timePeriod = '30d' } = req.query;

    // --- 1. Calculate Date Range ---
    let startDate = new Date();
    switch (timePeriod) {
        case '7d':
            startDate.setDate(startDate.getDate() - 7);
            break;
        case '90d':
            startDate.setDate(startDate.getDate() - 90);
            break;
        case 'all':
            startDate = new Date(0); // The beginning of time
            break;
        case '30d':
        default:
            startDate.setDate(startDate.getDate() - 30);
            break;
    }

    // --- 2. Main Aggregation for Revenue, Sales, and Top Products ---
    const salesData = await Order.aggregate([
        // Stage 1: Filter orders for the artisan within the date range and are considered "successful"
        {
            $match: {
                'items.artisanId': artisanId,
                'status': { $in: ['processing', 'packed', 'shipped', 'delivered'] },
                createdAt: { $gte: startDate }
            }
        },
        // Stage 2: Deconstruct the items array
        { $unwind: '$items' },
        // Stage 3: Filter the deconstructed items to only include the artisan's products
        {
            $match: {
                'items.artisanId': artisanId
            }
        },
        // Stage 4: Group data to calculate metrics
        {
            $group: {
                _id: '$items.productId',
                totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                totalSales: { $sum: '$items.quantity' },
                productName: { $first: '$items.name' }
            }
        },
        // Stage 5: Sort by revenue to find top products
        { $sort: { totalRevenue: -1 } }
    ]);

    // --- 3. Calculate Key Metrics from Aggregated Data ---
    const totalRevenue = salesData.reduce((acc, item) => acc + item.totalRevenue, 0);
    const totalOrders = await Order.countDocuments({ 
        'items.artisanId': artisanId, 
        status: { $in: ['processing', 'packed', 'shipped', 'delivered'] },
        createdAt: { $gte: startDate }
    });
    
    const topProducts = salesData.slice(0, 5).map(p => ({
        _id: p._id,
        name: p.productName,
        sales: p.totalSales,
        revenue: p.totalRevenue
    }));

    // --- 4. Fetch Additional Stats (not dependent on date range) ---
    const pendingOrders = await Order.countDocuments({ 
        'items.artisanId': artisanId, 
        status: { $in: ['paid', 'processing', 'packed'] } 
    });
    const totalProducts = await Product.countDocuments({ artisanId: artisanId });

    // --- 5. Assemble Response ---
    const analytics = {
        keyStats: {
            totalRevenue,
            totalOrders,
            avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
            totalProducts,
            pendingOrders
        },
        salesSummary: {
            period: `Last ${timePeriod.replace('d', ' Days')}`,
            totalSales: totalRevenue,
        },
        topProducts
    };

    res.status(200).json(new ApiResponse(200, analytics, 'Analytics data fetched successfully.'));
});
