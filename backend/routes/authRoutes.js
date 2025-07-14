import express from 'express';
import {
    registerCustomer,
    loginUser,
    logoutUser
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multerMiddleware.js';

const router = express.Router();

// Email & Password Routes
router.post('/register', upload.single('profilePicture'), registerCustomer);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);

export default router;
