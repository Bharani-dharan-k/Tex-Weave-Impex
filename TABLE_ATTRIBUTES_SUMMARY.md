# Database Tables & Attributes - Impes Tex Weave
## Inventory Management System with E-Commerce & Analytics

---

## TABLE 1: USERS
**Description**: Customer, Admin, and Staff account information with authentication

| Attribute | Data Type | Constraint | Description |
|-----------|-----------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| name | VARCHAR(100) | NOT NULL | Full name |
| email | VARCHAR(150) | NOT NULL, UNIQUE | Email address (login) |
| phone | VARCHAR(20) | NULLABLE | Contact number |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| role | ENUM | DEFAULT 'user' | admin / user / customer |
| profile_picture | VARCHAR(500) | NULLABLE | Profile image URL |
| company_name | VARCHAR(150) | NULLABLE | Customer company |
| customer_type | ENUM | NULLABLE | Retailer/Wholesaler/Manufacturer/Distributor |
| gst_number | VARCHAR(50) | NULLABLE | GST registration number |
| billing_street | VARCHAR(255) | NULLABLE | Billing address - street |
| billing_city | VARCHAR(100) | NULLABLE | Billing address - city |
| billing_state | VARCHAR(100) | NULLABLE | Billing address - state |
| billing_country | VARCHAR(100) | DEFAULT 'India' | Billing address - country |
| billing_pincode | VARCHAR(10) | NULLABLE | Billing address - pincode |
| shipping_street | VARCHAR(255) | NULLABLE | Shipping address - street |
| shipping_city | VARCHAR(100) | NULLABLE | Shipping address - city |
| shipping_state | VARCHAR(100) | NULLABLE | Shipping address - state |
| shipping_country | VARCHAR(100) | DEFAULT 'India' | Shipping address - country |
| shipping_pincode | VARCHAR(10) | NULLABLE | Shipping address - pincode |
| products_interested | JSON | NULLABLE | Array of interested products |
| monthly_volume | ENUM | NULLABLE | Less than 1000 / 1000-5000 / 5000-10000 / 10000+ |
| gsm_range | ENUM | NULLABLE | 100-150 / 150-200 / 200-300 / 300+ |
| color_preference | VARCHAR(100) | NULLABLE | Preferred colors |
| gst_certificate | VARCHAR(500) | NULLABLE | GST certificate URL |
| trade_license | VARCHAR(500) | NULLABLE | Trade license URL |
| is_active | BOOLEAN | DEFAULT true | Account status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | AUTO UPDATE | Last modification date |
| last_login | TIMESTAMP | NULLABLE | Last login time |

---

## TABLE 2: PRODUCTS
**Description**: Textile product inventory with pricing, categorization, and availability

| Attribute | Data Type | Constraint | Description |
|-----------|-----------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique product identifier |
| product_id | VARCHAR(50) | NOT NULL, UNIQUE | Product code (e.g., COTT-001) |
| name | VARCHAR(200) | NOT NULL | Product name |
| category | ENUM | DEFAULT 'Other' | Cotton/Polyester/Silk/Wool/Linen/Blended/Other |
| description | TEXT | NULLABLE | Product description |
| cost_price | DECIMAL(10,2) | NOT NULL, >= 0 | Cost price per unit |
| selling_price | DECIMAL(10,2) | NOT NULL, >= 0 | Selling price per unit |
| unit | ENUM | DEFAULT 'meters' | meters / kg / pieces / rolls |
| reorder_level | INT | DEFAULT 10, >= 0 | Minimum stock threshold |
| image_url | VARCHAR(500) | NULLABLE | Cloudinary image URL |
| image_public_id | VARCHAR(200) | NULLABLE | Cloudinary public ID (for deletion) |
| is_active | BOOLEAN | DEFAULT true | Product availability status |
| source | ENUM | DEFAULT 'manual' | manual / csv_upload |
| profit_margin | DECIMAL(10,2) | NULLABLE | Computed profit margin % |
| profit_amount | DECIMAL(10,2) | NULLABLE | Computed profit per unit |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Product creation date |
| updated_at | TIMESTAMP | AUTO UPDATE | Last modification date |

---

## TABLE 3: INVENTORY
**Description**: Real-time stock tracking and warehouse management

