import express from 'express';
import {
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsForAdmin,
  updateProductStatus
} from '../controllers/productController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multerMiddleware.js';

const router = express.Router();

router.post('/create', protect, authorize('artisan'), upload.single('productImage'), createProduct);
router.get('/my-products', protect, authorize('artisan'), getMyProducts);
router.put('/:id', protect, authorize('artisan'), upload.single('productImage'), updateProduct);
router.delete('/:id', protect, authorize('artisan'), deleteProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// --- NEW: Admin Routes ---
router.get('/admin/all', protect, authorize('admin'), getProductsForAdmin);
router.patch('/admin/status/:id', protect, authorize('admin'), updateProductStatus);

export default router;