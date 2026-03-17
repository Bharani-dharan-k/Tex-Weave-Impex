# Tex Weave Impex — Complete Project Report

**Date:** March 8, 2026  
**Project Type:** Full-Stack Web Application (MERN Stack)  
**Industry:** Textile Manufacturing, Sales & Export

---

## 1. Technology Stack

### Backend
| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | Latest LTS |
| Framework | Express.js | ^5.2.1 |
| Database | MongoDB via Mongoose | ^9.1.5 |
| Authentication | JSON Web Tokens (`jsonwebtoken`) | ^9.0.3 |
| Password Hashing | bcryptjs | ^3.0.3 |
| File Uploads | Multer | ^1.4.5-lts.1 |
| Image Hosting | Cloudinary SDK | ^2.9.0 |
| Email | Nodemailer (Gmail SMTP) | ^8.0.0 |
| Payment Gateway | Razorpay | ^2.9.6 |
| CSV Parsing | csv-parser | ^3.0.0 |
| Excel Parsing/Export | xlsx | ^0.18.5 |
| Input Validation | express-validator | ^7.3.1 |
| CORS | cors | ^2.8.6 |
| Dev Server | nodemon | ^3.1.11 |
| Module System | ES Modules (`"type": "module"`) | — |

### Frontend
| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | ^19.2.0 |
| Build Tool | Vite | ^5.4.11 |
| Routing | React Router DOM | ^7.13.0 |
| HTTP Client | Axios | ^1.13.4 |
| Charts | Recharts | ^3.7.0 |
| Icons | Lucide React | ^0.563.0 |
| Date Utilities | date-fns | ^4.1.0 |
| Linting | ESLint + React hooks plugin | ^9.x |

---

## 2. Application Architecture

### Structure
```
Tex-Weave-Impex/
├── backend/          → Express REST API (MVC pattern)
│   ├── config/       → DB, Cloudinary, Email configs
│   ├── controllers/  → 15 feature controllers
│   ├── middleware/   → Auth, file upload middleware
│   ├── models/       → 10 Mongoose schemas
│   └── routes/       → 16 route files
└── frontend/         → React SPA (Vite)
    └── src/
        ├── Pages/        → Admin Dashboard, Customer Dashboard, Home, Login, etc.
        ├── analytics/    → Modular analytics section (pages, components, services)
        ├── components/   → Shared UI components (KPICard, DataTable)
        ├── services/     → API service modules
        └── utils/        → Axios config, session manager
```

---

## 3. Completed Features — Backend

### 3.1 Authentication & Authorization
- **Login** with email/password and JWT issuance (configurable 1-day or 7-day expiry via "Remember Me")
- **Role system**: `admin`, `user`, `customer`
- **Auth middleware** (`protect`): Bearer token validation on all protected routes
- **Admin middleware**: Role-check guard for admin-only endpoints
- **Password reset flow**: Token generation → Gmail SMTP email → frontend link → password update
- **`GET /api/auth/me`**: Validates current session token

### 3.2 User / Customer Model
The `User` schema covers all customer lifecycle data:
- Basic: name, email, phone, password (bcrypt), profile picture (Cloudinary URL)
- B2B fields: companyName, customerType (Retailer/Wholesaler/Manufacturer/Distributor), GST number
- Dual addresses: `billingAddress` + `shippingAddress` (street, city, state, country, pincode)
- Preferences: productsInterested (multi), monthlyVolume, gsmRange, colorPreference
- Account control: `isActive` flag

### 3.3 Data Models (MongoDB Schemas)