| Attribute | Data Type | Constraint | Description |
|-----------|-----------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique inventory record ID |
| product_id | BIGINT | NOT NULL, UNIQUE, FK | References products(id) |
| quantity_in_stock | INT | DEFAULT 0, >= 0 | Current stock quantity |
| warehouse_location | VARCHAR(100) | DEFAULT 'Main Warehouse' | Storage location |
| reorder_level | INT | DEFAULT 10, >= 0 | Minimum quantity before reorder |
| max_stock_level | INT | NULLABLE, >= 0 | Maximum capacity |
| last_restock_date | DATETIME | NULLABLE | Last time stock was added |
| last_sale_date | DATETIME | NULLABLE | Last time product was sold |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |
| updated_at | TIMESTAMP | AUTO UPDATE | Last modification date |

---

## TABLE 4: ORDERS
**Description**: Customer purchase orders with payment and shipping information

| Attribute | Data Type | Constraint | Description |
|-----------|-----------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique order ID |
| order_id | VARCHAR(50) | NOT NULL, UNIQUE | Order reference number |
| user_id | BIGINT | NOT NULL, FK | References users(id) |
| subtotal | DECIMAL(12,2) | NOT NULL | Sum of item prices |
| tax | DECIMAL(10,2) | DEFAULT 0 | Tax amount |
| shipping_charges | DECIMAL(10,2) | DEFAULT 0 | Shipping cost |
| total_amount | DECIMAL(12,2) | NOT NULL | Final order amount |
| payment_method | ENUM | DEFAULT 'razorpay' | razorpay / cod / bank_transfer |
| payment_status | ENUM | DEFAULT 'pending' | pending / completed / failed / refunded |
| razorpay_order_id | VARCHAR(100) | NULLABLE | Razorpay transaction ID |
| razorpay_payment_id | VARCHAR(100) | NULLABLE | Razorpay payment ID |
| razorpay_signature | VARCHAR(200) | NULLABLE | Razorpay signature (verification) |
| order_status | ENUM | DEFAULT 'pending' | pending / confirmed / processing / shipped / delivered / cancelled |
| billing_street | VARCHAR(255) | NULLABLE | Billing address - street |
| billing_city | VARCHAR(100) | NULLABLE | Billing address - city |
| billing_state | VARCHAR(100) | NULLABLE | Billing address - state |
| billing_country | VARCHAR(100) | DEFAULT 'India' | Billing address - country |
| billing_pincode | VARCHAR(10) | NULLABLE | Billing address - pincode |
| shipping_street | VARCHAR(255) | NULLABLE | Shipping address - street |
| shipping_city | VARCHAR(100) | NULLABLE | Shipping address - city |
| shipping_state | VARCHAR(100) | NULLABLE | Shipping address - state |
| shipping_country | VARCHAR(100) | DEFAULT 'India' | Shipping address - country |
| shipping_pincode | VARCHAR(10) | NULLABLE | Shipping address - pincode |
| customer_name | VARCHAR(100) | NULLABLE | Customer full name (snapshot) |
| customer_email | VARCHAR(150) | NULLABLE | Customer email (snapshot) |
| customer_phone | VARCHAR(20) | NULLABLE | Customer phone (snapshot) |
| customer_company_name | VARCHAR(150) | NULLABLE | Customer company (snapshot) |
| tracking_number | VARCHAR(100) | NULLABLE | Courier tracking number |
| estimated_delivery | DATE | NULLABLE | Expected delivery date |
| delivered_at | DATETIME | NULLABLE | Actual delivery date/time |
| cancelled_at | DATETIME | NULLABLE | Cancellation date/time |
| cancellation_reason | VARCHAR(255) | NULLABLE | Reason for cancellation |
| notes | TEXT | NULLABLE | Order notes/comments |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Order creation date |
| updated_at | TIMESTAMP | AUTO UPDATE | Last modification date |

---

## TABLE 5: ORDER_ITEMS
**Description**: Individual product line items within an order (Normalized)

