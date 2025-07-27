import express from 'express';
import passport from 'passport';
import {
    registerCustomer,
    loginUser,
    logoutUser,
    googleAuthCallback
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multerMiddleware.js';

const router = express.Router();

// Email & Password Routes
router.post('/register', upload.single('profilePicture'), registerCustomer);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login/failed`, 
        session: false
    }),
    googleAuthCallback
);

export default router;
