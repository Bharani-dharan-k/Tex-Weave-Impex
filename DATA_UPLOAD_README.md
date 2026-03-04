# Data Upload Feature - Complete Setup

## ✅ What's Been Implemented

### Backend Components

1. **Upload Routes** (`backend/routes/uploadRoutes.js`)
   - Protected with authentication middleware
   - Three endpoints: Products, Sales, Inventory
   - Uses multer for file handling

2. **Upload Controller** (`backend/controllers/uploadController.js`)
   - CSV and Excel file parsing
   - Data validation and error handling
   - Bulk upsert operations
   - Detailed error reporting

3. **Upload Middleware** (`backend/middleware/uploadMiddleware.js`)
   - File type validation (CSV, XLSX, XLS)
   - File size limit: 10MB
   - Automatic file cleanup
   - Unique filename generation

4. **Data Models**
   - Product.js - Product information
   - Sales.js - Sales transactions
   - Inventory.js - Stock levels

### Frontend Components

1. **DataUpload Component** (`frontend/src/Pages/DataUpload.jsx`)
   - File selection and validation
   - Upload progress tracking
   - Template download functionality
   - Success/error result display
   - Session expiry handling

2. **Analytics Service** (`frontend/src/services/analyticsService.js`)
   - API integration functions
   - Progress callback support
   - Error handling

3. **Styling** (`frontend/src/Pages/DataUpload.css`)
   - Professional UI design
   - Progress indicators
   - Responsive layout

## 🚀 How to Use

### 1. Start the Servers

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 2. Login to the Application
- Navigate to http://localhost:5173/login
- Use your credentials to login

### 3. Access Data Upload
- Go to the Data Upload page
- Select data type (Products/Sales/Inventory)
- Download template if needed

### 4. Upload Your Data
- Choose your CSV or Excel file
- Click Upload
- Review results

## 📊 Sample Data Available

Test files are provided in the `test_data/` folder:
- `products_sample.csv` - 10 sample products
- `sales_sample.csv` - 10 sample sales records
- `inventory_sample.csv` - 10 sample inventory records

## 🔧 Features

### File Processing
- ✅ CSV file parsing
- ✅ Excel file parsing (.xlsx, .xls)
- ✅ Row-by-row validation
- ✅ Automatic field type conversion
- ✅ Error collection and reporting

### Data Operations
- ✅ Create new records
- ✅ Update existing records (upsert)
- ✅ Bulk operations
- ✅ Transaction tracking

### User Experience
- ✅ Upload progress bar
- ✅ Real-time feedback
- ✅ Detailed error messages
- ✅ Template download
- ✅ Session management

### Security
- ✅ Authentication required
- ✅ File type validation
- ✅ File size limits
- ✅ Automatic file cleanup
- ✅ Input validation

## 📝 Data Format Requirements

### Products
**Required Fields:**
- productId (unique identifier)
- name
- costPrice (number >= 0)
- sellingPrice (number >= 0)

**Optional Fields:**
- category
- reorderLevel
- description
- unit

### Sales
**Required Fields:**
- invoiceId (unique identifier)
- productId
- quantitySold (number > 0)
- totalAmount (number >= 0)

**Optional Fields:**
- productName
- unitPrice
- costPrice
- saleDate
- customerName
- region
- paymentStatus
- salesPerson

### Inventory
**Required Fields:**
- productId (unique identifier)
- quantityInStock (number >= 0)

**Optional Fields:**
- productName
- reorderLevel
- maxStockLevel
- warehouseLocation
- lastRestockDate

## 🔍 API Endpoints

### Upload Products
```
POST /api/upload/products
Authorization: Bearer <token>
Content-Type: multipart/form-data
Body: file (CSV or Excel)
```

### Upload Sales
```
POST /api/upload/sales
Authorization: Bearer <token>
Content-Type: multipart/form-data
Body: file (CSV or Excel)
```

### Upload Inventory
```
POST /api/upload/inventory
Authorization: Bearer <token>
Content-Type: multipart/form-data
Body: file (CSV or Excel)
```

## 📦 Response Format

### Success Response
```json
{
  "message": "Products upload completed",
  "totalRows": 10,
  "successCount": 9,
  "newCount": 5,
  "updateCount": 4,
  "errorCount": 1,
  "errors": ["Row 3: Missing required fields"]
}
```

### Error Response
```json
{
  "message": "Error processing file",
  "error": "Invalid file format"
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **"Not authorized" error**
   - Ensure you're logged in
   - Check token expiration
   - Refresh the page and login again

2. **"File type not allowed"**
   - Use only .csv, .xlsx, or .xls files
   - Check file extension

3. **"Upload failed"**
   - Check file format matches template
   - Verify all required fields are present
   - Ensure numeric fields contain valid numbers

4. **"Row X: Missing required fields"**
   - Review the specific row in your file
   - Ensure all required columns have values
   - Check for empty cells

## 📋 Validation Rules

### Product Validation
- Product ID must be unique and non-empty
- Prices must be non-negative numbers
- Reorder level must be positive number

### Sales Validation
- Invoice ID must be unique and non-empty
- Quantity sold must be positive
- Total amount must be non-negative
- Sale date must be valid date format

### Inventory Validation
- Product ID must match existing product
- Stock quantity must be non-negative
- Reorder level must be positive (if provided)

## 🎯 Best Practices

1. **Before Uploading:**
   - Download the template
   - Fill data carefully
   - Validate manually first
   - Keep backup of original data

2. **Data Quality:**
   - Use consistent formatting
   - Avoid special characters in IDs
   - Use standard date format (YYYY-MM-DD)
   - Double-check numeric values

3. **Large Files:**
   - Split files over 5MB
   - Upload in batches
   - Monitor progress
   - Verify results after each batch

4. **Error Handling:**
   - Review error messages
   - Fix issues row by row
   - Re-upload corrected data
   - Keep track of successful uploads

## 📚 Additional Resources

- [Upload Testing Guide](./UPLOAD_TESTING_GUIDE.md)
- [API Documentation](./API_ENDPOINTS.md)
- Sample data files in `/test_data/` folder

## 🔐 Security Notes

- All upload endpoints require authentication
- Files are automatically deleted after processing
- Maximum file size: 10MB
- Only CSV and Excel formats accepted
- Input validation on all fields