| Attribute | Data Type | Constraint | Description |
|-----------|-----------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique line item ID |
| order_id | BIGINT | NOT NULL, FK | References orders(id) |
| product_id | BIGINT | NOT NULL, FK | References products(id) |
| product_name | VARCHAR(200) | NOT NULL | Product name (snapshot) |
| product_id_code | VARCHAR(50) | NULLABLE | Product code (snapshot) |
| unit | VARCHAR(20) | NULLABLE | meters / kg / pieces / rolls |
| quantity | INT | NOT NULL, >= 1 | Units ordered |
| price_per_unit | DECIMAL(10,2) | NOT NULL | Price at time of order |
| total_price | DECIMAL(12,2) | NOT NULL | quantity × price_per_unit |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Line item creation date |

---

## TABLE 6: SALES
**Description**: Sales transactions with revenue, profit tracking, and regional analysis

| Attribute | Data Type | Constraint | Description |
|-----------|-----------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique sales record ID |
| invoice_id | VARCHAR(50) | NOT NULL, UNIQUE | Invoice reference number |
| product_id | VARCHAR(50) | NOT NULL | Product code (can link to Product.product_id) |
| product_name | VARCHAR(200) | NULLABLE | Product name (snapshot) |
| quantity_sold | DECIMAL(10,3) | NOT NULL, > 0 | Units sold (supports fractional units like meters) |
| unit_price | DECIMAL(10,2) | NOT NULL, >= 0 | Selling price per unit |
| cost_price | DECIMAL(10,2) | NULLABLE, >= 0 | Cost price per unit |
| total_amount | DECIMAL(12,2) | NOT NULL, >= 0 | quantity_sold × unit_price |
| profit | DECIMAL(12,2) | COMPUTED | ((unit_price - cost_price) × quantity_sold) |
| profit_margin | DECIMAL(5,2) | COMPUTED | Profit percentage |
| sale_date | DATETIME | NOT NULL, DEFAULT NOW | Date and time of sale |
| customer_name | VARCHAR(100) | NULLABLE | Customer name (for reference) |
| sales_person | VARCHAR(100) | NULLABLE | Sales staff name |
| region | ENUM | DEFAULT 'Central' | North / South / East / West / Central |
| payment_status | ENUM | DEFAULT 'Paid' | Paid / Pending / Partial |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |
| updated_at | TIMESTAMP | AUTO UPDATE | Last modification date |

---

## TABLE 7: REVIEWS
**Description**: Customer product reviews and ratings

| Attribute | Data Type | Constraint | Description |
|-----------|-----------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique review ID |
| product_id | BIGINT | NOT NULL, FK | References products(id) |
| user_id | BIGINT | NOT NULL, FK | References users(id) |
| order_id | BIGINT | NOT NULL, FK | References orders(id) |
| rating | INT | NOT NULL, 1-5 | Star rating (1-5 stars) |
| review_title | VARCHAR(100) | NULLABLE | Review headline |
| review_text | VARCHAR(1000) | NOT NULL | Detailed review |
| is_verified_purchase | BOOLEAN | DEFAULT true | Confirmed purchase review |
| helpful_count | INT | DEFAULT 0 | Number of helpful votes |
| not_helpful_count | INT | DEFAULT 0 | Number of unhelpful votes |
| status | ENUM | DEFAULT 'approved' | pending / approved / rejected |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Review submission date |
| updated_at | TIMESTAMP | AUTO UPDATE | Last modification date |

---

## TABLE 8: WISHLISTS
**Description**: Customer wishlist containers

| Attribute | Data Type | Constraint | Description |
|-----------|-----------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique wishlist ID |
| user_id | BIGINT | NOT NULL, UNIQUE, FK | References users(id) - One per user |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Wishlist creation date |
| updated_at | TIMESTAMP | AUTO UPDATE | Last modification date |

---

## TABLE 9: WISHLIST_ITEMS
**Description**: Individual products in customer wishlists (Normalized)

| Attribute | Data Type | Constraint | Description |
|-----------|-----------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique wishlist item ID |
| wishlist_id | BIGINT | NOT NULL, FK | References wishlists(id) |
| product_id | BIGINT | NOT NULL, FK | References products(id) |
| added_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When product was added to wishlist |

---

## TABLE 10: CART_ABANDONMENT
**Description**: Abandoned shopping cart tracking for re-engagement analytics

