# Database Table Design - SQL Implementation
## Inventory Management System with E-Commerce & Analytics

---

## Table Overview

Your project has **10 core entities** with the following database tables:

1. **users** - Customer and staff accounts
2. **products** - Product inventory
3. **inventory** - Stock tracking
4. **orders** - Customer orders
5. **order_items** - Order line items
6. **sales** - Sales transactions
7. **reviews** - Product reviews
8. **wishlists** - Customer wishlists
9. **wishlist_items** - Wishlist products
10. **cart_abandonment** - Abandoned cart tracking
11. **product_views** - Product analytics tracking
12. **issues** - Support tickets and feedback

---

## SQL CREATE TABLE STATEMENTS

### 1. USERS TABLE
Stores customer and admin information with authentication and address details.

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user', 'customer') DEFAULT 'user',
  profile_picture VARCHAR(500),
  
  -- Customer-specific fields
  company_name VARCHAR(150),
  customer_type ENUM('Retailer', 'Wholesaler', 'Manufacturer', 'Distributor', 'Other') DEFAULT NULL,
  gst_number VARCHAR(50),
  
  -- Billing Address
  billing_street VARCHAR(255),
  billing_city VARCHAR(100),
  billing_state VARCHAR(100),
  billing_country VARCHAR(100) DEFAULT 'India',
  billing_pincode VARCHAR(10),
  
  -- Shipping Address
  shipping_street VARCHAR(255),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_country VARCHAR(100) DEFAULT 'India',
  shipping_pincode VARCHAR(10),
  
  -- Customer Preferences
  products_interested JSON,
  monthly_volume ENUM('Less than 1000', '1000-5000', '5000-10000', '10000+'),
  gsm_range ENUM('100-150', '150-200', '200-300', '300+'),
  color_preference VARCHAR(100),
  
  -- Document Storage (URLs)
  gst_certificate VARCHAR(500),
  trade_license VARCHAR(500),
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_customer_type (customer_type),
  INDEX idx_created_at (created_at)
);
```

---

### 2. PRODUCTS TABLE
Stores product information with pricing and categorization.

```sql
CREATE TABLE products (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  category ENUM('Cotton', 'Polyester', 'Silk', 'Wool', 'Linen', 'Blended', 'Other') DEFAULT 'Other',
  description TEXT,
  cost_price DECIMAL(10, 2) NOT NULL CHECK (cost_price >= 0),
  selling_price DECIMAL(10, 2) NOT NULL CHECK (selling_price >= 0),
  unit ENUM('meters', 'kg', 'pieces', 'rolls') DEFAULT 'meters',
  reorder_level INT NOT NULL DEFAULT 10 CHECK (reorder_level >= 0),
  
  -- Image Storage (Cloudinary)
  image_url VARCHAR(500),
  image_public_id VARCHAR(200),
  
  is_active BOOLEAN DEFAULT true,
  source ENUM('manual', 'csv_upload') DEFAULT 'manual',
  
  -- Computed fields (stored for performance)
  profit_margin DECIMAL(10, 2),
  profit_amount DECIMAL(10, 2),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY uk_product_id (product_id),
  INDEX idx_category (category),
  INDEX idx_is_active (is_active),
  INDEX idx_category_active (category, is_active)
);
```

---

### 3. INVENTORY TABLE
Real-time inventory tracking with stock levels and warehouse locations.

```sql
CREATE TABLE inventory (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL UNIQUE,
  quantity_in_stock INT NOT NULL DEFAULT 0 CHECK (quantity_in_stock >= 0),
  warehouse_location VARCHAR(100) DEFAULT 'Main Warehouse',
  reorder_level INT DEFAULT 10 CHECK (reorder_level >= 0),
  max_stock_level INT CHECK (max_stock_level >= 0),
  
  -- Tracking Dates
  last_restock_date DATETIME,
  last_sale_date DATETIME,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_product (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id),
  INDEX idx_warehouse_location (warehouse_location),
  INDEX idx_stock_status (quantity_in_stock)
);
```

---

### 4. ORDERS TABLE
Customer order records with payment and shipping information.

```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id VARCHAR(50) NOT NULL UNIQUE,
  user_id BIGINT NOT NULL,
  
  -- Amount Breakdown
  subtotal DECIMAL(12, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping_charges DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL,
  
  -- Payment Information
  payment_method ENUM('razorpay', 'cod', 'bank_transfer') DEFAULT 'razorpay',
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature VARCHAR(200),
  
  -- Order Status
  order_status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  
  -- Address Information
  billing_street VARCHAR(255),
  billing_city VARCHAR(100),
  billing_state VARCHAR(100),
  billing_country VARCHAR(100) DEFAULT 'India',
  billing_pincode VARCHAR(10),
  
  shipping_street VARCHAR(255),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_country VARCHAR(100) DEFAULT 'India',
  shipping_pincode VARCHAR(10),
  
  -- Customer Information (Denormalized for quick access)
  customer_name VARCHAR(100),
  customer_email VARCHAR(150),
  customer_phone VARCHAR(20),
  customer_company_name VARCHAR(150),
  
  -- Delivery Tracking
  tracking_number VARCHAR(100),
  estimated_delivery DATE,
  delivered_at DATETIME,
  
  -- Cancellation Info
  cancelled_at DATETIME,
  cancellation_reason VARCHAR(255),
  
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_user (user_id) REFERENCES users(id),
  UNIQUE KEY uk_order_id (order_id),
  INDEX idx_user_id (user_id),
  INDEX idx_order_status (order_status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_created_at (created_at),
  INDEX idx_razorpay_order_id (razorpay_order_id)
);
```

---

### 5. ORDER_ITEMS TABLE
Individual line items within each order (normalized).

```sql
CREATE TABLE order_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  
  -- Product Info (Denormalized for snapshot)
  product_name VARCHAR(200) NOT NULL,
  product_id_code VARCHAR(50),
  unit VARCHAR(20),
  
  quantity INT NOT NULL CHECK (quantity >= 1),
  price_per_unit DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_order (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY fk_product (product_id) REFERENCES products(id),
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
);
```

---

### 6. SALES TABLE
Sales transactions with revenue tracking and regional data.

```sql
CREATE TABLE sales (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  invoice_id VARCHAR(50) NOT NULL UNIQUE,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(200),
  
  quantity_sold DECIMAL(10, 3) NOT NULL CHECK (quantity_sold > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  cost_price DECIMAL(10, 2) CHECK (cost_price >= 0),
  total_amount DECIMAL(12, 2) NOT NULL CHECK (total_amount >= 0),
  
  -- Profit Calculation
  profit DECIMAL(12, 2) GENERATED ALWAYS AS (((unit_price - IFNULL(cost_price, 0)) * quantity_sold)) STORED,
  profit_margin DECIMAL(5, 2) GENERATED ALWAYS AS (
    CASE 
      WHEN cost_price = 0 THEN 0 
      ELSE ((unit_price - cost_price) / cost_price * 100)
    END
  ) STORED,
  
  -- Sale Details
  sale_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  customer_name VARCHAR(100),
  sales_person VARCHAR(100),
  
  -- Regional & Payment Info
  region ENUM('North', 'South', 'East', 'West', 'Central') DEFAULT 'Central',
  payment_status ENUM('Paid', 'Pending', 'Partial') DEFAULT 'Paid',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY uk_invoice_id (invoice_id),
  INDEX idx_product_id (product_id),
  INDEX idx_sale_date (sale_date),
  INDEX idx_region_date (region, sale_date),
  INDEX idx_invoice_id (invoice_id),
  INDEX idx_sales_person (sales_person)
);
```

---

### 7. REVIEWS TABLE
Product reviews and ratings from customers.

```sql
CREATE TABLE reviews (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  order_id BIGINT NOT NULL,
  
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title VARCHAR(100),
  review_text VARCHAR(1000) NOT NULL,
  
  is_verified_purchase BOOLEAN DEFAULT true,
  
  helpful_count INT DEFAULT 0,
  not_helpful_count INT DEFAULT 0,
  
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_product (product_id) REFERENCES products(id),
  FOREIGN KEY fk_user (user_id) REFERENCES users(id),
  FOREIGN KEY fk_order (order_id) REFERENCES orders(id),
  
  UNIQUE KEY uk_product_user_order (product_id, user_id, order_id),
  INDEX idx_product_id (product_id),
  INDEX idx_rating (rating),
  INDEX idx_status (status),
  INDEX idx_product_status_date (product_id, status, created_at),
  INDEX idx_user_id (user_id)
);
```

---

### 8. WISHLISTS TABLE
Customer wishlist management.

```sql
CREATE TABLE wishlists (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL UNIQUE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_user (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_id (user_id),
  INDEX idx_user_id (user_id)
);
```

---

### 9. WISHLIST_ITEMS TABLE
Individual products in wishlists (normalized).

```sql
CREATE TABLE wishlist_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  wishlist_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_wishlist (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE,
  FOREIGN KEY fk_product (product_id) REFERENCES products(id) ON DELETE CASCADE,
  
  UNIQUE KEY uk_wishlist_product (wishlist_id, product_id),
  INDEX idx_wishlist_id (wishlist_id),
  INDEX idx_product_id (product_id)
);
```

---

### 10. CART_ABANDONMENT TABLE
Tracks abandoned shopping carts for re-engagement analytics.

```sql
CREATE TABLE cart_abandonment (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  total_value DECIMAL(12, 2) NOT NULL,
  
  abandoned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  recovered BOOLEAN DEFAULT false,
  recovered_at DATETIME,
  
  -- JSON field for storing abandoned cart items
  cart_items JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_user (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_abandoned_at (abandoned_at),
  INDEX idx_recovered (recovered),
  INDEX idx_recovery_analytics (recovered, abandoned_at)
);
```

---

### 11. PRODUCT_VIEWS TABLE
Product analytics tracking for customer behavior insights.

```sql
CREATE TABLE product_views (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  user_id BIGINT,
  session_id VARCHAR(100),
  
  view_duration INT DEFAULT 0, -- seconds
  
  source ENUM('search', 'category', 'recommendation', 'direct', 'wishlist') DEFAULT 'direct',
  device_type ENUM('mobile', 'tablet', 'desktop') DEFAULT 'desktop',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_product (product_id) REFERENCES products(id),
  FOREIGN KEY fk_user (user_id) REFERENCES users(id),
  
  INDEX idx_product_id (product_id),
  INDEX idx_user_id (user_id),
  INDEX idx_session_id (session_id),
  INDEX idx_product_created (product_id, created_at),
  INDEX idx_user_created (user_id, created_at),
  INDEX idx_source (source),
  INDEX idx_device_type (device_type)
);
```

---

### 12. ISSUES TABLE
Support tickets, feedback, and bug reports.

```sql
CREATE TABLE issues (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  issue_type ENUM('issue', 'contact', 'feedback') NOT NULL,
  category ENUM('technical', 'billing', 'feature-request', 'bug', 'general', 'other') DEFAULT 'general',
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  
  -- Submitter Information
  submitted_by_user_id BIGINT,
  submitted_by_name VARCHAR(100) NOT NULL,
  submitted_by_email VARCHAR(150) NOT NULL,
  
  -- Status & Resolution
  status ENUM('open', 'in-progress', 'resolved', 'closed') DEFAULT 'open',
  admin_notes TEXT,
  
  resolved_by_user_id BIGINT,
  resolved_at DATETIME,
  
  -- Attachments as JSON array of URLs
  attachments JSON,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_submitted_by (submitted_by_user_id) REFERENCES users(id),
  FOREIGN KEY fk_resolved_by (resolved_by_user_id) REFERENCES users(id),
  
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_category (category),
  INDEX idx_created_at (created_at),
  INDEX idx_submitted_by_email (submitted_by_email),
  INDEX idx_status_priority (status, priority)
);
```

---

## Database Relationships Diagram

```
users (1) ──────────────────┬─────────────────┬──────────────────┐
                             |                 |                  |
                    (Many)   |        (Many)   |         (Many)   |
                             |                 |                  |
                        orders          cart_abandonment    wishlists
                             |                 |                  |
                    (Many)   |                 └──────────────────┘
                             |                          |
                        order_items            (Many)wishlist_items
                             |                          |
                   (Many)    |                    (Many)|
                             └──────────┬────────────────┘
                                        |
                                    products (1)
                                        |
                             ┌──────────┼──────────┬──────────┐
                             |          |          |          |
                      (Many) |   (Many) |  (1)     |  (Many)  |
                             |          |          |          |
                          sales    reviews    inventory   product_views
                             |          |          |          |
                             └──────────┴──────────┴──────────┘

issues ─────────────────────────── users (Many submitters & resolvers)
```

---

## Key Design Decisions

### 1. **Denormalization**
- Order and Sales tables include customer/product information snapshots for historical accuracy
- This prevents data loss if original product prices or customer details change

### 2. **Indexing Strategy**
- Foreign keys have indexes for join performance
- Frequently searched columns (status, date, region) are indexed
- Composite indexes for common analytics queries

### 3. **Constraints**
- CHECK constraints prevent invalid data (negative quantities, prices)
- UNIQUE constraints ensure data integrity (email, invoice_id, product_id)
- FOREIGN KEY constraints maintain referential integrity

### 4. **Computed Columns (Generated Columns)**
- Profit and profit_margin in SALES table calculated automatically
- Improves query performance for analytics

### 5. **JSON Fields**
- Used for flexible data structures (cart_items, attachments, preferences)
- Allows querying without separate tables

### 6. **Timestamps**
- `created_at` - Record creation time
- `updated_at` - Last modification time
- All with UTC timezone recommendation

---

## Performance Optimization Tips

### Query Optimization:
```sql
-- Fast product analytics
SELECT p.category, COUNT(*) as view_count, AVG(pv.view_duration) as avg_duration
FROM products p
JOIN product_views pv ON p.id = pv.product_id
WHERE pv.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY p.category;

-- Sales by region (last 90 days)
SELECT region, SUM(total_amount) as total_sales, COUNT(*) as transaction_count
FROM sales
WHERE sale_date >= DATE_SUB(NOW(), INTERVAL 90 DAY)
GROUP BY region;

-- Low stock alerts
SELECT p.product_id, p.name, i.quantity_in_stock, i.reorder_level
FROM inventory i
JOIN products p ON i.product_id = p.id
WHERE i.quantity_in_stock <= i.reorder_level;
```

### Recommended Indexes for Analytics:
```sql
CREATE INDEX idx_sales_date_region ON sales(sale_date, region);
CREATE INDEX idx_product_views_date ON product_views(created_at, source);
CREATE INDEX idx_order_date_status ON orders(created_at, order_status);
```

---

## Backup & Maintenance

### Recommended Backup Strategy:
- Daily incremental backups
- Weekly full backups
- Monthly archive backups
- Retention: 90 days minimum

### Data Archiving:
```sql
-- Archive old sales records (older than 2 years)
CREATE TABLE sales_archive AS 
SELECT * FROM sales 
WHERE sale_date < DATE_SUB(NOW(), INTERVAL 2 YEAR);

DELETE FROM sales WHERE sale_date < DATE_SUB(NOW(), INTERVAL 2 YEAR);
```

---

**Document Version**: 1.0  
**Database Type**: SQL (MySQL/MariaDB)  
**Total Tables**: 12  
**Last Updated**: March 20, 2026  
**Status**: Production Ready ✅