| Model | Key Fields |
|---|---|
| **Product** | productId (unique), name, category (7 types), costPrice, sellingPrice, reorderLevel, unit, image (Cloudinary), isActive. Virtual: profitMargin%, profitAmount |
| **Sales** | invoiceId (unique), productId, quantitySold, unitPrice, totalAmount, costPrice, saleDate, region (5 zones), paymentStatus. Virtual: profit |
| **Inventory** | productId (unique), quantityInStock, warehouseLocation, lastRestockDate, lastSaleDate, reorderLevel, maxStockLevel. Virtual: stockStatus, daysSinceLastSale |
| **Order** | orderId, user (ref), items (product, qty, price), subtotal, 18% tax, shippingCharges, totalAmount, paymentMethod (razorpay/cod/bank_transfer), paymentStatus, razorpayOrderId/PaymentId/Signature, orderStatus (6 states), shippingAddress, billingAddress |
| **Review** | productId, userId, orderId (all refs), rating (1–5), reviewText, reviewTitle, isVerifiedPurchase, helpful/notHelpful votes, status (pending/approved/rejected). Compound unique index per user+product+order |
| **Wishlist** | userId (unique), products array with addedAt timestamps |
| **ProductView** | productId, userId (optional), sessionId, viewDuration, source (5 types), deviceType |
| **CartAbandonment** | userId, products (with qty/price), totalValue, abandonedAt, recovered flag |
| **Issue** | type (issue/contact/feedback), subject, description, priority (4 levels), status (4 states), category (6 types), submittedBy, adminNotes, resolvedBy |

### 3.4 Data Upload & Ingestion
- Accepts **CSV** and **Excel (.xlsx/.xls)** files (10 MB limit)
- Parses both formats and validates every row:
  - Required field checks
  - Numeric validation (no negatives)
  - Date format validation
  - Duplicate prevention via upsert
- Endpoints: `POST /api/upload/products`, `/sales`, `/inventory`
- Returns detailed response: totalRows, successCount, newCount, updateCount, errorCount, per-row errors

### 3.5 Sales Analytics
- **KPI Overview**: totalRevenue, totalTransactions, totalSales (qty), avgOrderValue, profit, inventoryValue, lowStockCount
- **Product-wise analysis**: revenue, qty, and transaction counts per product
- **Time-series trends**: daily/weekly/monthly/yearly aggregation with configurable date ranges
- **Top/Least selling**: ranked by revenue and quantity, with category/regional breakdowns

### 3.6 Inventory Analytics
- Overview: total products, low stock, out-of-stock, overstock counts; total inventory value
- **Current stock levels** with JOIN to Product for category filtering
- **Stock status classification**: Normal / Low Stock / Out of Stock / Overstock
- **Stock alerts**: items at/below reorder level with estimated reorder costs
- **Turnover rate** and stock movement history

### 3.7 Slow-Moving & Dead Stock Analysis
- Configurable analysis period (default: 90 days)
- **Classification**:
  - **Dead Stock**: zero sales in the period
  - **Slow Moving**: sales count below reorder level
  - **Normal**: adequate movement
- Calculates blocked capital value per product
- Provides clearance/bundle recommendations
- Stock aging buckets: 0–30, 31–60, 61–90, 90+ days

### 3.8 Demand Forecasting
- **Simple Moving Average (SMA)** with linear regression trend
- Per-product monthly demand predictions
- Configurable lookback periods and forecast horizons
- Bulk category-level forecasting
- Returns: forecastedDemand, trend direction, historical monthly data

### 3.9 Profitability Analysis
- Total profit, revenue, cost, and profit margin % (date-range filterable)
- Product-wise profitability ranking
- Category breakdown:
  - High-profit products (>30% margin)
  - Low-profit products (<15% margin)
- Profit trends over time

### 3.10 Report Generation (Excel Export)
Five downloadable `.xlsx` reports:
1. **Sales Report** — all transactions with invoice, product, qty, price, profit, region, customer
2. **Inventory Report** — stock with product details, status, warehouse location
3. **Slow Stock Report** — dead and slow-moving stock with blocked value
4. **Profitability Report** — product-wise profit margins
5. **Comprehensive Report** — multi-sheet workbook covering all the above

### 3.11 Order Management (Admin)
- View all orders with filtering by status/customer
- Update order status (pending → confirmed → processing → shipped → delivered/cancelled)
- Full order detail including Razorpay payment references

