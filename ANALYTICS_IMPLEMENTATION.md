# Tex Weave Impex - Data Analytics System

## 🎯 Project Overview

A comprehensive MERN stack data analytics application designed for **Tex Weave Impex**, a textile manufacturing and sales company. This system addresses the critical business challenge of lacking centralized analytics for tracking product-wise sales trends, inventory levels, and slow-moving stock.

### Industry
Textile Manufacturing & Sales

### Problem Statement
The company lacks a centralized analytics system to track:
- Product-wise sales trends
- Inventory levels and alerts
- Slow-moving stock identification
- Demand forecasting
- Profitability analysis

This leads to poor demand planning and revenue loss.

---

## 📋 Features Implemented

### 1. **Data Models (MongoDB + Mongoose)**
✅ **Product Schema**
- Product ID, name, category
- Cost price, selling price, reorder level
- Virtual fields for profit margin calculation
- Indexed for fast queries

✅ **Sales Schema**
- Invoice ID, product details
- Quantity sold, prices, total amount
- Sale date, customer info, region
- Payment status tracking

✅ **Inventory Schema**
- Product stock levels
- Reorder levels and max stock levels
- Last restock and sale dates
- Warehouse location tracking

### 2. **Data Ingestion Module**
✅ CSV/Excel file upload functionality
- Multer middleware for file handling
- Support for .csv, .xlsx, .xls formats
- File size limit: 10MB

✅ Data validation
- Required field checking
- No negative values allowed
- Valid date format validation
- Duplicate prevention via upsert

✅ API Routes
- `POST /api/upload/products` - Upload product data
- `POST /api/upload/sales` - Upload sales data
- `POST /api/upload/inventory` - Upload inventory data

### 3. **Sales Analytics Module**
✅ Sales overview with KPIs
- Total revenue, transactions, average order value
- Profit calculation when cost data available

✅ Product-wise sales analysis
- Revenue and quantity per product
- Transaction counts and averages

✅ Sales trends
- Daily, weekly, monthly, yearly trends
- Configurable date ranges
- Time-series aggregation

✅ Top/least selling products
- Ranked by revenue and quantity
- Category and regional breakdowns

### 4. **Inventory Analytics Module**
✅ Real-time inventory dashboard
- Total products, low stock, out of stock counts
- Inventory value calculation
- Stock status indicators

✅ Stock alerts system
- Low stock alerts with reorder suggestions
- Overstock identification
- Estimated reorder costs

✅ Inventory metrics
- Value by category
- Turnover rate calculation
- Stock movement history

### 5. **Slow-Moving & Dead Stock Analysis**
✅ Intelligent stock classification
- Dead stock: No sales in 60/90 days
- Slow moving: Sales below reorder level
- Configurable analysis period

✅ Blocked value calculation
- Total capital tied up in dead stock
- Product-wise blocking analysis

✅ Recommendations engine
- Clearance sale suggestions
- Bundle deal recommendations
- Estimated recovery projections

✅ Stock aging analysis
- 0-30, 31-60, 61-90, 90+ day buckets
- Days since last sale tracking

### 6. **Demand Forecasting**
✅ Simple Moving Average (SMA) algorithm
- Historical sales-based prediction
- Trend identification (increasing/decreasing/stable)
- Configurable lookback periods

✅ Product-wise forecasts
- Monthly demand predictions
- Multiple forecast periods
- Seasonal pattern detection

✅ Bulk forecasting
- Category-wise forecasts
- Top products forecast generation

### 7. **Profitability Analysis**
✅ Comprehensive profit metrics
- Total profit, revenue, cost tracking
- Profit margin percentages
- Product-wise profitability

✅ Product categorization
- High-profit products (>30% margin)
- Low-profit products (<15% margin)
- Profit per unit calculations

✅ Category and trend analysis
- Profitability by category
- Profit trends over time
- Comparative analysis

### 8. **Report Generation**
✅ Excel export functionality
- Sales reports with all transaction details
- Inventory reports with stock status
- Slow-moving stock reports
- Profitability analysis reports
- Comprehensive multi-sheet reports

✅ Downloadable formats
- .xlsx (Excel 2007+)
- Custom filename with timestamps
- Pre-formatted sheets

