import express from 'express';
import { 
    getUserProfile, 
    updateUserProfile,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    setDefaultAddress,
    updatePassword,
    getWishlist,
    addToWishlist,
    removeFromWishlist 
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multerMiddleware.js';

const router = express.Router();

// Profile Routes
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, upload.single('profilePicture'), updateUserProfile);
    
// --- NEW: Password Change Route ---
router.put('/profile/change-password', protect, updatePassword);

// Address Routes
router.route('/profile/addresses')
    .post(protect, addUserAddress);

router.route('/profile/addresses/:addressId')
    .put(protect, updateUserAddress)
    .delete(protect, deleteUserAddress);
    
router.patch('/profile/addresses/:addressId/default', protect, setDefaultAddress);

router.route('/profile/wishlist')
    .get(protect, getWishlist);

router.route('/profile/wishlist/:productId')
    .post(protect, addToWishlist)
    .delete(protect, removeFromWishlist);

export default router;