import { Router } from 'express';
const router = Router();
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addStock,
  removeStock,
  getLowStockProducts
} from '../controllers/product.controller.js';

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/low-stock', getLowStockProducts); 
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);


router.patch('/:id/add-stock', addStock);
router.patch('/:id/remove-stock', removeStock);

export default router;
