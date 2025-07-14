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

// Step 1: The route to trigger the Google login process.
// The user's browser will be redirected to Google's sign-in page.
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Step 2: The callback route that Google redirects to after successful authentication.
// Passport's middleware will intercept this, execute the strategy logic,
// and then pass control to our `googleAuthCallback` controller.
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login/failed`, // Redirect on failure
        session: false // We are using JWTs, not sessions
    }),
    googleAuthCallback
);

export default router;
