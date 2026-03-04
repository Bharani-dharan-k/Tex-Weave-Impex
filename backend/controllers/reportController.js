import XLSX from 'xlsx';
import Sales from '../models/Sales.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';

// Helper function to generate Excel file
const generateExcelFile = (data, sheetName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

// Generate sales report
export const generateSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, format = 'xlsx' } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        saleDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // Get sales data
    const salesData = await Sales.find(dateFilter)
      .sort({ saleDate: -1 })
      .lean();

    // Format data for export
    const formattedData = salesData.map(sale => ({
      'Invoice ID': sale.invoiceId,
      'Product ID': sale.productId,
      'Product Name': sale.productName,
      'Quantity Sold': sale.quantitySold,
      'Unit Price': sale.unitPrice,
      'Total Amount': sale.totalAmount,
      'Cost Price': sale.costPrice || 'N/A',
      'Profit': sale.costPrice ? (sale.unitPrice - sale.costPrice) * sale.quantitySold : 'N/A',
      'Sale Date': new Date(sale.saleDate).toLocaleDateString(),
      'Customer Name': sale.customerName || 'N/A',
      'Region': sale.region,
      'Payment Status': sale.paymentStatus,
      'Sales Person': sale.salesPerson || 'N/A'
    }));

    // Generate Excel file
    const buffer = generateExcelFile(formattedData, 'Sales Report');

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=sales-report-${Date.now()}.xlsx`);
    
    res.send(buffer);

  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).json({ message: 'Error generating sales report', error: error.message });
  }
};

// Generate inventory report
export const generateInventoryReport = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};
    if (status) {
      if (status === 'low') {
        filter = { $expr: { $lte: ['$quantityInStock', '$reorderLevel'] } };
      } else if (status === 'out') {
        filter = { quantityInStock: 0 };
      }
    }

    // Get inventory data with product details
    const inventoryData = await Inventory.aggregate([
      { $match: filter },
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
                  'Normal'
                ]
              }
            ]
          },
          inventoryValue: {
            $multiply: ['$quantityInStock', '$product.costPrice']
          }
        }
      },
      { $sort: { quantityInStock: 1 } }
    ]);

    // Format data for export
    const formattedData = inventoryData.map(item => ({
      'Product ID': item.productId,
      'Product Name': item.productName || item.product?.name,
      'Category': item.product?.category || 'N/A',
      'Quantity in Stock': item.quantityInStock,
      'Reorder Level': item.reorderLevel,
      'Stock Status': item.stockStatus,
      'Warehouse Location': item.warehouseLocation,
      'Cost Price': item.product?.costPrice || 'N/A',
      'Inventory Value': item.inventoryValue?.toFixed(2) || '0',
      'Last Restock Date': item.lastRestockDate ? new Date(item.lastRestockDate).toLocaleDateString() : 'N/A',
      'Last Sale Date': item.lastSaleDate ? new Date(item.lastSaleDate).toLocaleDateString() : 'N/A',
      'Last Updated': new Date(item.lastUpdated).toLocaleDateString()
    }));

    // Generate Excel file
    const buffer = generateExcelFile(formattedData, 'Inventory Report');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=inventory-report-${Date.now()}.xlsx`);
    
    res.send(buffer);

  } catch (error) {
    console.error('Error generating inventory report:', error);
    res.status(500).json({ message: 'Error generating inventory report', error: error.message });
  }
};