### 3.12 Product Management (Admin)
- CRUD for products with image upload to Cloudinary (multer memory storage, 5 MB limit)
- Activate/deactivate products
- Category management (Cotton, Polyester, Silk, Wool, Linen, Blended, Other)

### 3.13 Issue / Support Management (Admin)
- View and filter all submitted issues by status, type, priority, category
- Update issue status (open → in-progress → resolved → closed)
- Add admin notes; record resolvedBy and resolvedAt

### 3.14 Customer Analytics (Per-user)
- **Summary dashboard**: totalOrders, totalSpent, avgOrderValue, totalItems, reviewCount, wishlistCount
- **Spending over time**: monthly/weekly/yearly aggregation
- **Top categories** and **top products** purchased
- **Product recommendations** based on purchase history

### 3.15 Product Views Tracking
- Records every product view (anonymous or authenticated)
- Tracks: source (search/category/recommendation/direct/wishlist), deviceType, viewDuration
- Indexed for efficient per-product and per-user analytics queries

---

## 4. Completed Features — Frontend

### 4.1 Public Landing Page
- Full marketing website for Tex Weave Impex (Karur, India)
- Sections: Hero banner, Company Journey, Features/USPs, Animated product carousel, Stats counter (4 KPIs), Process steps, Certification showcase with modal, Footer with contact info
- Responsive (mobile breakpoints at 600px, 1024px)
- Fonts: Roboto + Poppins (Google Fonts), Font Awesome icons

### 4.2 Authentication Pages
- **Login**: email/password form, "Remember Me" toggle, role-based redirect (admin → `/dashboard`, customer → `/customer-dashboard`)
- **Reset Password**: token-based password reset form via email link

### 4.3 Session Management
- 30-minute inactivity timeout monitoring
- Tracks: mousedown, keydown, scroll, touchstart, click events
- Auto-redirects to `/login?expired=true` on expiry
- JWT expiry check via payload decode
- Cleans up all event listeners on logout

### 4.4 Axios Configuration
- Base URL: `http://localhost:5000`
- Request interceptor: automatically injects `Authorization: Bearer <token>` on every request
- Response interceptor: handles 401 → clears storage → redirects to login

### 4.5 Admin Dashboard
Collapsible sidebar with the following sections:

| Section | Features |
|---|---|
| **Dashboard Home** | KPI cards, quick links, top products, low stock alerts |
| **Add Product** | Product creation form with image upload |
| **Product Management** | Product CRUD table with edit/deactivate controls |
| **Users / User Analysis** | Customer list, drill-down to individual user detail |
| **Orders** | Admin order list with status management |
| **Issues Management** | View and respond to customer issues |
| **Analytics** | Dedicated analytics section (see 4.6) |

### 4.6 Analytics Dashboard (Admin)

**Dedicated Analytics Layout** with 5 sub-pages:
1. **Overview** (`AnalyticsDashboard.jsx`): KPI summary cards + multi-chart overview
2. **Sales Analytics** (`SalesAnalytics.jsx`): Daily revenue line chart, Orders vs Revenue bar chart, cumulative revenue area chart, time range selector (30/60/90 days), CSV export
3. **Customer Analytics** (`CustomerAnalytics.jsx`): Domestic vs Export pie chart, Revenue by region pie chart, Top 10 customers bar chart, CSV export
4. **Inventory Analytics** (`InventoryAnalytics.jsx`): Stock levels bar chart, Stock vs capacity comparison, low stock alert banner, CSV export
5. **Product Performance** (`ProductPerformance.jsx`): Top 10 products by revenue, Revenue by category, Price vs Units Sold scatter chart, CSV export

**Reusable Chart Components** (Recharts-based):
- `LineChart.jsx` — time-series trends
- `BarChart.jsx` — horizontal and vertical layout
- `AreaChart.jsx` — cumulative/filled trend
- `PieChart.jsx` — distribution analysis
- `ScatterChart.jsx` — correlation analysis
- `FunnelChart.jsx` — process flow / conversion funnels

