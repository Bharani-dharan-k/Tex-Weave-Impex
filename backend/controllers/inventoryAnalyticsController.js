import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
import Sales from '../models/Sales.js';

// Get inventory overview
export const getInventoryOverview = async (req, res) => {
  try {
    // Get total products
    const totalProducts = await Inventory.countDocuments();

    // Get low stock items
    const lowStock = await Inventory.countDocuments({
      $expr: { $lte: ['$quantityInStock', '$reorderLevel'] }
    });

    // Get out of stock items
    const outOfStock = await Inventory.countDocuments({ quantityInStock: 0 });

    // Get overstock items (if maxStockLevel is defined)
    const overstock = await Inventory.countDocuments({
      maxStockLevel: { $exists: true },
      $expr: { $gte: ['$quantityInStock', { $multiply: ['$maxStockLevel', 0.9] }] }
    });

    // Calculate total inventory value
    const inventoryValue = await Inventory.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: 'productId',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: null,
          totalValue: {
            $sum: { $multiply: ['$quantityInStock', '$product.costPrice'] }
          },
          totalQuantity: { $sum: '$quantityInStock' }
        }
      }
    ]);

    res.status(200).json({
      totalProducts,
      lowStock,
      outOfStock,
      overstock,
      totalValue: inventoryValue[0]?.totalValue || 0,
      totalQuantity: inventoryValue[0]?.totalQuantity || 0
    });

  } catch (error) {
    console.error('Error getting inventory overview:', error);
    res.status(500).json({ message: 'Error fetching inventory overview', error: error.message });
  }
};

// Get current stock levels
export const getCurrentStockLevels = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    
    // Build filter
    let filter = {};
    
    // Join with products for category filter
    const inventory = await Inventory.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: 'productId',
          as: 'product'
        }
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          stockStatus: {
            $cond: [
              { $eq: ['$quantityInStock', 0] },
              'Out of Stock',
              {
                $cond: [
                  { $lte: ['$quantityInStock', '$reorderLevel'] },
                  'Low Stock',
                  {
                    $cond: [
                      {
                        $and: [
                          { $ne: ['$maxStockLevel', null] },
                          { $gte: ['$quantityInStock', { $multiply: ['$maxStockLevel', 0.9] }] }
                        ]
                      },
                      'Overstock',
                      'Normal'
                    ]
                  }
                ]
              }
            ]
          }
        }
      },
      {
        $match: {
          ...(category && { 'product.category': category }),
          ...(status && { stockStatus: status }),
          ...(search && {
            $or: [
              { productId: new RegExp(search, 'i') },
              { productName: new RegExp(search, 'i') }
            ]
          })
        }
      },
      {
        $project: {
          productId: 1,
          productName: 1,
          quantityInStock: 1,
          reorderLevel: 1,
          maxStockLevel: 1,
          stockStatus: 1,
          lastRestockDate: 1,
          lastSaleDate: 1,
          warehouseLocation: 1,
          category: '$product.category',
          costPrice: '$product.costPrice',
          sellingPrice: '$product.sellingPrice',
          inventoryValue: { $multiply: ['$quantityInStock', '$product.costPrice'] }
        }
      },
      { $sort: { stockStatus: 1, quantityInStock: 1 } }
    ]);

    res.status(200).json(inventory);

  } catch (error) {
    console.error('Error getting stock levels:', error);
    res.status(500).json({ message: 'Error fetching stock levels', error: error.message });
  }
};

// Get low stock alerts
export const getLowStockAlerts = async (req, res) => {
  try {
    const alerts = await Inventory.aggregate([
      {
        $match: {
          $expr: { $lte: ['$quantityInStock', '$reorderLevel'] }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: 'productId',
          as: 'product'
        }
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          productId: 1,
          productName: 1,
          quantityInStock: 1,
          reorderLevel: 1,
          category: '$product.category',
          costPrice: '$product.costPrice',
          deficit: { $subtract: ['$reorderLevel', '$quantityInStock'] },
          estimatedReorderCost: {
            $multiply: [
              { $subtract: ['$reorderLevel', '$quantityInStock'] },
              '$product.costPrice'
            ]
          }
        }
      },
      { $sort: { quantityInStock: 1 } }
    ]);

    res.status(200).json(alerts);

  } catch (error) {
    console.error('Error getting low stock alerts:', error);
    res.status(500).json({ message: 'Error fetching low stock alerts', error: error.message });
  }
};

// Get inventory value by category
export const getInventoryValueByCategory = async (req, res) => {
  try {
    const categoryValues = await Inventory.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: 'productId',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalQuantity: { $sum: '$quantityInStock' },
          totalValue: {
            $sum: { $multiply: ['$quantityInStock', '$product.costPrice'] }
          },
          productCount: { $sum: 1 }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    res.status(200).json(categoryValues);

  } catch (error) {
    console.error('Error getting inventory by category:', error);
    res.status(500).json({ message: 'Error fetching category inventory', error: error.message });
  }
};

// Get inventory turnover rate
export const getInventoryTurnover = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Default to last 90 days
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);

    const turnoverData = await Sales.aggregate([
      {
        $match: {
          saleDate: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$productId',
          totalSold: { $sum: '$quantitySold' }
        }
      },
      {
        $lookup: {
          from: 'inventories',
          localField: '_id',
          foreignField: 'productId',
          as: 'inventory'
        }
      },
      { $unwind: { path: '$inventory', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'productId',
          as: 'product'
        }
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          productId: '$_id',
          productName: '$product.name',
          category: '$product.category',
          totalSold: 1,
          currentStock: '$inventory.quantityInStock',
          turnoverRate: {
            $cond: [
              { $gt: ['$inventory.quantityInStock', 0] },
              { $divide: ['$totalSold', '$inventory.quantityInStock'] },
              0
            ]
          }
        }
      },
      { $sort: { turnoverRate: -1 } }
    ]);

    res.status(200).json(turnoverData);

  } catch (error) {
    console.error('Error calculating inventory turnover:', error);
    res.status(500).json({ message: 'Error calculating turnover', error: error.message });
  }
};

// Get stock movement history
export const getStockMovementHistory = async (req, res) => {
  try {
    const { productId, startDate, endDate } = req.query;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        saleDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // Get sales history for the product
    const salesHistory = await Sales.find({
      productId: productId.toUpperCase(),
      ...dateFilter
    })
      .sort({ saleDate: -1 })
      .select('invoiceId quantitySold totalAmount saleDate customerName');

    // Get current inventory
    const currentInventory = await Inventory.findOne({ productId: productId.toUpperCase() });

    res.status(200).json({
      currentStock: currentInventory?.quantityInStock || 0,
      salesHistory
    });

  } catch (error) {
    console.error('Error getting stock movement:', error);
    res.status(500).json({ message: 'Error fetching stock movement', error: error.message });
  }
};
