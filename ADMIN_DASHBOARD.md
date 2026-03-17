# Tex-Weave-Impex — Admin Dashboard Documentation

## Overview

The Admin Dashboard is the central management interface for Tex-Weave-Impex, a textile import/export business management system. It provides real-time business intelligence, product lifecycle management, customer oversight, and operational support — all in a single-page React application accessible only to authenticated admin users.

The dashboard consolidates data from MongoDB collections (Products, Sales, Orders, Inventory, Users, Reviews, Issues) and presents it through charts, KPI cards, and data tables to help administrators make informed business decisions.

---

## Tools & Libraries Used

### Frontend

| Tool / Library | Version | Why It Is Used |
|---|---|---|
| **React 18** | `^18.x` | Component-based UI architecture. Each dashboard section is an isolated component (DashboardHome, Analytics, AddProduct, etc.) that manages its own state and lifecycle. |
| **axios** | `^1.x` | HTTP client for all API calls to the backend. A shared `axiosConfig` instance handles the base URL and authentication headers, preventing repetition across components. |
| **Recharts** | `^2.x` | Declarative charting library for React. Renders all analytics charts — Line, Bar, Area, Pie, Scatter, and custom Gauge charts — with responsive containers. |
| **lucide-react** | `^0.x` | Icon library providing 40+ scalable SVG icons used throughout the dashboard (LayoutDashboard, Package, Users, BarChart3, TrendingUp, AlertCircle, ShoppingCart, HelpCircle, etc.). |
| **date-fns** | `^2.x` | Date formatting and range generation used in the analytics `dataService.js` to produce time series labels and date ranges for charts. |
| **Vite** | `^5.x` | Build tool and dev server. Fast HMR (Hot Module Replacement) enables rapid iteration during development. |

### Backend

| Tool / Library | Why It Is Used |
|---|---|
| **Express.js** | REST API framework. Routes HTTP requests to the correct controller functions. |
| **MongoDB + Mongoose** | Document database storing all business data. Mongoose provides schema validation and aggregation pipeline support for analytics queries. |
| **Cloudinary** | Cloud image hosting for product images. Images are uploaded via `imageUploadMiddleware.js` (multer → Cloudinary SDK), and the resulting URL is stored in the Product document. Avoids storing binary data in MongoDB. |
| **multer** | Parses `multipart/form-data` request bodies for file uploads (product images). Works as middleware before `imageUploadMiddleware`. |
| **bcryptjs** | Password hashing for admin and user authentication. |
| **jsonwebtoken (JWT)** | Stateless authentication. Admin routes are protected by the `authMiddleware` which validates the JWT on every request. |
| **nodemailer** | Transactional email (password reset, order confirmations). Configured via `config/email.js`. |

### Analytics Data Layer (Frontend)

| File | Role |
|---|---|
| `analytics/services/dataService.js` | Static mock data provider for the secondary analytics sub-pages. Returns pre-shaped data for Sales, Customers, Inventory, and Product Performance pages. Also exposes `exportToCSV()` and `formatCurrency()` utilities. |
| `analytics/components/` | Custom wrapper components (LineChart, BarChart, PieChart, AreaChart, ScatterChart, FunnelChart) around Recharts primitives. Standardises styling, colour palettes, tooltips, and responsive behaviour. |
| `analytics/pages/` | Four analytics detail pages: SalesAnalytics, CustomerAnalytics, InventoryAnalytics, ProductPerformance. |

---

## Sidebar Navigation

The admin sidebar contains 8 sections. The active section is controlled by a `currentPage` state variable in the top-level `AdminDashboard` component.

| Nav Item | Component | Description |
|---|---|---|
| **Dashboard** | `DashboardHome` | Overview with quick stats (total products, users, low-stock count) and shortcut action buttons |
| **Analytics** | `AnalyticsSection` | Full analytics hub — live KPI cards, 17+ charts, trend tables |
| **Add Product** | `AddProduct` | Form to create a new product with Cloudinary image upload |
| **Products** | `ProductManagement` | Searchable / filterable product table with delete action |
| **User Analysis** | `UserAnalysis` → `UserDetail` | User list with stats; drill down into any user's orders, reviews, and issues |
| **Issues & Support** | `IssuesManagement` | Manage customer support tickets — view, update status, add admin notes, delete |
| **Orders** | `AdminOrders` | Order management — view all orders and update order/payment status |

