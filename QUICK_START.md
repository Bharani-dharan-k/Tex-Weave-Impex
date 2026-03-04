# 🚀 Quick Start Guide - Tex Weave Impex Analytics

## Step 1: Start Backend Server

```bash
cd backend
node server.js
```

✅ Server should start on port 5000
✅ MongoDB should connect successfully
✅ You should see: "Server running on port 5000" and "MongoDB Connected"

## Step 2: Start Frontend Development Server

```bash
cd frontend
npm run dev
```

✅ Vite server should start on port 5173
✅ Open browser to http://localhost:5173

## Step 3: Login to Admin Dashboard

1. Navigate to http://localhost:5173
2. Click "Login" or go to http://localhost:5173/login
3. Use your admin credentials
4. You'll be redirected to the Dashboard

## Step 4: Access Analytics Features

### Option 1: From Dashboard
1. In the Dashboard, click on the "Data Analytics" tab (7th tab)
2. You'll see 6 quick access cards:
   - Analytics Dashboard
   - Data Upload
   - Sales Analytics
   - Inventory Analytics
   - Product Performance
   - Reports

### Option 2: Direct Navigation
Navigate directly to these URLs:
- **Analytics Dashboard**: http://localhost:5173/analytics-dashboard
- **Data Upload**: http://localhost:5173/data-upload
- **Sales Analytics**: http://localhost:5173/analytics/sales
- **Inventory Analytics**: http://localhost:5173/analytics/inventory
- **Product Performance**: http://localhost:5173/analytics/products

## Step 5: Upload Sample Data

### 5.1: Create Sample Product Data

Create a file named `products.csv`:
```csv
productId,name,category,costPrice,sellingPrice,reorderLevel,description,unit
PROD001,Cotton Plain White,Cotton,500,750,10,100% cotton fabric,meters
PROD002,Silk Royal Blue,Silk,1200,1800,5,Premium silk fabric,meters
PROD003,Polyester Black,Polyester,300,450,15,Durable polyester,meters
PROD004,Wool Gray,Wool,800,1200,8,Warm wool fabric,meters
PROD005,Linen Beige,Linen,600,900,12,Natural linen,meters
```

### 5.2: Create Sample Sales Data

Create a file named `sales.csv`:
```csv
invoiceId,productId,productName,quantitySold,unitPrice,totalAmount,costPrice,saleDate,customerName,region,paymentStatus,salesPerson
INV001,PROD001,Cotton Plain White,100,750,75000,500,2024-01-15,ABC Textiles,North,Paid,John Doe
INV002,PROD002,Silk Royal Blue,50,1800,90000,1200,2024-01-16,XYZ Garments,South,Paid,Jane Smith
INV003,PROD003,Polyester Black,200,450,90000,300,2024-01-17,Fashion Hub,East,Paid,Mike Johnson
INV004,PROD001,Cotton Plain White,150,750,112500,500,2024-01-18,Style Store,West,Paid,Sarah Williams
INV005,PROD004,Wool Gray,75,1200,90000,800,2024-01-19,Comfort Clothes,Central,Paid,Tom Brown
```

### 5.3: Create Sample Inventory Data

Create a file named `inventory.csv`:
```csv
productId,productName,quantityInStock,reorderLevel,maxStockLevel,warehouseLocation,lastRestockDate
PROD001,Cotton Plain White,500,10,1000,Main Warehouse,2024-01-01
PROD002,Silk Royal Blue,200,5,500,Main Warehouse,2024-01-05
PROD003,Polyester Black,800,15,1500,Warehouse B,2024-01-10
PROD004,Wool Gray,150,8,300,Main Warehouse,2024-01-08
PROD005,Linen Beige,50,12,500,Warehouse B,2024-01-03
```

### 5.4: Upload the Files

1. Go to http://localhost:5173/data-upload
2. Select "Products" from dropdown
3. Click "Download Template" to see the format
4. Click "Choose File" and select your `products.csv`
5. Click "Upload File"
6. Repeat for Sales and Inventory data

## Step 6: Explore Analytics

