# 📡 API Endpoints Reference - Tex Weave Impex Analytics

## Base URL
```
http://localhost:5000
```

---

## 🔐 Authentication APIs

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@texweave.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

---

## 📤 Data Upload APIs

### Upload Products
```http
POST /api/upload/products
Content-Type: multipart/form-data

Form Data:
- file: (CSV/Excel file)
```

**Response:**
```json
{
  "message": "Products upload completed",
  "totalRows": 100,
  "successCount": 98,
  "newCount": 80,
  "updateCount": 18,
  "errorCount": 2,
  "errors": ["Row 5: Invalid cost price", "Row 23: Missing required fields"]
}
```

### Upload Sales
```http
POST /api/upload/sales
Content-Type: multipart/form-data

Form Data:
- file: (CSV/Excel file)
```

### Upload Inventory
```http
POST /api/upload/inventory
Content-Type: multipart/form-data

Form Data:
- file: (CSV/Excel file)
```

---

## 📊 Sales Analytics APIs

### Get Sales Overview
```http
GET /api/analytics/sales/overview
Query Params:
- startDate: 2024-01-01 (optional)
- endDate: 2024-12-31 (optional)
```

**Response:**
```json
{
  "sales": {
    "totalSales": 15000,
    "totalRevenue": 2500000,
    "totalTransactions": 450,
    "averageOrderValue": 5555.56
  },
  "profit": 750000,
  "inventoryValue": 1200000,
  "lowStockCount": 12
}
```

### Get Product-wise Sales
```http
GET /api/analytics/sales/product-wise
Query Params:
- startDate: (optional)
- endDate: (optional)
- limit: 20 (default)
```

### Get Sales Trends
```http
GET /api/analytics/sales/trends
Query Params:
- period: daily|weekly|monthly|yearly (default: monthly)
- startDate: (optional)
- endDate: (optional)
```

**Response:**
```json
[
  {
    "_id": {
      "year": 2024,
      "month": 1
    },
    "totalSales": 5000,
    "totalRevenue": 750000,
    "totalTransactions": 150,
    "averageOrderValue": 5000
  }
]
```

### Get Top and Least Selling Products
```http
GET /api/analytics/sales/top-least
Query Params:
- startDate: (optional)
- endDate: (optional)
- limit: 10 (default)
```

### Get Sales by Category
```http
GET /api/analytics/sales/by-category
Query Params:
- startDate: (optional)
- endDate: (optional)
```

### Get Sales by Region
```http
GET /api/analytics/sales/by-region
Query Params:
- startDate: (optional)
- endDate: (optional)
```

---

## 📦 Inventory Analytics APIs

### Get Inventory Overview
```http
GET /api/analytics/inventory/overview
```

**Response:**
```json
{
  "totalProducts": 150,
  "lowStock": 12,
  "outOfStock": 3,
  "overstock": 5,
  "totalValue": 1200000,
  "totalQuantity": 15000
}
```

### Get Current Stock Levels
```http
GET /api/analytics/inventory/stock-levels
Query Params:
- category: Cotton|Silk|Polyester|Wool|Linen|Blended|Other (optional)
- status: Normal|Low Stock|Out of Stock|Overstock (optional)
- search: productId or productName (optional)
```

### Get Low Stock Alerts
```http
GET /api/analytics/inventory/low-stock-alerts
```

**Response:**
```json
[
  {
    "productId": "PROD001",
    "productName": "Cotton Fabric",
    "quantityInStock": 5,
    "reorderLevel": 10,
    "category": "Cotton",
    "costPrice": 500,
    "deficit": 5,
    "estimatedReorderCost": 2500
  }
]
```

### Get Inventory Value by Category
```http
GET /api/analytics/inventory/value-by-category
```

### Get Inventory Turnover
```http
GET /api/analytics/inventory/turnover
Query Params:
- startDate: (optional)
- endDate: (optional)
```

### Get Stock Movement History
```http
GET /api/analytics/inventory/movement-history
Query Params:
- productId: PROD001 (required)
- startDate: (optional)
- endDate: (optional)
```

---

## 🐌 Slow Stock Analysis APIs

### Get Slow Moving Stock
```http
GET /api/analytics/slow-stock/slow-moving
Query Params:
- days: 90 (default, analysis period)
- type: all|slow|dead (default: all)
```

**Response:**
```json
{
  "summary": {
    "totalSlowMovingProducts": 15,
    "totalDeadStockProducts": 8,
    "totalBlockedValue": 450000,
    "analyzedPeriodDays": 90
  },
  "products": [
    {
      "productId": "PROD005",
      "productName": "Linen Fabric",
      "category": "Linen",
      "quantityInStock": 200,
      "totalSoldInPeriod": 0,
      "salesTransactions": 0,
      "classification": "Dead Stock",
      "daysSinceLastSale": 120,
      "blockedValue": 120000,
      "costPrice": 600,
      "sellingPrice": 900
    }
  ]
}
```

### Get Dead Stock Recommendations
```http
GET /api/analytics/slow-stock/recommendations
Query Params:
- days: 90 (default)
```

### Get Stock Aging Analysis
```http
GET /api/analytics/slow-stock/aging-analysis
```

**Response:**
```json
{
  "summary": {
    "0-30 days": {
      "count": 50,
      "totalValue": 300000
    },
    "31-60 days": {
      "count": 30,
      "totalValue": 200000
    },
    "61-90 days": {
      "count": 15,
      "totalValue": 100000
    },
    "90+ days": {
      "count": 10,
      "totalValue": 80000
    }
  },
  "details": { /* product lists by bucket */ }
}
```

---

## 🔮 Demand Forecasting APIs

