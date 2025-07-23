import { Router } from 'express';
import { 
    createReview, 
    getProductReviews, 
    updateReview,
    getUserReviewForProduct // NEW
} from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/:productId', getProductReviews);
router.post('/:productId', protect, createReview);
router.put('/:reviewId', protect, updateReview);

// --- NEW ROUTE ---
router.get('/user-review/:productId', protect, getUserReviewForProduct);

export default router;