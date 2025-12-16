const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const productValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Product name must not exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('categories')
    .isArray({ min: 1 }).withMessage('At least one category must be selected')
    .custom((value) => {
      if (!value.every(id => /^[0-9a-fA-F]{24}$/.test(id))) {
        throw new Error('Invalid category ID format');
      }
      return true;
    })
];

router.get('/', protect, getProducts);
router.get('/:id', protect, getProduct);
router.post('/', protect, productValidation, createProduct);
router.put('/:id', protect, productValidation, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;

