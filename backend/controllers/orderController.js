/*
* FILE: backend/controllers/orderController.js
*
* DESCRIPTION:
* This file is updated to add notification triggers for the order process.
* - Imports the 'createNotification' utility.
* - In 'createDirectOrder' and 'createOrder', it notifies the customer upon
* order placement and also notifies the relevant artisan(s) of the new order.
* - In 'updateOrderStatus', it notifies the customer when an artisan updates
* the status of their order.
*/
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { instance as razorpayInstance } from '../config/razorpay.js';
import { createNotification } from '../utils/notificationUtils.js'; // <-- ADDED

// --- NEW "BUY NOW" CONTROLLER ---
export const createDirectOrder = async (req, res, next) => {
    try {
        const { productId, quantity, shippingAddress, paymentMethod } = req.body;
        const userId = req.user._id;

        if (!productId || !quantity || !shippingAddress || !paymentMethod) {
            throw new ApiError(400, "Missing required fields for direct order.");
        }

        const product = await Product.findById(productId);
        if (!product) throw new ApiError(404, "Product not found.");
        
        const orderGroupId = new mongoose.Types.ObjectId().toString();
        const totalAmount = product.price * quantity;

        const orderItem = {
            productId: product._id,
            artisanId: product.artisanId,
            name: product.name,
            image: (product.images && product.images.length > 0) ? product.images[0] : 'https://placehold.co/400x400?text=No+Image',
            price: product.price,
            quantity: quantity,
        };
        
        if (paymentMethod === 'COD') {
            const newOrder = new Order({
                orderGroupId, userId, items: [orderItem], shippingAddress, totalAmount,
                status: 'processing',
                paymentDetails: { method: 'COD', payment_status: 'pending' },
                statusHistory: [{ status: 'processing', details: 'Order placed directly via COD.' }]
            });
            const savedOrder = await newOrder.save();

            // --- ADDED: Notification Triggers ---
            await createNotification(userId, `Your order for '${product.name}' has been placed!`, `/dashboard/orders/${savedOrder._id}`, 'customer');
            await createNotification(product.artisanId, `You have a new order for '${product.name}'.`, `/seller/orders`, 'artisan');
            // ------------------------------------

            return res.status(201).json(new ApiResponse(201, { orderGroupId }, 'Direct order placed successfully with COD'));
        }

        const razorpayOptions = { amount: Number(totalAmount * 100), currency: 'INR', receipt: `receipt_order_${orderGroupId}` };
        const razorpayOrder = await razorpayInstance.orders.create(razorpayOptions);
        if (!razorpayOrder) throw new ApiError(500, 'Could not create Razorpay order');

        const newOrder = new Order({
            orderGroupId, userId, items: [orderItem], shippingAddress, totalAmount,
            status: 'pending_payment',
            paymentDetails: { method: 'Online', razorpay_order_id: razorpayOrder.id, payment_status: 'pending' },
            statusHistory: [{ status: 'pending_payment', details: 'Awaiting payment.' }]
        });
        await newOrder.save();

        res.status(201).json(new ApiResponse(201, { razorpayOrder, orderGroupId }, 'Direct order created, proceed to payment'));

    } catch (err) {
        next(err);
    }
};