### 9. **Dashboard UI Integration**
✅ Comprehensive Admin Dashboard
- 6 main KPI cards (revenue, profit, inventory value, alerts)
- Quick access links to all modules
- Top 5 products display
- Low stock alerts section

✅ Modern React components
- Reusable KPICard component
- DataTable with sorting and pagination
- Responsive design
- Loading states

✅ Analytics Hub
- Dedicated analytics section in dashboard
- 6 quick access cards for different modules
- Feature showcase
- Future scope section

### 10. **Code Quality**
✅ MVC Architecture
- Separated models, controllers, routes
- Service layer for frontend

✅ Error handling
- Try-catch blocks throughout
- Meaningful error messages
- HTTP status codes

✅ Best practices
- Async/await pattern
- MongoDB aggregation pipelines
- React hooks
- Component reusability

---

## 🏗️ Architecture

### Backend Structure
```
backend/
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Sales.js
│   └── Inventory.js
├── controllers/
│   ├── authController.js
│   ├── uploadController.js
│   ├── salesAnalyticsController.js
│   ├── inventoryAnalyticsController.js
│   ├── slowStockController.js
│   ├── forecastController.js
│   ├── profitabilityController.js
│   └── reportController.js
├── routes/
│   ├── authRoutes.js
│   ├── uploadRoutes.js
│   ├── salesAnalyticsRoutes.js
│   ├── inventoryAnalyticsRoutes.js
│   ├── slowStockRoutes.js
│   ├── forecastRoutes.js
│   ├── profitabilityRoutes.js
│   └── reportRoutes.js
├── middleware/
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
├── uploads/ (generated)
└── server.js
```

### Frontend Structure
```
frontend/src/
├── Pages/
│   ├── Home1.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── AnalyticsDashboardPage.jsx
│   └── DataUpload.jsx
├── components/
│   ├── KPICard.jsx
│   └── DataTable.jsx
├── services/
│   └── analyticsService.js
├── analytics/ (existing)
└── App.jsx
```

---

## 🚀 API Endpoints

### Upload APIs
```
POST /api/upload/products       - Upload products CSV/Excel
POST /api/upload/sales          - Upload sales CSV/Excel
POST /api/upload/inventory      - Upload inventory CSV/Excel
```

### Sales Analytics APIs
```
GET /api/analytics/sales/overview           - Sales KPIs
GET /api/analytics/sales/product-wise       - Product-wise sales
GET /api/analytics/sales/trends             - Sales trends
GET /api/analytics/sales/top-least          - Top & least selling
GET /api/analytics/sales/by-category        - Category-wise sales
GET /api/analytics/sales/by-region          - Regional sales
```

### Inventory Analytics APIs
```
GET /api/analytics/inventory/overview           - Inventory KPIs
GET /api/analytics/inventory/stock-levels       - Current stock
GET /api/analytics/inventory/low-stock-alerts   - Low stock items
GET /api/analytics/inventory/value-by-category  - Category values
GET /api/analytics/inventory/turnover           - Turnover rates
GET /api/analytics/inventory/movement-history   - Stock movements
```

### Slow Stock APIs
```
GET /api/analytics/slow-stock/slow-moving       - Slow & dead stock
GET /api/analytics/slow-stock/recommendations   - Action recommendations
GET /api/analytics/slow-stock/aging-analysis    - Aging buckets
```

### Forecasting APIs
```
GET /api/analytics/forecast/product     - Single product forecast
GET /api/analytics/forecast/bulk        - Bulk product forecasts
GET /api/analytics/forecast/seasonal    - Seasonal patterns
```

### Profitability APIs
```
GET /api/analytics/profitability/overview       - Profit KPIs
GET /api/analytics/profitability/product-wise   - Product profitability
GET /api/analytics/profitability/high-profit    - High-profit products
GET /api/analytics/profitability/low-profit     - Low-profit products
GET /api/analytics/profitability/by-category    - Category profitability
GET /api/analytics/profitability/trend          - Profit trends
```