### Get Product Demand Forecast
```http
GET /api/analytics/forecast/product
Query Params:
- productId: PROD001 (required)
- months: 3 (default, lookback period)
- forecastPeriod: 3 (default, months to forecast)
```

**Response:**
```json
{
  "productId": "PROD001",
  "productName": "Cotton Fabric",
  "historicalAverage": 150,
  "trend": "2.5",
  "trendDirection": "Increasing",
  "historicalData": [
    {
      "_id": {
        "year": 2024,
        "month": 1
      },
      "totalQuantity": 140,
      "totalRevenue": 105000,
      "transactionCount": 15
    }
  ],
  "forecasts": [
    {
      "month": "2024-04",
      "forecastedDemand": 158,
      "method": "Simple Moving Average with Trend"
    },
    {
      "month": "2024-05",
      "forecastedDemand": 163,
      "method": "Simple Moving Average with Trend"
    }
  ]
}
```

### Get Bulk Demand Forecast
```http
GET /api/analytics/forecast/bulk
Query Params:
- category: Cotton (optional)
- limit: 20 (default)
- months: 3 (default)
```

### Get Seasonal Patterns
```http
GET /api/analytics/forecast/seasonal
Query Params:
- productId: PROD001 (required)
```

---

## 💰 Profitability Analysis APIs

### Get Profitability Overview
```http
GET /api/analytics/profitability/overview
Query Params:
- startDate: (optional)
- endDate: (optional)
```

**Response:**
```json
{
  "totalRevenue": 2500000,
  "totalCost": 1750000,
  "totalProfit": 750000,
  "profitMarginPercentage": 30
}
```

### Get Product Profitability
```http
GET /api/analytics/profitability/product-wise
Query Params:
- startDate: (optional)
- endDate: (optional)
- sortBy: profit|margin (default: profit)
- limit: 50 (default)
```

### Get High Profit Products
```http
GET /api/analytics/profitability/high-profit
Query Params:
- minMargin: 30 (default, minimum profit margin %)
- limit: 20 (default)
```

### Get Low Profit Products
```http
GET /api/analytics/profitability/low-profit
Query Params:
- maxMargin: 15 (default, maximum profit margin %)
- limit: 20 (default)
```

### Get Profitability by Category
```http
GET /api/analytics/profitability/by-category
Query Params:
- startDate: (optional)
- endDate: (optional)
```

### Get Profit Trend
```http
GET /api/analytics/profitability/trend
Query Params:
- period: daily|weekly|monthly|yearly (default: monthly)
- startDate: (optional)
- endDate: (optional)
```

---

## 📄 Report Generation APIs

### Download Sales Report
```http
GET /api/reports/sales
Query Params:
- startDate: 2024-01-01 (optional)
- endDate: 2024-12-31 (optional)

Response: Excel file download
```

### Download Inventory Report
```http
GET /api/reports/inventory
Query Params:
- status: low|out (optional)

Response: Excel file download
```

### Download Slow Stock Report
```http
GET /api/reports/slow-stock
Query Params:
- days: 90 (default)

Response: Excel file download
```

### Download Profitability Report
```http
GET /api/reports/profitability
Query Params:
- startDate: (optional)
- endDate: (optional)

Response: Excel file download
```

### Download Comprehensive Report
```http
GET /api/reports/comprehensive
Query Params:
- startDate: (optional)
- endDate: (optional)

Response: Multi-sheet Excel file download
```

---

## 🧪 Testing Examples

### Using cURL

#### Get Sales Overview
```bash
curl http://localhost:5000/api/analytics/sales/overview
```

#### Get Sales with Date Range
```bash
curl "http://localhost:5000/api/analytics/sales/overview?startDate=2024-01-01&endDate=2024-03-31"
```

#### Upload Products File
```bash
curl -X POST \
  -F "file=@products.csv" \
  http://localhost:5000/api/upload/products
```

#### Get Slow Moving Stock
```bash
curl "http://localhost:5000/api/analytics/slow-stock/slow-moving?days=90&type=dead"
```

#### Get Product Forecast
```bash
curl "http://localhost:5000/api/analytics/forecast/product?productId=PROD001&months=6&forecastPeriod=3"
```

### Using JavaScript (Frontend)

```javascript
// Get sales overview
const response = await axios.get('/api/analytics/sales/overview', {
  params: {
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  }
});

// Upload products file
const formData = new FormData();
formData.append('file', file);

const response = await axios.post('/api/upload/products', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Get low stock alerts
const alerts = await axios.get('/api/analytics/inventory/low-stock-alerts');
```

---

## 📊 Common Query Parameters

### Date Filters
- `startDate`: YYYY-MM-DD format
- `endDate`: YYYY-MM-DD format

### Pagination & Limits
- `limit`: Number of results (default varies by endpoint)

### Periods
- `period`: daily | weekly | monthly | yearly

### Categories
- `category`: Cotton | Silk | Polyester | Wool | Linen | Blended | Other

### Stock Status
- `status`: Normal | Low Stock | Out of Stock | Overstock

### Analysis Types
- `type`: all | slow | dead

### Sort Options
- `sortBy`: profit | margin | revenue | quantity

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "message": "Missing required fields",
  "error": "productId is required"
}
```

### 401 Unauthorized
```json
{
  "message": "Access denied. No token provided."
}
```

### 404 Not Found
```json
{
  "message": "No historical sales data found for this product"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error processing file",
  "error": "Invalid file format"
}
```

---

## 🔑 Authentication

Most analytics endpoints require authentication. Include JWT token in headers:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Upload and report endpoints are currently accessible without authentication for testing, but should be secured in production.

---

**API Version: 1.0**  
**Last Updated: February 2024**
