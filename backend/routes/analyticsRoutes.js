import express from 'express';
import { getArtisanAnalytics } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// --- PROTECTED ROUTES (Artisans Only) ---
router.get('/', protect, authorize('artisan'), getArtisanAnalytics);

export default router;
