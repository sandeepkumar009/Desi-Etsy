import express from 'express';
import { getArtisanOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/my-orders', protect, authorize('artisan'), getArtisanOrders);
router.put('/:orderId/status', protect, authorize('artisan'), updateOrderStatus);

export default router;
