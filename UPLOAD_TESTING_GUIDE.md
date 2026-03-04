# Data Upload Testing Guide

## Setup Instructions

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
```

### 2. Start Frontend Server
```bash
cd frontend
npm install
npm run dev
```

## Testing the Upload Feature

### Step 1: Login
1. Navigate to http://localhost:5173/login
2. Login with valid credentials

### Step 2: Access Data Upload Page
1. After login, navigate to the Data Upload page
2. URL should be: http://localhost:5173/data-upload

### Step 3: Download Template
1. Select data type (Products, Sales, or Inventory)
2. Click "Download Template" button
3. Template CSV file will be downloaded

### Step 4: Prepare Data File
Fill in the template with your data following these formats:

#### Products Template
```csv
productId,name,category,costPrice,sellingPrice,reorderLevel,description,unit
PROD001,Cotton Fabric,Cotton,500,750,10,High quality cotton,meters
PROD002,Polyester Blend,Polyester,400,650,15,Durable polyester fabric,meters
```

#### Sales Template
```csv
invoiceId,productId,productName,quantitySold,unitPrice,totalAmount,costPrice,saleDate,customerName,region,paymentStatus,salesPerson
INV001,PROD001,Cotton Fabric,100,750,75000,500,2024-01-15,ABC Corp,North,Paid,John Doe
INV002,PROD002,Polyester Blend,50,650,32500,400,2024-01-16,XYZ Ltd,South,Paid,Jane Smith
```

#### Inventory Template
```csv
productId,productName,quantityInStock,reorderLevel,maxStockLevel,warehouseLocation,lastRestockDate
PROD001,Cotton Fabric,500,10,1000,Main Warehouse,2024-01-01
PROD002,Polyester Blend,300,15,800,Main Warehouse,2024-01-05
```

### Step 5: Upload File
1. Select the data type matching your file
2. Click "Choose File" and select your CSV/Excel file
3. Click "Upload File"
4. Watch the progress bar
5. Review the upload results

## API Endpoints

### Upload Products
- **Endpoint:** `POST /api/upload/products`
- **Auth:** Required (Bearer token)
- **Content-Type:** multipart/form-data
- **Field:** file (CSV or Excel)

### Upload Sales
- **Endpoint:** `POST /api/upload/sales`
- **Auth:** Required (Bearer token)
- **Content-Type:** multipart/form-data
- **Field:** file (CSV or Excel)

### Upload Inventory
- **Endpoint:** `POST /api/upload/inventory`
- **Auth:** Required (Bearer token)
- **Content-Type:** multipart/form-data
- **Field:** file (CSV or Excel)

## Testing with cURL

### 1. Login and Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### 2. Upload Products File
```bash
curl -X POST http://localhost:5000/api/upload/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@products.csv"
```

### 3. Upload Sales File
```bash
curl -X POST http://localhost:5000/api/upload/sales \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@sales.csv"
```

### 4. Upload Inventory File
```bash
curl -X POST http://localhost:5000/api/upload/inventory \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@inventory.csv"
```

## Expected Response Format

### Success Response
```json
{
  "message": "Products upload completed",
  "totalRows": 10,
  "successCount": 9,
  "newCount": 5,
  "updateCount": 4,
  "errorCount": 1,
  "errors": [
    "Row 3: Missing required fields"
  ]
}
```

### Error Response
```json
{
  "message": "Error processing file",
  "error": "Invalid file format"
}
```

## Troubleshooting

### Issue: "Not authorized, no token"
- **Solution:** Ensure you're logged in and the token is being sent in the Authorization header

### Issue: "Only CSV and Excel files are allowed"
- **Solution:** Check file extension (.csv, .xlsx, .xls) and MIME type

### Issue: "Missing required fields"
- **Solution:** Ensure all required columns are present in your CSV/Excel file

### Issue: "File too large"
- **Solution:** File size limit is 10MB. Split large files into smaller chunks

### Issue: Upload progress stays at 0%
- **Solution:** Check network connection and backend server status

## File Requirements

### Products File Required Fields
- productId (string, unique)
- name (string)
- costPrice (number, >= 0)
- sellingPrice (number, >= 0)

### Sales File Required Fields
- invoiceId (string, unique)
- productId (string)
- quantitySold (number, > 0)
- totalAmount (number, >= 0)

### Inventory File Required Fields
- productId (string, unique)
- quantityInStock (number, >= 0)

## Notes
- Files are processed row by row
- Duplicate productId/invoiceId will update existing records
- Validation errors are returned with row numbers
- Maximum 10 errors are shown in the response
- Uploaded files are automatically deleted after processing
