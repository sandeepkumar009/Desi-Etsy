import express from 'express';
import { getArtisanAnalytics, getAdminDashboardSummary } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// --- PROTECTED ROUTES (Artisans Only) ---
router.get('/', protect, authorize('artisan'), getArtisanAnalytics);
// Route for Admin Dashboard Summary
router.get('/summary', protect, authorize('admin'), getAdminDashboardSummary);

export default router;
