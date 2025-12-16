const Product = require('../models/Product');
const { validationResult } = require('express-validator');

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    let query = { user: req.user._id };
    
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }
    
    if (req.query.categories) {
      const categoryIds = req.query.categories.split(',');
      query.categories = { $in: categoryIds };
    }
    
    const products = await Product.find(query)
      .populate('categories', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasMore: page < Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching products',
      error: error.message 
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('categories', 'name');
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching product',
      error: error.message 
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }
    
    const { name, description, quantity, categories } = req.body;
    
    const existingProduct = await Product.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      user: req.user._id
    });
    
    if (existingProduct) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product with this name already exists' 
      });
    }
    
    const product = await Product.create({
      name,
      description,
      quantity,
      categories,
      user: req.user._id
    });
    
    const populatedProduct = await Product.findById(product._id).populate('categories', 'name');
    
    res.status(201).json({ 
      success: true, 
      message: 'Product created successfully',
      data: populatedProduct 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error creating product',
      error: error.message 
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }
    
    const { name } = req.body;
    
    const existingProduct = await Product.findOne({ 
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!existingProduct) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found or you do not have permission to update it' 
      });
    }
    
    if (name) {
      const duplicateProduct = await Product.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id },
        user: req.user._id
      });
      
      if (duplicateProduct) {
        return res.status(400).json({ 
          success: false, 
          message: 'Product with this name already exists' 
        });
      }
    }
    
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('categories', 'name');
    
    res.json({ 
      success: true, 
      message: 'Product updated successfully',
      data: product 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating product',
      error: error.message 
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found or you do not have permission to delete it' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting product',
      error: error.message 
    });
  }
};

