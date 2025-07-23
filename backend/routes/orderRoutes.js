// backend/routes/orderRoutes.js
// Adding the new routes for the checkout flow.

import express from 'express';
import { 
    getArtisanOrders, 
    updateOrderStatus,
    getCustomerOrders,
    getCustomerOrderDetail,
    checkUserPurchase,
    createOrder,
    verifyPayment,
    createDirectOrder
} from '../controllers/orderController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// --- CHECKOUT FLOW ROUTES (Customer initiated) ---
router.post('/create', protect, createOrder);
router.post('/buy-now', protect, createDirectOrder);
router.post('/verify-payment', protect, verifyPayment);

// --- ARTISAN ROUTES ---
router.get('/my-orders', protect, authorize('artisan'), getArtisanOrders);
router.put('/:orderId/status', protect, authorize('artisan'), updateOrderStatus);

// --- CUSTOMER ROUTES ---
router.get('/customer/my-orders', protect, getCustomerOrders);
router.get('/customer/my-orders/:orderId', protect, getCustomerOrderDetail);
router.get('/check-purchase/:productId', protect, checkUserPurchase);

export default router;