### Report APIs
```
GET /api/reports/sales              - Download sales report
GET /api/reports/inventory          - Download inventory report
GET /api/reports/slow-stock         - Download slow stock report
GET /api/reports/profitability      - Download profitability report
GET /api/reports/comprehensive      - Download comprehensive report
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/texweave
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

Start backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Data Upload Templates

### Products Template (CSV)
```csv
productId,name,category,costPrice,sellingPrice,reorderLevel,description,unit
PROD001,Cotton Fabric,Cotton,500,750,10,High quality cotton,meters
PROD002,Silk Fabric,Silk,1200,1800,5,Premium silk,meters
```

### Sales Template (CSV)
```csv
invoiceId,productId,productName,quantitySold,unitPrice,totalAmount,costPrice,saleDate,customerName,region,paymentStatus,salesPerson
INV001,PROD001,Cotton Fabric,100,750,75000,500,2024-01-15,ABC Corp,North,Paid,John Doe
INV002,PROD002,Silk Fabric,50,1800,90000,1200,2024-01-16,XYZ Ltd,South,Paid,Jane Smith
```

### Inventory Template (CSV)
```csv
productId,productName,quantityInStock,reorderLevel,maxStockLevel,warehouseLocation,lastRestockDate
PROD001,Cotton Fabric,500,10,1000,Main Warehouse,2024-01-01
PROD002,Silk Fabric,200,5,500,Main Warehouse,2024-01-05
```

---

## 🎨 UI Features

### Dashboard Navigation
1. **Overview Tab** - Existing business overview
2. **Product Analytics** - Product performance charts
3. **Process Flow** - Manufacturing process flow
4. **Manufacturing** - Time & throughput metrics
5. **Quality Control** - Quality metrics
6. **Packing & Dispatch** - Logistics tracking
7. **Data Analytics** ⭐ NEW - Complete analytics hub

### Analytics Hub Includes
- Quick access cards to all modules
- Feature showcase grid
- Future enhancements roadmap
- Responsive design

---

## 🔮 Future Enhancements (Commented in Code)

### 1. ERP Integration
- REST API integration with existing ERP systems
- Real-time data synchronization
- Bi-directional data flow

### 2. Real-time Analytics
- WebSocket integration
- Live dashboard updates
- Push notifications for alerts

### 3. Role-based Access Control
- Sales Manager dashboard
- Inventory Manager dashboard
- Admin super-user access
- Granular permissions

### 4. Advanced ML Models
- LSTM neural networks for forecasting
- Anomaly detection
- Price optimization
- Customer segmentation

### 5. Mobile Application
- React Native mobile app
- Offline mode support
- Push notifications
- Barcode scanning for inventory

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- File upload validation
- Input sanitization
- MongoDB injection prevention
- CORS configuration

---

## 📈 Performance Optimizations

- MongoDB indexing on frequently queried fields
- Aggregation pipelines for complex queries
- Virtual fields for calculated values
- Pagination for large datasets
- File size limits for uploads
- Connection pooling

---

## 🧪 Testing Recommendations

### Backend Testing
```bash
# Test upload endpoint
curl -X POST -F "file=@products.csv" http://localhost:5000/api/upload/products

# Test analytics endpoint
curl http://localhost:5000/api/analytics/sales/overview
```

### Sample Data
Use the provided templates to create sample CSV files and test the upload functionality.

---

## 📝 Notes

- All monetary values are in INR (Indian Rupees)
- Date format: ISO 8601 (YYYY-MM-DD)
- File upload limit: 10MB
- Supported file formats: CSV, XLS, XLSX
- Default analysis period: 90 days for slow stock
- Forecast lookback period: 3 months default
- Profit margin thresholds: High >30%, Low <15%

---

## 👥 User Roles

Current implementation supports **Admin** role with full access. Future versions will include:
- Sales Manager (sales analytics only)
- Inventory Manager (inventory analytics only)
- Analyst (read-only access)

---

## 🐛 Known Issues

1. Excel date parsing may need adjustment for different regional formats
2. Large file uploads (>5MB) may take time - consider adding progress indicators
3. Multer has a high severity vulnerability - consider upgrading to version 2.x in production

---

## 📞 Support

For issues or questions:
1. Check the API documentation above
2. Review the code comments in controllers
3. Test with sample data templates
4. Check browser console for frontend errors
5. Check server logs for backend errors

---

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack MERN development
- RESTful API design
- MongoDB aggregation pipelines
- File upload handling
- Data analytics implementation
- React component architecture
- Responsive UI design
- Business logic implementation
- Report generation
- Authentication & authorization

---

**Built with ❤️ for Tex Weave Impex**

*Final Year Project - Data Analytics for Textile Industry*