---

## Section Details

### 1. Dashboard Home (`DashboardHome`)

Quick stats cards pulled in real-time via the backend API:
- Total Products
- Total Users
- Low Stock Products (count)

Quick action buttons navigate directly to Add Product, Products, Analytics, and Issues pages.

---

### 2. Analytics (`AnalyticsSection`)

The analytics hub is the most complex section. It is split into two tiers:

#### Tier 1 — Live API Analytics (Primary Dashboard)

Data source: `GET /api/analytics/dashboard`

All 17 aggregations run in parallel via `Promise.all` on the server, returning a single large JSON response. This minimises round trips and keeps load time predictable.

#### Tier 2 — Secondary Analytics Pages (Mock Data)

Data source: `analytics/services/dataService.js`

The four sub-pages (Sales, Customer, Inventory, ProductPerformance) use client-side mock data for demonstration and prototyping purposes. They can be connected to the live API by replacing `dataService` calls with axios calls.

---

## KPI Cards

Six KPI cards are displayed at the top of the Analytics section. Each uses the `KPICard` component which shows the metric value, a percentage change vs the previous period (green TrendingUp / red TrendingDown icon), and the data label.

| KPI | Data Source | Description |
|---|---|---|
| Total Orders | `Sales` collection count | Total number of sales transactions recorded |
| Total Revenue | `Sales.totalAmount` sum | Sum of all sales revenue in ₹ |
| Total Customers | Distinct `Sales.customerName` count | Unique customers who have placed orders |
| Avg Order Value | Total Revenue ÷ Total Orders | Mean transaction value in ₹ |
| Low Stock Alerts | `Inventory` where `qty ≤ reorderLevel` | Products requiring immediate restocking |
| Fast Moving Products | `Sales` top-velocity products | Products moving fastest by quantity sold |

---

## Analytics Charts (17 Live Aggregations)

All charts in the primary analytics section are powered by MongoDB aggregation pipelines executed in `dashboardAnalyticsController.js`.

### Chart 1 — KPI Summary Cards
**Type:** Stat cards
**Data:** Total orders, revenue, customer count, avg order value from `Sales`, cancellation rate from `Order`
**Purpose:** At-a-glance business health snapshot

---

### Chart 2 — Monthly Sales Trend (12 Months)
**Type:** Line Chart
**Data:** `Sales` grouped by `{year, month}` for the past 12 months — total revenue and order count per month
**Purpose:** Identify seasonal demand patterns in the textile trade (e.g., pre-festival buying spikes, off-season dips)

---

### Chart 3 — Daily Order Activity (Last 30 Days)
**Type:** Area Chart
**Data:** `Sales` grouped by calendar day for the past 30 days — order count per day
**Purpose:** Operational demand monitoring. Helps decide staffing and dispatch scheduling.

---

### Chart 4 — Sales by Product Category
**Type:** Bar Chart
**Data:** `Sales` → `$lookup Products` → `$group by product.category` → `$sum quantitySold`
**Purpose:** Understand which fabric categories (Cotton, Silk, Polyester, etc.) drive the most volume. Guides inventory purchasing decisions.

---

### Chart 5 — Revenue by Product Category (Doughnut)
**Type:** Doughnut / Pie Chart
**Data:** `Sales` → `$lookup Products` → `$group by product.category` → `$sum totalAmount`
**Purpose:** Shows which categories contribute most revenue — volume and revenue rankings may differ (e.g., Silk sells fewer units but generates more revenue per unit than Cotton).

---