| Attribute | Data Type | Constraint | Description |
|-----------|-----------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique cart abandonment record ID |
| user_id | BIGINT | NOT NULL, FK | References users(id) |
| total_value | DECIMAL(12,2) | NOT NULL | Total cart value at abandonment |
| abandoned_at | TIMESTAMP | DEFAULT NOW | When cart was abandoned |
| recovered | BOOLEAN | DEFAULT false | Did customer complete purchase? |
| recovered_at | DATETIME | NULLABLE | When/if cart was recovered |
| cart_items | JSON | NOT NULL | JSON array of abandoned items |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |
| updated_at | TIMESTAMP | AUTO UPDATE | Last modification date |

---

## TABLE 11: PRODUCT_VIEWS
**Description**: Product page analytics - customer behavior tracking

| Attribute | Data Type | Constraint | Description |
|-----------|-----------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique view record ID |
| product_id | BIGINT | NOT NULL, FK | References products(id) |
| user_id | BIGINT | NULLABLE, FK | References users(id) - NULL for anonymous |
| session_id | VARCHAR(100) | NULLABLE | Browser session identifier |
| view_duration | INT | DEFAULT 0 | Time spent viewing (in seconds) |
| source | ENUM | DEFAULT 'direct' | search / category / recommendation / direct / wishlist |
| device_type | ENUM | DEFAULT 'desktop' | mobile / tablet / desktop |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | View timestamp |
| updated_at | TIMESTAMP | AUTO UPDATE | Last modification date |

---

## TABLE 12: ISSUES
**Description**: Support tickets, bug reports, and customer feedback

| Attribute | Data Type | Constraint | Description |
|-----------|-----------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique issue ID |
| issue_type | ENUM | NOT NULL | issue / contact / feedback |
| category | ENUM | DEFAULT 'general' | technical / billing / feature-request / bug / general / other |
| priority | ENUM | DEFAULT 'medium' | low / medium / high / critical |
| subject | VARCHAR(255) | NOT NULL | Issue title/subject |
| description | TEXT | NOT NULL | Detailed description |
| submitted_by_user_id | BIGINT | NULLABLE, FK | References users(id) |
| submitted_by_name | VARCHAR(100) | NOT NULL | Submitter's name |
| submitted_by_email | VARCHAR(150) | NOT NULL | Submitter's email |
| status | ENUM | DEFAULT 'open' | open / in-progress / resolved / closed |
| admin_notes | TEXT | NULLABLE | Notes from support team |
| resolved_by_user_id | BIGINT | NULLABLE, FK | References users(id) - Admin who resolved |
| resolved_at | DATETIME | NULLABLE | Issue resolution date/time |
| attachments | JSON | NULLABLE | JSON array of file URLs |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Issue submission date |
| updated_at | TIMESTAMP | AUTO UPDATE | Last modification date |

---

## SUMMARY TABLE

| Table Name | Purpose | Key Fields | Record Count |
|-----------|---------|-----------|--------------|
| USERS | Customer/Admin accounts | email, role, company_name, gst_number | ~1000s |
| PRODUCTS | Product inventory | product_id, category, price, stock_status | ~100s |
| INVENTORY | Stock tracking | quantity_in_stock, reorder_level | 1:1 with Products |
| ORDERS | Customer purchases | order_id, total_amount, payment_status | ~1000s |
| ORDER_ITEMS | Order line items | product_id, quantity, price_per_unit | ~5000s |
| SALES | Sales transactions | invoice_id, quantity_sold, profit | ~10000s |
| REVIEWS | Product ratings | rating (1-5), review_text, helpful_count | ~1000s |
| WISHLISTS | User wishlists | user_id (unique) | ~1:1 with Users |
| WISHLIST_ITEMS | Wishlist products | product_id | ~1000s |
| CART_ABANDONMENT | Abandoned carts | total_value, recovered | ~100s-1000s |
| PRODUCT_VIEWS | Analytics tracking | source, device_type, view_duration | ~10000s+ |
| ISSUES | Support tickets | priority, status, category | ~100s-1000s |

---

**Total Tables**: 12  
**Total Attributes**: 150+  
**Primary Keys**: 12  
**Foreign Keys**: 15+  
**Indexes**: 40+  

**Organization**: Impes Tex Weave  
**System**: Inventory Management with E-Commerce & Analytics  
**Database Type**: SQL (MySQL/MariaDB/PostgreSQL)  
**Status**: ✅ Production Ready
