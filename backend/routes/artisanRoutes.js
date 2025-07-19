import express from 'express';
import { 
    applyForArtisan, 
    getArtisanPublicProfile,
    updateArtisanProfile
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

export default router;
