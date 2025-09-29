import Product from '../models/Product.js';

const createProduct = async (req, res, next) => {
  try {
    const { name, description, stock_quantity, low_stock_threshold } = req.body;
    
    const product = new Product({
      name,
      description,
      stock_quantity,
      low_stock_threshold
    });
    
    const savedProduct = await product.save();
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });
  } catch (error) {
    next(error);
  }
};


const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().select('-__v');
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};


const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).select('-__v');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};


const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate stock quantity if provided
    if (updateData.stock_quantity !== undefined && updateData.stock_quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock quantity cannot be negative'
      });
    }
    
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true,
        select: '-__v'
      }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};


const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};


const addStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive number'
      });
    }
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    product.stock_quantity += quantity;
    await product.save();
    
    res.status(200).json({
      success: true,
      message: `Added ${quantity} units to stock`,
      data: {
        productId: product._id,
        name: product.name,
        previousStock: product.stock_quantity - quantity,
        currentStock: product.stock_quantity,
        quantityAdded: quantity
      }
    });
  } catch (error) {
    next(error);
  }
};


const removeStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive number'
      });
    }
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (product.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${product.stock_quantity}, Requested: ${quantity}`
      });
    }
    
    product.stock_quantity -= quantity;
    await product.save();
    
    res.status(200).json({
      success: true,
      message: `Removed ${quantity} units from stock`,
      data: {
        productId: product._id,
        name: product.name,
        previousStock: product.stock_quantity + quantity,
        currentStock: product.stock_quantity,
        quantityRemoved: quantity
      }
    });
  } catch (error) {
    next(error);
  }
};


const getLowStockProducts = async (req, res, next) => {
  try {
    const lowStockProducts = await Product.aggregate([
      {
        $match: {
          $expr: { $lte: ['$stock_quantity', '$low_stock_threshold'] }
        }
      },
      {
        $project: {
          __v: 0
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      message: 'Low stock products retrieved successfully',
      count: lowStockProducts.length,
      data: lowStockProducts
    });
  } catch (error) {
    next(error);
  }
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addStock,
  removeStock,
  getLowStockProducts
};
