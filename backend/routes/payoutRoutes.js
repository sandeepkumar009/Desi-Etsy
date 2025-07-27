import express from 'express';
import { getPayoutSummary, recordPayout } from '../controllers/payoutController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes in this file are for admins only
router.use(protect, authorize('admin'));

router.get('/summary', getPayoutSummary);
router.post('/record', recordPayout);

export default router;