### Chart 6 — Revenue Growth Rate
**Type:** Calculated metric (derived from Chart 2)
**Data:** Month-over-month revenue change percentage from the monthly sales trend
**Purpose:** Single headline growth figure for management reporting.

---

### Chart 7 — Top 10 Selling Products
**Type:** Horizontal Bar Chart
**Data:** `Sales` grouped by `productId` → `$sum quantitySold` → top 10 descending
**Purpose:** Identify bestsellers to prioritise stock replenishment and featured placement on the website.

---

### Chart 8 — Least 10 Selling Products
**Type:** Bar Chart
**Data:** `Sales` grouped by `productId` → `$sum quantitySold` → bottom 10 ascending
**Purpose:** Flag slow-moving or obsolete stock for markdown pricing, bundling, or discontinuation. Reduces dead stock carrying cost.

---

### Chart 9 — Customer Growth Analysis
**Type:** Line Chart
**Data:** First purchase date per `customerName` from `Sales`, grouped by year/month to count new customers per month
**Purpose:** Track customer acquisition rate over time. A plateauing or declining growth line signals need for marketing or outreach.

---

### Chart 10 — Top 10 Customers
**Type:** Bar Chart + Table
**Data:** `Sales` grouped by `customerName` → `$sum totalAmount` → top 10 by revenue
**Purpose:** Identify high-value accounts for relationship management, priority dispatch, and credit terms decisions.

---

### Chart 11 — Order Status Distribution
**Type:** Pie Chart
**Data:** `Order` grouped by `orderStatus` — counts per status (pending, confirmed, processing, shipped, delivered, cancelled)
**Purpose:** Operational pipeline visibility. A large "pending" slice indicates fulfilment bottleneck; a large "cancelled" slice signals customer experience problems.

---

### Chart 12 — Order Cancellation Rate
**Type:** Gauge Chart
**Data:** `Order.countDocuments({ orderStatus: 'cancelled' }) / Order.countDocuments()` × 100
**Purpose:** Single prominent metric for cancellation health. A high gauge reading prompts investigation into root causes (stock unavailability, payment failures, delivery delays).

---

### Chart 13 — Inventory Stock Levels
**Type:** Horizontal Bar Chart
**Data:** `Inventory` joined with `Products` — current `quantityInStock` per product, sorted by quantity
**Purpose:** Visual inventory audit showing all products with their current stock, reorder level markers, and maximum stock level.

---

### Chart 14 — Low Stock Detection
**Type:** Alert Banner + Table
**Data:** `Inventory` where `quantityInStock ≤ reorderLevel`
**Purpose:** Immediate restocking alert list. Admin can see exactly which SKUs are below threshold and by how much.

---

### Chart 15 — Fast Moving Products
**Type:** Bar Chart / Table
**Data:** Products with highest sales velocity (quantity sold per period)
**Purpose:** Ensure sufficient supply of high-velocity products to prevent stockouts on popular items.

---

### Chart 16 — Slow Moving Products
**Type:** Bar Chart / Table
**Data:** Products with lowest recent sales velocity
**Purpose:** Complement to Chart 8 — identifies stagnant stock for clearance action.

---

### Chart 17 — Price Range Performance
**Type:** Bar Chart
**Data:** Products grouped into price brackets — revenue and order count per bracket
**Purpose:** Identifies which price points generate the most transactions vs. revenue. Useful for pricing strategy (e.g., ₹50–100/metre bracket may have high volume but low margin).

---

## Analytics Sub-pages (Secondary — dataService.js)

### Sales Analytics (`SalesAnalytics.jsx`)

**Time Range Filter:** 30 / 60 / 90 days (selector)

| Chart | Type | Description |
|---|---|---|
| Daily Sales Revenue | Line (full width) | Revenue trend over selected time range |
| Orders vs Revenue | Bar (half width) | Side-by-side comparison of order count and revenue per period |
| Cumulative Sales Growth | Area (half width) | Running total of growth over the period |
| Sales Summary Table | Table | Per-product/period breakdown with growth % column (green if positive, red if negative) |

