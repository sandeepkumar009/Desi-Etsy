import express from 'express';
import { applyForArtisan } from '../controllers/artisanController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multerMiddleware.js';

const router = express.Router();

router.post(
    '/apply',
    protect,
    upload.single('bannerImage'),
    applyForArtisan
);

export default router;