### View Analytics Dashboard
1. Go to http://localhost:5173/analytics-dashboard
2. You'll see:
   - 6 KPI cards showing key metrics
   - Top 5 performing products table
   - Low stock alerts
   - Quick links to detailed analytics

### Explore Sales Analytics
1. Go to http://localhost:5173/analytics/sales
2. View:
   - Sales trends over time
   - Product-wise sales breakdown
   - Category and regional analysis
   - Top and least selling products

### Check Inventory Status
1. Go to http://localhost:5173/analytics/inventory
2. Monitor:
   - Current stock levels
   - Low stock alerts
   - Inventory value by category
   - Stock movement history

### Analyze Product Performance
1. Go to http://localhost:5173/analytics/products
2. Analyze:
   - Profitability by product
   - Slow-moving and dead stock
   - Demand forecasting
   - High/low profit products

### Generate Reports
1. Click on any "Download Report" button
2. Excel files will be downloaded with comprehensive data
3. Available reports:
   - Sales Report
   - Inventory Report
   - Slow Stock Report
   - Profitability Report
   - Comprehensive Report (multi-sheet)

## Step 7: Test API Endpoints

You can test the backend APIs directly using these curl commands:

### Get Sales Overview
```bash
curl http://localhost:5000/api/analytics/sales/overview
```

### Get Product-wise Sales
```bash
curl http://localhost:5000/api/analytics/sales/product-wise
```

### Get Inventory Overview
```bash
curl http://localhost:5000/api/analytics/inventory/overview
```

### Get Low Stock Alerts
```bash
curl http://localhost:5000/api/analytics/inventory/low-stock-alerts
```

### Get Slow Moving Stock
```bash
curl "http://localhost:5000/api/analytics/slow-stock/slow-moving?days=90"
```

### Get Demand Forecast
```bash
curl "http://localhost:5000/api/analytics/forecast/product?productId=PROD001"
```

## 📊 Dashboard Features Overview

### Main Dashboard Tabs
1. **Business Overview** - Traditional business metrics
2. **Product Analytics** - Product performance charts
3. **Process Flow** - Manufacturing process
4. **Time & Throughput** - Production metrics
5. **Quality Control** - Quality assurance
6. **Packing & Dispatch** - Logistics tracking
7. **Data Analytics** ⭐ NEW - Complete analytics hub

### Analytics Hub Features
- **Analytics Dashboard** - Comprehensive overview with KPIs
- **Data Upload** - Import CSV/Excel files
- **Sales Analytics** - Detailed sales insights
- **Inventory Analytics** - Stock management
- **Product Performance** - Profitability & forecasting
- **Reports** - Excel export functionality

## 🔧 Troubleshooting

### Backend not starting?
- Check if MongoDB is running
- Verify `.env` file exists in backend folder
- Check if port 5000 is available
- Run: `cd backend && npm install`

### Frontend not loading?
- Check if backend is running on port 5000
- Verify frontend dependencies: `cd frontend && npm install`
- Check browser console for errors
- Clear browser cache

### File upload failing?
- Check file format (CSV, XLS, XLSX only)
- Verify file size (max 10MB)
- Ensure column headers match template
- Check for data validation errors in response

### No data showing?
- Upload sample data first using Data Upload page
- Check browser network tab for API errors
- Verify MongoDB connection
- Check backend terminal for errors

## 🎯 Next Steps

1. ✅ Upload sample data
2. ✅ Explore all analytics modules
3. ✅ Generate and review reports
4. ✅ Test forecasting with your products
5. ✅ Analyze slow-moving stock
6. ✅ Review profitability metrics

## 📝 Important Notes

- **Default Analysis Period**: 90 days for slow stock
- **Currency**: All amounts in INR (₹)
- **Date Format**: YYYY-MM-DD or MM/DD/YYYY
- **File Size Limit**: 10MB per upload
- **Supported Formats**: CSV, XLS, XLSX

## 🎓 Learning Resources

- Check [ANALYTICS_IMPLEMENTATION.md](ANALYTICS_IMPLEMENTATION.md) for detailed documentation
- Review controller files for API logic
- Examine React components for UI patterns
- Study MongoDB aggregation in analytics controllers

---

**Ready to analyze your textile business data! 📊🚀**