**Export:** CSV download button (via `dataService.exportToCSV()`)

---

### Customer Analytics (`CustomerAnalytics.jsx`)

| Chart | Type | Description |
|---|---|---|
| Domestic vs Export Revenue | Pie | Split between domestic India sales and export markets |
| Revenue by Region | Pie | 4 domestic regions (North, South, West, East India) + 3 export markets (Europe, Middle East, USA) |
| Top 10 Customers | Vertical Bar | Revenue ranking of top 10 customers |
| Top Customers Table | Table | Name, location, orders, revenue, avg order value, last order date |

---

### Inventory Analytics (`InventoryAnalytics.jsx`)

**Alert Banner:** Displays a warning when any product is below reorder level.

| Chart | Type | Description |
|---|---|---|
| Current Stock (Top 10) | Vertical Bar | Top 10 products by current quantity in stock |
| Stock vs Reorder vs Max | Horizontal Bar | Three-bar comparison per product: current stock, reorder level, maximum stock level |
| Inventory Depletion Timeline | Line | Projected depletion dates based on sales velocity |
| Low Stock Alert Table | Table | All products below reorder level with quantity, reorder level, and shortfall |

---

### Product Performance (`ProductPerformance.jsx`)

| Chart | Type | Description |
|---|---|---|
| Top 10 Products by Revenue | Vertical Bar | Revenue contribution ranking |
| Revenue by Category | Vertical Bar | Category-level revenue breakdown |
| Price vs Units Sold | Scatter Chart | X: selling price, Y: units sold — identifies price elasticity patterns |
| Product Performance Table | Table | Product name, category, units sold, revenue, cost price, profit margin % (highlighted green if ≥ 30%) |

---

## Product Management

**Component:** `ProductManagement`

**Features:**
- **Search:** Filters product list by name in real-time (`/api/products?search=...`)
- **Category filter:** Dropdown to view products by fabric type (Cotton, Polyester, Silk, Wool, Linen, Blended, Other)
- **Image display:** Cloudinary-hosted product images shown as thumbnails in the table
- **Status badge:** Active / Inactive indicator per product
- **Delete:** Confirmation dialog before calling `DELETE /api/products/:id`

**Data source:** Product listing is fetched directly from MongoDB via `GET /api/products`.

---

## Add Product

**Component:** `AddProduct`

**Fields:**
| Field | Type | Notes |
|---|---|---|
| Product ID | Text | Unique identifier, e.g. `PROD001` |
| Product Name | Text | Display name |
| Category | Select | Cotton / Polyester / Silk / Wool / Linen / Blended / Other |
| Unit | Select | Meters / Kilograms / Pieces / Rolls |
| Cost Price (₹) | Number | Internal cost |
| Selling Price (₹) | Number | Customer-facing price |
| Reorder Level | Number | Triggers low-stock alert when inventory drops to this value |
| Description | Textarea | Product details shown on website |
| Product Image | File | JPEG / PNG / GIF / WebP, max 5 MB |

**Image upload flow:**
1. User selects a file → `FileReader` generates a local preview
2. On submit the form is sent as `multipart/form-data`
3. `imageUploadMiddleware.js` (multer + Cloudinary SDK) uploads the file to Cloudinary
4. Cloudinary returns a `{ url, public_id }` object stored in the Product document

---

## User Management

### User Analysis (`UserAnalysis`)

Summary stats cards:
- **Total Users** — all registered accounts
- **Customer Users** — accounts with `role = 'user'`
- **New This Month** — accounts created since the 1st of the current month

User list table with columns: Name, Email, Role, Join Date, Status, Action ("View Profile" button)

Clicking a row or the button navigates to `UserDetail`.

### User Detail (`UserDetail`)

Fetches `GET /api/auth/users/:id/details` which returns the user object plus their associated orders, reviews, and issues.

**Profile card:** Avatar (first letter of name), name, email, role, join date, and counts for Orders / Reviews / Reports.

**Three tabs:**

