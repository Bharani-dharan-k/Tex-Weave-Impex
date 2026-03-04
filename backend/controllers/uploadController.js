import fs from 'fs';
import csv from 'csv-parser';
import XLSX from 'xlsx';
import Product from '../models/Product.js';
import Sales from '../models/Sales.js';
import Inventory from '../models/Inventory.js';

// Helper function to validate date
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Helper function to parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// Helper function to parse Excel file
const parseExcel = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    return data;
  } catch (error) {
    throw new Error('Error parsing Excel file: ' + error.message);
  }
};

// Upload and process product data
export const uploadProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = req.file.originalname.split('.').pop().toLowerCase();

    // Parse file based on extension
    let data;
    if (fileExt === 'csv') {
      data = await parseCSV(filePath);
    } else {
      data = parseExcel(filePath);
    }

    // Validate and process data
    const validProducts = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // +2 for header row and 0-based index

      // Validate required fields
      if (!row.productId || !row.name || !row.costPrice || !row.sellingPrice) {
        errors.push(`Row ${rowNum}: Missing required fields`);
        continue;
      }

      // Validate numeric fields
      const costPrice = parseFloat(row.costPrice);
      const sellingPrice = parseFloat(row.sellingPrice);
      const reorderLevel = parseFloat(row.reorderLevel) || 10;

      if (isNaN(costPrice) || costPrice < 0) {
        errors.push(`Row ${rowNum}: Invalid cost price`);
        continue;
      }

      if (isNaN(sellingPrice) || sellingPrice < 0) {
        errors.push(`Row ${rowNum}: Invalid selling price`);
        continue;
      }

      if (isNaN(reorderLevel) || reorderLevel < 0) {
        errors.push(`Row ${rowNum}: Invalid reorder level`);
        continue;
      }

      validProducts.push({
        productId: String(row.productId).trim().toUpperCase(),
        name: String(row.name).trim(),
        category: row.category || 'Other',
        costPrice,
        sellingPrice,
        reorderLevel,
        description: row.description || '',
        unit: row.unit || 'meters'
      });
    }

    // Bulk upsert products
    let successCount = 0;
    let updateCount = 0;

    for (const product of validProducts) {
      try {
        const result = await Product.findOneAndUpdate(
          { productId: product.productId },
          product,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        
        if (result) {
          successCount++;
          // Check if it was an update
          const existing = await Product.findOne({ productId: product.productId });
          if (existing && existing.createdAt < result.updatedAt) {
            updateCount++;
          }
        }
      } catch (error) {
        errors.push(`Product ${product.productId}: ${error.message}`);
      }
    }

    // Delete the uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: 'Products upload completed',
      totalRows: data.length,
      successCount,
      newCount: successCount - updateCount,
      updateCount,
      errorCount: errors.length,
      errors: errors.slice(0, 10) // Return first 10 errors
    });

  } catch (error) {
    console.error('Error uploading products:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: 'Error processing file', 
      error: error.message 
    });
  }
};

// Upload and process sales data
export const uploadSales = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = req.file.originalname.split('.').pop().toLowerCase();

    // Parse file
    let data;
    if (fileExt === 'csv') {
      data = await parseCSV(filePath);
    } else {
      data = parseExcel(filePath);
    }

    const validSales = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2;

      // Validate required fields
      if (!row.invoiceId || !row.productId || !row.quantitySold || !row.totalAmount) {
        errors.push(`Row ${rowNum}: Missing required fields`);
        continue;
      }

      // Validate numeric fields
      const quantitySold = parseFloat(row.quantitySold);
      const totalAmount = parseFloat(row.totalAmount);
      const unitPrice = parseFloat(row.unitPrice) || (totalAmount / quantitySold);
      const costPrice = parseFloat(row.costPrice) || 0;

      if (isNaN(quantitySold) || quantitySold <= 0) {
        errors.push(`Row ${rowNum}: Invalid quantity sold`);
        continue;
      }

      if (isNaN(totalAmount) || totalAmount < 0) {
        errors.push(`Row ${rowNum}: Invalid total amount`);
        continue;
      }

      // Validate sale date
      let saleDate = new Date();
      if (row.saleDate) {
        saleDate = new Date(row.saleDate);
        if (!isValidDate(row.saleDate)) {
          errors.push(`Row ${rowNum}: Invalid sale date`);
          continue;
        }
      }

      validSales.push({
        invoiceId: String(row.invoiceId).trim().toUpperCase(),
        productId: String(row.productId).trim().toUpperCase(),
        productName: row.productName || '',
        quantitySold,
        unitPrice,
        totalAmount,
        costPrice,
        saleDate,
        customerName: row.customerName || '',
        region: row.region || 'Central',
        paymentStatus: row.paymentStatus || 'Paid',
        salesPerson: row.salesPerson || ''
      });
    }

    // Bulk insert sales
    let successCount = 0;

    for (const sale of validSales) {
      try {
        const result = await Sales.findOneAndUpdate(
          { invoiceId: sale.invoiceId },
          sale,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        
        if (result) {
          successCount++;
          
          // Update inventory last sale date
          await Inventory.findOneAndUpdate(
            { productId: sale.productId },
            { lastSaleDate: sale.saleDate },
            { upsert: false }
          );
        }
      } catch (error) {
        errors.push(`Invoice ${sale.invoiceId}: ${error.message}`);
      }
    }

    // Delete the uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: 'Sales upload completed',
      totalRows: data.length,
      successCount,
      errorCount: errors.length,
      errors: errors.slice(0, 10)
    });

  } catch (error) {
    console.error('Error uploading sales:', error);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: 'Error processing file', 
      error: error.message 
    });
  }
};

// Upload and process inventory data
export const uploadInventory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = req.file.originalname.split('.').pop().toLowerCase();

    // Parse file
    let data;
    if (fileExt === 'csv') {
      data = await parseCSV(filePath);
    } else {
      data = parseExcel(filePath);
    }

    const validInventory = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2;

      // Validate required fields
      if (!row.productId || row.quantityInStock === undefined) {
        errors.push(`Row ${rowNum}: Missing required fields`);
        continue;
      }

      const quantityInStock = parseFloat(row.quantityInStock);
      const reorderLevel = parseFloat(row.reorderLevel) || 10;
      const maxStockLevel = parseFloat(row.maxStockLevel) || null;

      if (isNaN(quantityInStock) || quantityInStock < 0) {
        errors.push(`Row ${rowNum}: Invalid quantity in stock`);
        continue;
      }

      validInventory.push({
        productId: String(row.productId).trim().toUpperCase(),
        productName: row.productName || '',
        quantityInStock,
        reorderLevel,
        maxStockLevel,
        warehouseLocation: row.warehouseLocation || 'Main Warehouse',
        lastRestockDate: row.lastRestockDate ? new Date(row.lastRestockDate) : null,
        lastUpdated: new Date()
      });
    }

    // Bulk upsert inventory
    let successCount = 0;

    for (const inventory of validInventory) {
      try {
        await Inventory.findOneAndUpdate(
          { productId: inventory.productId },
          inventory,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        successCount++;
      } catch (error) {
        errors.push(`Product ${inventory.productId}: ${error.message}`);
      }
    }

    // Delete the uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: 'Inventory upload completed',
      totalRows: data.length,
      successCount,
      errorCount: errors.length,
      errors: errors.slice(0, 10)
    });

  } catch (error) {
    console.error('Error uploading inventory:', error);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: 'Error processing file', 
      error: error.message 
    });
  }
};