**Shared UI Components:**
- `KPICard.jsx` — metric cards with label, value, icon, trend
- `DataTable.jsx` — sortable, paginated data grid

### 4.7 Customer Dashboard
Full B2B customer portal with collapsible sidebar:

| Section | Features |
|---|---|
| **Home** | Welcome, quick stats (orders, cart), quick actions, company overview |
| **Products** | Grid view, search (name/ID/description), category filter, product detail modal, add to cart |
| **Cart & Orders** | Cart management (add/update qty/remove/clear), checkout with Razorpay payment, order history with status tracking, order cancellation |
| **Wishlist** | Add/remove/clear products, move to cart |
| **My Reviews** | Submit verified-purchase reviews (1–5 stars, title, text), view/edit/delete own reviews, mark helpful |
| **My Profile** | Edit all profile fields, profile picture upload (Cloudinary), copy billing→shipping address, customer type & preferences |
| **My Analytics** | Personal spending dashboard: total orders, spent, avg order value; spending over time chart; top categories; top products |
| **Contact Us** | Contact form with auto-fill for logged-in users; company info display |
| **Report Issue** | Issue form with category, priority, description |

### 4.8 Data Upload Page
- Accessible from Admin Dashboard
- Three upload types: Products, Sales, Inventory
- Drag-and-drop style file input, validates CSV/XLSX/XLS types
- Upload progress bar
- Returns per-row error details

### 4.9 Reports Page
- Date range filter (optional)
- One-click download buttons for all 5 report types:
  - Sales Report (with date range)
  - Inventory Report (filterable by status: all/low/out)
  - Slow Stock Report (configurable days, default 90)
  - Profitability Report (with date range)
  - Comprehensive Report

---

## 5. API Endpoint Summary

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/forgot-password` | Public |
| POST | `/api/auth/reset-password` | Public |

### Products
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/products` | Private |
| GET | `/api/products/categories/list` | Private |
| GET | `/api/products/:id` | Private |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

