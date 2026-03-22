import express from 'express';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/imageUploadMiddleware.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all active products
// @access  Public/Protected
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 50 } = req.query;
    
    let query = { isActive: true };
    
    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Search by name or productId
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { productId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const [products, totalCount] = await Promise.all([
      Product.find(query)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
      Product.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      count: products.length,
      totalCount,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
});

// @route   GET /api/products/categories/list
// @desc    Get all product categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
});

// @route   POST /api/products
// @desc    Create a new product with image upload
// @access  Protected (Admin only)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const {
      productId,
      name,
      category,
      costPrice,
      sellingPrice,
      reorderLevel,
      description,
      unit
    } = req.body;

    // Validate required fields
    if (!productId || !name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, name, and category are required'
      });
    }

    if (!costPrice || !sellingPrice) {
      return res.status(400).json({
        success: false,
        message: 'Cost price and selling price are required'
      });
    }

    // Convert productId to uppercase for checking
    const upperProductId = productId.toUpperCase();

    // Check if product ID already exists
    const existingProduct = await Product.findOne({ productId: upperProductId });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: `Product ID '${upperProductId}' already exists`
      });
    }

    // Handle image upload to Cloudinary
    let imageData = {
      url: '',
      publicId: ''
    };

    if (req.file) {
      try {
        // Upload to Cloudinary using a promise-based approach
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'products',
              resource_type: 'image',
              transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });

        imageData = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id
        };
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image. Please check your Cloudinary configuration.'
        });
      }
    }

    // Create new product
    const product = await Product.create({
      productId: upperProductId,
      name,
      category,
      costPrice: parseFloat(costPrice),
      sellingPrice: parseFloat(sellingPrice),
      reorderLevel: reorderLevel ? parseInt(reorderLevel) : 10,
      description,
      unit: unit || 'meters',
      image: imageData,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product ID already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error creating product'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product with optional image upload
// @access  Protected (Admin only)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      category,
      costPrice,
      sellingPrice,
      reorderLevel,
      description,
      unit,
      isActive
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle image upload if provided
    if (req.file) {
      try {
        // Delete old image from Cloudinary if it exists
        if (product.image && product.image.publicId) {
          await cloudinary.uploader.destroy(product.image.publicId);
        }

        // Upload new image
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'products',
              resource_type: 'image',
              transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });

        product.image = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id
        };
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image'
        });
      }
    }

    // Update fields
    if (name) product.name = name;
    if (category) product.category = category;
    if (costPrice !== undefined) product.costPrice = costPrice;
    if (sellingPrice !== undefined) product.sellingPrice = sellingPrice;
    if (reorderLevel !== undefined) product.reorderLevel = reorderLevel;
    if (description !== undefined) product.description = description;
    if (unit) product.unit = unit;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating product'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (soft delete by setting isActive to false)
// @access  Protected (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Optionally delete image from Cloudinary
    if (product.image && product.image.publicId) {
      try {
        await cloudinary.uploader.destroy(product.image.publicId);
      } catch (deleteError) {
        console.error('Error deleting image from Cloudinary:', deleteError);
        // Continue with product deletion even if image deletion fails
      }
    }

    // Soft delete - set isActive to false instead of removing
    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
});

export default router;
