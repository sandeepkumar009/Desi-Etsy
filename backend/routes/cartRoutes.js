import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
    getCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    mergeCarts
} from '../controllers/cartController.js';

const router = express.Router();

router.use(protect); // All routes in this file are protected

router.route('/')
    .get(getCart)
    .post(addToCart);

router.post('/merge', mergeCarts);

router.route('/:productId')
    .put(updateCartItemQuantity)
    .delete(removeFromCart);

export default router;