### Orders
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/orders/create-razorpay-order` | Customer |
| POST | `/api/orders/verify-payment` | Customer |
| GET | `/api/orders/my-orders` | Customer |
| GET | `/api/orders/:id` | Customer |
| PUT | `/api/orders/:id/cancel` | Customer |
| GET | `/api/orders` | Admin |
| PUT | `/api/orders/:id/status` | Admin |

### Customer
| Method | Endpoint |
|---|---|
| GET/PUT | `/api/customer/profile` |
| POST | `/api/customer/profile/upload-picture` |
| POST | `/api/customer/profile/copy-address` |

### Analytics
| Endpoint Group | Paths |
|---|---|
| Sales | `/api/analytics/sales/overview`, `/product-wise`, `/trend`, `/top-products` |
| Inventory | `/api/analytics/inventory/overview`, `/stock-levels`, `/alerts` |
| Slow Stock | `/api/analytics/slow-stock` |
| Forecast | `/api/analytics/forecast` |
| Profitability | `/api/analytics/profitability/overview`, `/product-wise`, `/category` |
| Customer Analytics | `/api/customer/analytics/summary`, `/spending-over-time`, `/top-categories`, `/top-products` |

### Reviews, Wishlist, Issues
| Method | Endpoint |
|---|---|
| POST | `/api/reviews` |
| GET | `/api/reviews/product/:productId` |
| GET | `/api/reviews/my-reviews` |
| GET | `/api/reviews/eligible-products` |
| PUT/DELETE | `/api/reviews/:id` |
| GET/POST | `/api/wishlist`, `/api/wishlist/add/:productId`, `/api/wishlist/remove/:productId` |
| POST | `/api/issues/submit` |
| GET | `/api/issues` (Admin) |

### Upload & Reports
| Endpoint | Description |
|---|---|
| `POST /api/upload/products` | Bulk product upload |
| `POST /api/upload/sales` | Bulk sales upload |
| `POST /api/upload/inventory` | Bulk inventory upload |
| `GET /api/reports/sales` | Download sales XLSX |
| `GET /api/reports/inventory` | Download inventory XLSX |
| `GET /api/reports/slow-stock` | Download slow stock XLSX |
| `GET /api/reports/profitability` | Download profitability XLSX |
| `GET /api/reports/comprehensive` | Download all-in-one XLSX |

---

## 6. Security Implementation

| Feature | Implementation |
|---|---|
| Password storage | bcryptjs hashing (never stored in plain text) |
| API protection | JWT Bearer token on all private routes |
| Role enforcement | `protect` + `admin`/`authorize` middleware chain |
| Token expiry | 1-day (default) or 7-day (Remember Me) |
| Session timeout | 30-minute inactivity auto-logout on frontend |
| Image uploads | File type whitelist (jpeg/jpg/png/gif/webp), 5 MB limit |
| Data uploads | File type whitelist (csv/xlsx/xls), 10 MB limit |
| Input validation | express-validator on backend routes |
| CORS | Configured on all origins (tighten for production) |
| Payment security | Razorpay HMAC-SHA256 signature verification server-side |
| Review integrity | Verified purchase check — only buyers can review |
| Error exposure | Error details suppressed in non-development mode |

---

## 7. Third-Party Service Integrations

| Service | Purpose | Config |
|---|---|---|
| **MongoDB Atlas / Local** | Primary database | `MONGODB_URI` env var |
| **Cloudinary** | Product images + profile pictures (500×500, face detection) | `CLOUDINARY_CLOUD_NAME`, `API_KEY`, `API_SECRET` |
| **Razorpay** | Payment gateway (INR, 18% GST + ₹200/free shipping) | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| **Gmail SMTP** (via Nodemailer) | Password reset emails | `EMAIL_USER`, `EMAIL_PASSWORD` (App Password) |

---

## 8. Data Upload Formats

CSV templates supported with these column sets:

**Products:** `productId, name, category, costPrice, sellingPrice, reorderLevel, description, unit`  
**Sales:** `invoiceId, productId, productName, quantitySold, unitPrice, totalAmount, saleDate, customerName, region, paymentStatus`  
**Inventory:** `productId, quantityInStock, warehouseLocation, reorderLevel, maxStockLevel`

Sample files are available in the `test_data/` folder.

---

## 9. Key Business Logic

- **GST Tax**: 18% applied automatically at checkout
- **Shipping**: Free for orders > ₹10,000; flat ₹200 otherwise
- **Profit margin**: Calculated as `(sellingPrice - costPrice) / costPrice × 100`
- **Forecasting algorithm**: Simple Moving Average + linear regression trend extrapolation
- **Stock status thresholds**: Low ≤ reorderLevel; Overstock ≥ 90% of maxStockLevel
- **Dead stock**: Zero sales transactions in the configured analysis period
- **User analytics**: Only counts `paymentStatus: 'completed'` orders toward spending totals
- **Review gating**: Requires matching completed order containing the product before a review can be submitted

---

## 10. What Is Not Yet Implemented / Pending

Based on the codebase and docs, the following appear to be partially or not yet wired up on the frontend:

- **CartAbandonment tracking** — model and DB index exist, but no frontend trigger or analytics UI consumes it
- **ProductView analytics UI for admin** — the model and controller exist, but there is no admin-facing view showing most-viewed products
- **Admin-facing customer analytics** (beyond simple user list) — the per-user analytics endpoints exist but the admin deep-dive dashboard for customer behavior may be incomplete
- **Production environment config** — CORS is fully open (`app.use(cors())`), Cloudinary/Razorpay credentials need to be set in `.env`
- **Advanced forecasting** — current algorithm is SMA; no machine learning or ARIMA-level forecasting

---

## Summary

| Category | Count |
|---|---|
| Backend Controllers | 15 |
| Route Files | 16 |
| Mongoose Models | 10 |
| Frontend Pages/Sections | 16 |
| Reusable Chart Components | 8 |
| Downloadable Report Types | 5 |
| Third-Party Integrations | 4 |

All features are built within a clean **MVC MERN architecture** (MongoDB, Express, React, Node.js).
