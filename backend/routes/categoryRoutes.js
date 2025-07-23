import { Router } from 'express';
import { 
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

// Public route to get all categories
router.route('/').get(getAllCategories);

// Admin-only routes for managing categories
router.route('/')
    .post(protect, authorize('admin'), createCategory);

router.route('/:id')
    .put(protect, authorize('admin'), updateCategory)
    .delete(protect, authorize('admin'), deleteCategory);

export default router;
