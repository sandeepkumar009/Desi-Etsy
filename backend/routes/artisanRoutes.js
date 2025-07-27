import express from 'express';
import { 
    applyForArtisan, 
    getArtisanPublicProfile,
    updateArtisanProfile,
    getAllArtisans,
    updateArtisanStatus,
    getMyPayoutInfo,
    updateMyPayoutInfo,
    getMyPayoutSummary,
    getMyPayoutHistory
 } from '../controllers/artisanController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multerMiddleware.js';

const router = express.Router();

// Route for users to apply to become an artisan
router.post(
    '/apply',
    protect,
    upload.single('bannerImage'),
    applyForArtisan
);

// Public route to get an artisan's shop profile details
router.get('/profile/:artisanId', getArtisanPublicProfile);

router.put(
    '/my-profile', 
    protect, 
    authorize('artisan'),
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'bannerImage', maxCount: 1 }
    ]), 
    updateArtisanProfile
);

router.route('/my-payout-info')
    .get(protect, authorize('artisan'), getMyPayoutInfo)
    .put(protect, authorize('artisan'), updateMyPayoutInfo);
router.get('/my-payout-summary', protect, authorize('artisan'), getMyPayoutSummary);
router.get('/my-payout-history', protect, authorize('artisan'), getMyPayoutHistory);

// Admin-only Routes
router.route('/admin/all')
    .get(protect, authorize('admin'), getAllArtisans);

router.route('/admin/status/:artisanId')
    .patch(protect, authorize('admin'), updateArtisanStatus);


export default router;
