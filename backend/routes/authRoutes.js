import express from 'express';
import {
  registerUser,
  loginUser,
  registerArtisan,
  loginArtisan
} from '../controllers/authController.js';

const router = express.Router();

// User Routes
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);

// Artisan Routes
router.post('/artisan/register', registerArtisan);
router.post('/artisan/login', loginArtisan);

export default router;
