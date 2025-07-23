/*
* FILE: backend/routes/notificationRoutes.js
*
* DESCRIPTION:
* This new route file defines the API endpoints for managing notifications.
* It's protected by the `protect` middleware to ensure only authenticated
* users can access their notifications.
*/
import express from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes here are protected
router.use(protect);

router.get('/', getNotifications);
router.post('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);


export default router;