// --- CHECKOUT CONTROLLERS ---
export const createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId).populate({ path: 'cart.productId', model: 'Product', select: 'name price images stock artisanId' });
        if (!user || user.cart.length === 0) throw new ApiError(400, "Your cart is empty.");
        
        const validCartItems = user.cart.filter(item => item.productId);
        if (validCartItems.length !== user.cart.length) throw new ApiError(400, "An item in your cart is no longer available.");

        const ordersByArtisan = new Map();
        for (const item of validCartItems) {
            if (!item.productId.artisanId) throw new ApiError(500, `Product "${item.productId.name}" is missing artisan info.`);
            const artisanId = item.productId.artisanId.toString();
            if (!ordersByArtisan.has(artisanId)) ordersByArtisan.set(artisanId, []);
            ordersByArtisan.get(artisanId).push(item);
        }

        const orderGroupId = new mongoose.Types.ObjectId().toString();
        const totalCartAmount = validCartItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

        const createOrderItems = (items) => items.map(i => ({
            productId: i.productId._id, artisanId: i.productId.artisanId, name: i.productId.name,
            image: (i.productId.images && i.productId.images.length > 0) ? i.productId.images[0] : 'https://placehold.co/400x400?text=No+Image',
            price: i.productId.price, quantity: i.quantity,
        }));

        if (paymentMethod === 'COD') {
            for (const [artisanId, items] of ordersByArtisan.entries()) {
                const totalAmount = items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
                const newOrder = new Order({
                    orderGroupId, userId, items: createOrderItems(items), shippingAddress, totalAmount,
                    status: 'processing', paymentDetails: { method: 'COD', payment_status: 'pending' },
                    statusHistory: [{ status: 'processing', details: 'Order placed via COD.' }]
                });
                const savedOrder = await newOrder.save();

                // --- ADDED: Artisan Notification ---
                await createNotification(artisanId, `You have a new order (#${orderGroupId.slice(-6)}).`, `/seller/orders`, 'artisan');
            }
            // --- ADDED: Customer Notification ---
            await createNotification(userId, `Your order group #${orderGroupId.slice(-6)} has been placed!`, `/dashboard/orders`, 'customer');
            
            user.cart = [];
            await user.save();
            return res.status(201).json(new ApiResponse(201, { orderGroupId }, 'Orders placed successfully with COD'));
        }
        
        const razorpayOptions = { amount: Number(totalCartAmount * 100), currency: 'INR', receipt: `receipt_order_${orderGroupId}` };
        const razorpayOrder = await razorpayInstance.orders.create(razorpayOptions);
        if (!razorpayOrder) throw new ApiError(500, 'Could not create Razorpay order');

        for (const [artisanId, items] of ordersByArtisan.entries()) {
            const totalAmount = items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
            const newOrder = new Order({
                orderGroupId, userId, items: createOrderItems(items), shippingAddress, totalAmount,
                status: 'pending_payment',
                paymentDetails: { method: 'Online', razorpay_order_id: razorpayOrder.id, payment_status: 'pending' },
                statusHistory: [{ status: 'pending_payment', details: 'Awaiting payment.' }]
            });
            await newOrder.save();
        }

        user.cart = [];
        await user.save();
        res.status(201).json(new ApiResponse(201, { razorpayOrder, orderGroupId }, 'Order created, proceed to payment'));

    } catch (err) {
        next(err);
    }
};

