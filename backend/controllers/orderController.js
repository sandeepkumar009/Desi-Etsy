import Order from '../models/orderModel.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';

export const getArtisanOrders = async (req, res, next) => {
    try {
        const artisanId = req.user._id;

        // Find all orders that contain at least one item from the current artisan
        const orders = await Order.find({ 'items.artisanId': artisanId })
            .populate('userId', 'name email') // Populate customer details
            .sort({ createdAt: -1 }); // Sort by newest first

        if (!orders) {
            return res.status(200).json(new ApiResponse(200, [], 'No orders found.'));
        }
        
        // Filter out items that do not belong to the current artisan for each order
        const artisanSpecificOrders = orders.map(order => {
            const itemsForArtisan = order.items.filter(item => item.artisanId.toString() === artisanId.toString());
            // We can't just modify order.items, so we create a new object
            const orderObject = order.toObject();
            orderObject.items = itemsForArtisan;
            return orderObject;
        });


        res.status(200).json(new ApiResponse(200, artisanSpecificOrders, "Artisan's orders fetched successfully"));

    } catch (err) {
        next(err);
    }
};


export const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status, details } = req.body; // details can contain tracking info, cancellation reason etc.
        const artisanId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            throw new ApiError(400, 'Invalid Order ID');
        }

        const validStatuses = ['processing', 'packed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new ApiError(400, 'Invalid status update.');
        }

        const order = await Order.findById(orderId);

        if (!order) {
            throw new ApiError(404, 'Order not found.');
        }

        // Check if the artisan is actually part of this order
        const isArtisanInOrder = order.items.some(item => item.artisanId.toString() === artisanId.toString());
        if (!isArtisanInOrder) {
            throw new ApiError(403, 'You are not authorized to update this order.');
        }

        // Update the main order status
        order.status = status;

        // Add to the status history
        const historyEntry = {
            status: status,
            updatedAt: new Date(),
            // You could add more details here, like who updated it
            // updatedBy: artisanId 
        };
        
        // If shipping, add tracking details to the history entry
        if (status === 'shipped' && details?.trackingNumber) {
            historyEntry.details = `Carrier: ${details.carrier}, Tracking #: ${details.trackingNumber}`;
        }
        
        // If cancelling, add reason to the history entry
        if (status === 'cancelled' && details?.reason) {
            historyEntry.details = `Reason: ${details.reason}`;
        }

        order.statusHistory.unshift(historyEntry); // Add to the beginning of the array

        await order.save();

        res.status(200).json(new ApiResponse(200, order, 'Order status updated successfully.'));

    } catch (err) {
        next(err);
    }
};