| Tab | Columns | Notes |
|---|---|---|
| Orders | Order ID, Items, Total Amount, Payment Status, Order Status, Date | Status badges colour-coded by state |
| Reviews | Product, Rating (★ stars), Title, Review text, Status, Date | Approval status shown |
| Reports & Issues | Type, Subject, Priority, Status, Date | Priority colour-coded: critical=red, high=orange, medium=yellow, low=green |

---

## Issues & Support

**Component:** `IssuesManagement`

**Issue types:** `issue` (bug/complaint) · `contact` (general enquiry) · other

**Priority levels:** `critical` · `high` · `medium` · `low`

**Status lifecycle:** `open` → `in-progress` → `resolved` → `closed`

**Features:**
- **Stats cards:** Counts for total issues, open, in-progress, resolved
- **Filters:** Filter list by status and/or issue type
- **Detail modal:** Click any row to open a modal showing the full issue subject, description, user, priority, dates, and admin notes field
- **Status update:** Dropdown + "Update Status" button inside the modal. Admin notes can be appended before saving (`PUT /api/issues/:id/status`)
- **Delete:** Confirmation dialog before `DELETE /api/issues/:id`

---

## Orders

**Component:** `AdminOrders`

Displays all orders from the `Order` collection. Admins can update order status through the lifecycle: pending → confirmed → processing → shipped → delivered, or mark as cancelled.

---

## MongoDB Data Sources

All admin analytics data is fetched directly from MongoDB collections through backend API routes.

Primary analytics endpoint:

- `GET /api/analytics/dashboard` (aggregates from `Sales`, `Order`, `Inventory`, `Product`, `User`)

Supporting analytics endpoints:

- `GET /api/analytics/sales/*`
- `GET /api/analytics/inventory/*`

Product data source values:

```js
source: { type: String, enum: ['manual', 'csv_upload'], default: 'manual' }
```

---

## Authentication & Security

- All admin routes are protected by the `authMiddleware` which verifies the JWT token in the `Authorization: Bearer <token>` header
- Admin-only routes additionally check `req.user.role === 'admin'`
- Passwords are hashed with bcryptjs before storage — plain-text passwords are never persisted
- Cloudinary images are served over HTTPS from Cloudinary's CDN
- Product image uploads are validated for file type (`image/*` only) and size (5 MB max) on both client and server

---

## File Structure Reference

```
frontend/src/
├── Pages/
│   └── AdminDashboard.jsx          # Main admin app — all sections in one file
├── analytics/
│   ├── pages/
│   │   ├── AnalyticsDashboard.jsx  # Overview analytics (mock data)
│   │   ├── SalesAnalytics.jsx      # Detailed sales charts
│   │   ├── CustomerAnalytics.jsx   # Customer & regional charts
│   │   ├── InventoryAnalytics.jsx  # Inventory health charts
│   │   └── ProductPerformance.jsx  # Product profitability charts
│   ├── components/
│   │   ├── LineChart.jsx           # Recharts line wrapper
│   │   ├── BarChart.jsx            # Recharts bar wrapper
│   │   ├── PieChart.jsx            # Recharts pie wrapper
│   │   ├── AreaChart.jsx           # Recharts area wrapper
│   │   ├── ScatterChart.jsx        # Recharts scatter wrapper
│   │   ├── FunnelChart.jsx         # Recharts funnel wrapper
│   │   └── KPICard.jsx             # Metric card with trend indicator
│   └── services/
│       └── dataService.js          # Mock data + CSV export utilities
└── components/
    ├── KPICard.jsx                 # Alternative KPI card component
    └── DataTable.jsx               # Reusable sortable table

backend/
├── controllers/
│   ├── dashboardAnalyticsController.js   # 17 parallel MongoDB aggregations
│   ├── salesAnalyticsController.js       # Sales overview with date filter
│   └── inventoryAnalyticsController.js   # Inventory overview + stock status
└── middleware/
    ├── authMiddleware.js                 # JWT verification
    └── imageUploadMiddleware.js          # multer + Cloudinary upload
```