// ... (verifyPayment remains unchanged)
export const verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            throw new ApiError(400, "Payment details are missing");
        }
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            const paidEntry = { status: 'paid', details: 'Payment successful.', updatedAt: new Date() };
            const processingEntry = { status: 'processing', details: 'Order is being prepared.', updatedAt: new Date() };
            await Order.updateMany(
                { 'paymentDetails.razorpay_order_id': razorpay_order_id },
                {
                    $set: {
                        'paymentDetails.payment_status': 'successful', 'paymentDetails.razorpay_payment_id': razorpay_payment_id,
                        'paymentDetails.razorpay_signature': razorpay_signature, 'status': 'processing'
                    },
                    $push: { statusHistory: { $each: [paidEntry, processingEntry] } }
                }
            );
            const orders = await Order.find({'paymentDetails.razorpay_order_id': razorpay_order_id});
            const orderGroupId = orders.length > 0 ? orders[0].orderGroupId : null;
            
            // --- ADDED: Notification Triggers on Successful Payment ---
            if (orders.length > 0) {
                const customerId = orders[0].userId;
                await createNotification(customerId, `Payment successful for order group #${orderGroupId.slice(-6)}.`, `/dashboard/orders`, 'customer');
                for (const order of orders) {
                    const artisanId = order.items[0].artisanId; // Assuming one artisan per order
                    await createNotification(artisanId, `You have a new paid order (#${orderGroupId.slice(-6)}).`, `/seller/orders`, 'artisan');
                }
            }
            // ---------------------------------------------------------

            res.status(200).json(new ApiResponse(200, { orderGroupId }, 'Payment verified successfully'));
        } else {
            await Order.updateMany(
                { 'paymentDetails.razorpay_order_id': razorpay_order_id },
                { $set: { 'paymentDetails.payment_status': 'failed', 'status': 'failed' } }
            );
            throw new ApiError(400, 'Payment verification failed. Signature mismatch.');
        }
    } catch (err) {
        next(err);
    }
};
// ---

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status, details } = req.body;
        const artisanId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(orderId)) throw new ApiError(400, 'Invalid Order ID');
        const validStatuses = ['processing', 'packed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) throw new ApiError(400, 'Invalid status update.');

        const order = await Order.findById(orderId);
        if (!order) throw new ApiError(404, 'Order not found.');

        const isArtisanInOrder = order.items.some(item => item.artisanId.toString() === artisanId.toString());
        if (!isArtisanInOrder) throw new ApiError(403, 'You are not authorized to update this order.');

        order.status = status;
        const historyEntry = { status, updatedAt: new Date() };
        
        if (status === 'shipped' && details?.trackingNumber) {
            historyEntry.details = `Carrier: ${details.carrier}, Tracking #: ${details.trackingNumber}`;
        } else if (status === 'cancelled' && details?.reason) {
            historyEntry.details = `Reason: ${details.reason}`;
        }
        
        order.statusHistory.push(historyEntry);
        await order.save();

        // --- ADDED: Customer Notification Trigger ---
        const statusMessage = status.charAt(0).toUpperCase() + status.slice(1);
        await createNotification(
            order.userId,
            `Your order #${order.orderGroupId.slice(-6)} has been ${statusMessage}.`,
            `/dashboard/orders/${order._id}`,
            'customer'
        );
        // ------------------------------------------

        res.status(200).json(new ApiResponse(200, order, 'Order status updated successfully.'));
    } catch (err) {
        next(err);
    }
};

// --- EXISTING CONTROLLERS (No changes needed) ---
export const getArtisanOrders = async (req, res, next) => {
    try {
        const artisanId = req.user._id;
        const orders = await Order.find({ 'items.artisanId': artisanId }).populate('userId', 'name email').sort({ createdAt: -1 });
        if (!orders) return res.status(200).json(new ApiResponse(200, [], 'No orders found.'));
        const artisanSpecificOrders = orders.map(order => {
            const itemsForArtisan = order.items.filter(item => item.artisanId.toString() === artisanId.toString());
            const orderObject = order.toObject();
            orderObject.items = itemsForArtisan;
            return orderObject;
        });
        res.status(200).json(new ApiResponse(200, artisanSpecificOrders, "Artisan's orders fetched successfully"));
    } catch (err) {
        next(err);
    }
};
export const getCustomerOrders = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });
        res.status(200).json(new ApiResponse(200, orders, "Customer orders fetched successfully."));
    } catch (err) {
        next(err);
    }
};
export const getCustomerOrderDetail = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { orderId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(orderId)) throw new ApiError(400, "Invalid Order ID.");
        const order = await Order.findOne({ _id: orderId, userId: userId }).populate('items.productId', 'name images');
        if (!order) throw new ApiError(404, "Order not found or you do not have permission to view it.");
        res.status(200).json(new ApiResponse(200, order, "Order details fetched successfully."));
    } catch (err) {
        next(err);
    }
};
export const checkUserPurchase = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;
        const order = await Order.findOne({ userId, 'items.productId': productId, status: 'delivered' });
        res.status(200).json(new ApiResponse(200, { hasPurchased: !!order }));
    } catch (err) {
        next(err);
    }
};
