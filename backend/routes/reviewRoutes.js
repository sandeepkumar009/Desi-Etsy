import { Router } from 'express';
import { createReview, getProductReviews, updateReview } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/:productId', getProductReviews);
router.post('/:productId', protect, createReview);
router.put('/:reviewId', protect, updateReview);

export default router;