// Generate slow-moving stock report
export const generateSlowStockReport = async (req, res) => {
  try {
    const { days = 90 } = req.query;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    // Get all inventory
    const allInventory = await Inventory.find({
      quantityInStock: { $gt: 0 }
    }).lean();

    const slowMovingData = [];

    for (const item of allInventory) {
      const recentSales = await Sales.find({
        productId: item.productId,
        saleDate: { $gte: cutoffDate }
      });

      const totalSold = recentSales.reduce((sum, sale) => sum + sale.quantitySold, 0);
      const salesCount = recentSales.length;

      const product = await Product.findOne({ productId: item.productId });

      let classification = 'Normal';
      if (salesCount === 0) {
        classification = 'Dead Stock';
      } else if (totalSold < item.reorderLevel) {
        classification = 'Slow Moving';
      }

      if (classification !== 'Normal') {
        const blockedValue = product ? item.quantityInStock * product.costPrice : 0;
        
        slowMovingData.push({
          'Product ID': item.productId,
          'Product Name': item.productName || product?.name,
          'Category': product?.category || 'N/A',
          'Quantity in Stock': item.quantityInStock,
          'Sales in Period': totalSold,
          'Transactions': salesCount,
          'Classification': classification,
          'Days Since Last Sale': item.lastSaleDate 
            ? Math.floor((new Date() - new Date(item.lastSaleDate)) / (1000 * 60 * 60 * 24))
            : 'Never',
          'Blocked Value': blockedValue.toFixed(2),
          'Cost Price': product?.costPrice || 'N/A',
          'Selling Price': product?.sellingPrice || 'N/A',
          'Analysis Period': `${days} days`
        });
      }
    }

    // Sort by blocked value
    slowMovingData.sort((a, b) => parseFloat(b['Blocked Value']) - parseFloat(a['Blocked Value']));

    // Generate Excel file
    const buffer = generateExcelFile(slowMovingData, 'Slow Moving Stock');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=slow-stock-report-${Date.now()}.xlsx`);
    
    res.send(buffer);

  } catch (error) {
    console.error('Error generating slow stock report:', error);
    res.status(500).json({ message: 'Error generating slow stock report', error: error.message });
  }
};

// Generate profitability report
export const generateProfitabilityReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        saleDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const profitabilityData = await Sales.aggregate([
      {
        $match: {
          ...dateFilter,
          costPrice: { $exists: true, $gt: 0 }
        }
      },
      {
        $group: {
          _id: '$productId',
          productName: { $first: '$productName' },
          totalRevenue: { $sum: '$totalAmount' },
          totalCost: {
            $sum: { $multiply: ['$costPrice', '$quantitySold'] }
          },
          totalProfit: {
            $sum: {
              $multiply: [
                { $subtract: ['$unitPrice', '$costPrice'] },
                '$quantitySold'
              ]
            }
          },
          quantitySold: { $sum: '$quantitySold' },
          transactionCount: { $sum: 1 }
        }
      },
      {
        $addFields: {
          profitMargin: {
            $cond: [
              { $gt: ['$totalRevenue', 0] },
              { $multiply: [{ $divide: ['$totalProfit', '$totalRevenue'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { totalProfit: -1 } }
    ]);

    // Enrich with product details
    const formattedData = await Promise.all(
      profitabilityData.map(async (item) => {
        const product = await Product.findOne({ productId: item._id });
        return {
          'Product ID': item._id,
          'Product Name': item.productName,
          'Category': product?.category || 'N/A',
          'Quantity Sold': item.quantitySold,
          'Total Revenue': item.totalRevenue.toFixed(2),
          'Total Cost': item.totalCost.toFixed(2),
          'Total Profit': item.totalProfit.toFixed(2),
          'Profit Margin %': item.profitMargin.toFixed(2),
          'Transactions': item.transactionCount,
          'Avg Profit/Unit': (item.totalProfit / item.quantitySold).toFixed(2)
        };
      })
    );

    // Generate Excel file
    const buffer = generateExcelFile(formattedData, 'Profitability Report');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=profitability-report-${Date.now()}.xlsx`);
    
    res.send(buffer);

  } catch (error) {
    console.error('Error generating profitability report:', error);
    res.status(500).json({ message: 'Error generating profitability report', error: error.message });
  }
};

// Generate comprehensive analytics report
export const generateComprehensiveReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        saleDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // Create a workbook with multiple sheets
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Sales Summary
    const salesSummary = await Sales.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalQuantity: { $sum: '$quantitySold' },
          totalTransactions: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    const summarySheet = XLSX.utils.json_to_sheet([{
      'Metric': 'Total Revenue',
      'Value': salesSummary[0]?.totalRevenue.toFixed(2) || 0
    }, {
      'Metric': 'Total Quantity Sold',
      'Value': salesSummary[0]?.totalQuantity || 0
    }, {
      'Metric': 'Total Transactions',
      'Value': salesSummary[0]?.totalTransactions || 0
    }, {
      'Metric': 'Average Order Value',
      'Value': salesSummary[0]?.avgOrderValue.toFixed(2) || 0
    }]);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Sheet 2: Top Products
    const topProducts = await Sales.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$productId',
          productName: { $first: '$productName' },
          totalRevenue: { $sum: '$totalAmount' },
          totalQuantity: { $sum: '$quantitySold' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 20 }
    ]);

    const topProductsFormatted = topProducts.map(p => ({
      'Product ID': p._id,
      'Product Name': p.productName,
      'Total Revenue': p.totalRevenue.toFixed(2),
      'Total Quantity': p.totalQuantity
    }));
    const topProductsSheet = XLSX.utils.json_to_sheet(topProductsFormatted);
    XLSX.utils.book_append_sheet(workbook, topProductsSheet, 'Top Products');

    // Sheet 3: Inventory Status
    const lowStock = await Inventory.find({
      $expr: { $lte: ['$quantityInStock', '$reorderLevel'] }
    }).limit(50).lean();

    const lowStockFormatted = lowStock.map(item => ({
      'Product ID': item.productId,
      'Product Name': item.productName,
      'Quantity': item.quantityInStock,
      'Reorder Level': item.reorderLevel
    }));
    const inventorySheet = XLSX.utils.json_to_sheet(lowStockFormatted);
    XLSX.utils.book_append_sheet(workbook, inventorySheet, 'Low Stock Items');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=comprehensive-report-${Date.now()}.xlsx`);
    
    res.send(buffer);

  } catch (error) {
    console.error('Error generating comprehensive report:', error);
    res.status(500).json({ message: 'Error generating comprehensive report', error: error.message });
  }
};
