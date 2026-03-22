# Database Design - Inventory Management System with Data Analytics
## Senthil Murugan Electricals

---

## 1. Database Overview

The database design for Senthil Murugan Electricals' Inventory Management System consists of **6 core entities** that work together to manage suppliers, products, staff, sales transactions, and inventory tracking. The system supports real-time inventory monitoring and comprehensive data analytics.

---

## 2. Entity Descriptions

### 2.1 ADMIN Entity
**Purpose**: Stores administrator information for system access control and secure authentication.

| Field | Type | Constraint | Description |
|-------|------|-----------|-------------|
| admin_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique administrator identifier |
| name | VARCHAR(100) | NOT NULL | Full name of administrator |
| email | VARCHAR(100) | NOT NULL, UNIQUE | Email address (used for login) |
| password | VARCHAR(255) | NOT NULL | Hashed password for authentication |
| phone | VARCHAR(20) | NOT NULL | Contact phone number |
| created_date | DATETIME | DEFAULT CURRENT_TIMESTAMP | Account creation date |
| status | ENUM('active', 'inactive') | DEFAULT 'active' | Administrator status |

**Relationships**: 
- One Admin can manage multiple Products

---

### 2.2 SUPPLIER Entity
**Purpose**: Maintains supplier information and contact details for product sourcing.

| Field | Type | Constraint | Description |
|-------|------|-----------|-------------|
| supplier_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique supplier identifier |
| supplier_name | VARCHAR(150) | NOT NULL | Name of the supply company |
| contact_person | VARCHAR(100) | NOT NULL | Primary contact person name |
| phone | VARCHAR(20) | NOT NULL | Supplier contact phone |
| email | VARCHAR(100) | NOT NULL | Supplier email address |
| address | VARCHAR(255) | NOT NULL | Physical address |
| city | VARCHAR(50) | | City location |
| state | VARCHAR(50) | | State/Province |
| payment_terms | VARCHAR(100) | | Terms of payment (e.g., 30 days net) |
| created_date | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation date |
| status | ENUM('active', 'inactive') | DEFAULT 'active' | Supplier status |

**Relationships**:
- One Supplier supplies many Products

---

### 2.3 PRODUCT Entity
**Purpose**: Stores product information, sourcing details, and inventory levels.

| Field | Type | Constraint | Description |
|-------|------|-----------|-------------|
| product_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique product identifier |
| supplier_id | INT | FOREIGN KEY (Supplier) | Links to supplier providing this product |
| product_name | VARCHAR(200) | NOT NULL | Name of the product |
| category | VARCHAR(100) | NOT NULL | Product category/classification |
| description | TEXT | | Detailed product description |
| price | DECIMAL(10, 2) | NOT NULL | Current selling price |
| cost_price | DECIMAL(10, 2) | | Cost price from supplier |
| quantity | INT | NOT NULL, DEFAULT 0 | Current stock quantity |
| reorder_level | INT | | Minimum quantity for reordering |
| stock_status | ENUM('in_stock', 'low_stock', 'out_of_stock') | NOT NULL | Current stock status |
| sku | VARCHAR(50) | UNIQUE | Stock keeping unit code |
| unit_of_measurement | VARCHAR(20) | | Unit (pieces, kg, liters, etc.) |
| created_date | DATETIME | DEFAULT CURRENT_TIMESTAMP | Product creation date |
| last_updated | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last modification date |

**Relationships**:
- Many Products belong to one Supplier
- One Product appears in many Sales transactions
- One Product has multiple Inventory Tracking records

**Indexes**:
- `INDEX(supplier_id)` - For quick supplier lookups
- `INDEX(category)` - For category-based analytics
- `UNIQUE(sku)` - For preventing duplicate SKUs
- `INDEX(stock_status)` - For inventory alerts

---

### 2.4 STAFF Entity
**Purpose**: Maintains employee information and authentication credentials.

| Field | Type | Constraint | Description |
|-------|------|-----------|-------------|
| staff_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique staff identifier |
| staff_name | VARCHAR(100) | NOT NULL | Full name of staff member |
| phone | VARCHAR(20) | NOT NULL | Contact phone number |
| email | VARCHAR(100) | NOT NULL, UNIQUE | Email address (used for login) |
| password | VARCHAR(255) | NOT NULL | Hashed password for authentication |
| role | ENUM('sales_exec', 'inventory_manager', 'manager', 'admin') | NOT NULL | Job role/designation |
| department | VARCHAR(50) | | Department assignment |
| hire_date | DATE | NOT NULL | Employment start date |
| salary | DECIMAL(10, 2) | | Monthly salary (sensitive - access controlled) |
| address | VARCHAR(255) | | Residential address |
| status | ENUM('active', 'inactive', 'on_leave') | DEFAULT 'active' | Employment status |
| created_date | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation date |

**Relationships**:
- One Staff member processes many Sales transactions

**Indexes**:
- `UNIQUE(email)` - Prevent duplicate emails
- `INDEX(role)` - For role-based access control
- `INDEX(status)` - For active staff filtering

---

### 2.5 SALES Entity
**Purpose**: Records all sales transactions for revenue tracking and analytics.

| Field | Type | Constraint | Description |
|-------|------|-----------|-------------|
| sales_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique sales transaction identifier |
| product_id | INT | FOREIGN KEY (Product) | Links to product sold |
| staff_id | INT | FOREIGN KEY (Staff) | Links to staff who processed sale |
| quantity_sold | INT | NOT NULL | Number of units sold |
| unit_price | DECIMAL(10, 2) | NOT NULL | Price per unit at time of sale |
| total_amount | DECIMAL(12, 2) | NOT NULL | Total sale amount (quantity × unit_price) |
| discount_percentage | DECIMAL(5, 2) | DEFAULT 0 | Discount applied (if any) |
| discount_amount | DECIMAL(10, 2) | DEFAULT 0 | Actual discount in currency |
| final_amount | DECIMAL(12, 2) | NOT NULL | Amount after discount |
| payment_method | ENUM('cash', 'card', 'cheque', 'digital') | NOT NULL | Mode of payment |
| sales_date | DATETIME | NOT NULL | Date and time of transaction |
| invoice_number | VARCHAR(50) | UNIQUE | Invoice reference number |
| customer_name | VARCHAR(100) | | Customer name (for analytics) |
| customer_phone | VARCHAR(20) | | Customer contact (for follow-up) |
| notes | TEXT | | Additional notes/comments |
| created_date | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Relationships**:
- Many Sales transactions involve one Product
- Many Sales transactions are processed by one Staff member

**Indexes**:
- `INDEX(product_id)` - For quick product lookups
- `INDEX(staff_id)` - For staff performance analytics
- `INDEX(sales_date)` - For date-range queries and analytics
- `INDEX(invoice_number)` - For invoice lookup
- `COMPOSITE INDEX(sales_date, staff_id)` - For staff daily analytics

---

### 2.6 INVENTORY_TRACKING Entity
**Purpose**: Maintains detailed inventory movement history for stock audits and analytics.

| Field | Type | Constraint | Description |
|-------|------|-----------|-------------|
| inventory_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique tracking record identifier |
| product_id | INT | FOREIGN KEY (Product) | Links to product being tracked |
| previous_quantity | INT | NOT NULL | Stock quantity before update |
| updated_quantity | INT | NOT NULL | Stock quantity after update |
| quantity_change | INT | | Difference (updated - previous) |
| update_type | ENUM('purchase', 'sale', 'adjustment', 'damage', 'return') | NOT NULL | Type of inventory change |
| update_date | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | When the update occurred |
| status | ENUM('completed', 'pending', 'cancelled') | DEFAULT 'completed' | Update status |
| change_reason | VARCHAR(255) | | Reason for inventory change |
| updated_by | INT | | User ID who made the update |
| reference_id | VARCHAR(50) | | Reference to sales/purchase order |
| notes | TEXT | | Additional notes |
| created_date | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Relationships**:
- Many Inventory Tracking records relate to one Product

**Indexes**:
- `INDEX(product_id)` - For product history lookup
- `INDEX(update_date)` - For date-range inventory analysis
- `INDEX(update_type)` - For movement type filtering
- `COMPOSITE INDEX(product_id, update_date)` - For product timeline analysis

---

## 3. Relationships & Cardinality

```
ADMIN (1) ──manages──> (Many) PRODUCT
SUPPLIER (1) ──supplies──> (Many) PRODUCT
PRODUCT (1) ──involved_in──> (Many) SALES
STAFF (1) ──processes──> (Many) SALES
PRODUCT (1) ──tracked_by──> (Many) INVENTORY_TRACKING
```

### Key Relationships:

1. **Admin → Product**: One administrator manages multiple products (approval/modification)
2. **Supplier → Product**: One supplier provides multiple products (sourcing relationship)
3. **Product → Sales**: One product can be sold multiple times (revenue tracking)
4. **Staff → Sales**: One staff member processes multiple sales (performance metrics)
5. **Product → Inventory Tracking**: One product has multiple inventory history records (audit trail)

---

## 4. Data Types & Constraints

### Primary Keys (PK)
- Auto-incrementing integers ensure uniqueness and performance

### Foreign Keys (FK)
- Enforce referential integrity
- Enable cascade operations (delete/update)

### Unique Constraints
- `Email` fields prevent duplicate authentication identities
- `SKU` prevents duplicate product codes
- `Invoice Number` ensures unique transaction references

### Check Constraints (Recommended)
- `Price > 0` in Product and Sales tables
- `Quantity >= 0` in Product table
- `Quantity_Sold > 0` in Sales table
- `Total_Amount >= Final_Amount` in Sales table

### Default Values
- Timestamps default to CURRENT_TIMESTAMP
- Status fields default to 'active'
- Discount fields default to 0

---

## 5. Analytics Support

The database design supports the following analytics:

### Sales Analytics
- Revenue by product, category, staff, date range
- Sales trends and patterns
- Peak selling periods
- Staff performance metrics

### Inventory Analytics
- Stock movement history
- Turnover rates
- Stock-out incidents
- Reorder pattern analysis

### Supplier Analytics
- Supplier performance
- Delivery timeliness
- Cost analysis

### Customer Analytics
- Purchase patterns
- Customer lifetime value
- Repeat customer identification

---

## 6. Normalization

The design follows **Third Normal Form (3NF)**:
- ✅ All tables have primary keys
- ✅ No transitive dependencies
- ✅ All non-key attributes depend solely on the primary key
- ✅ Minimal data redundancy
- ✅ Referential integrity maintained through foreign keys

---

## 7. Performance Considerations

### Indexes Created:
1. Foreign keys for join performance
2. Frequently searched columns (category, status, role)
3. Date columns for range queries
4. Composite indexes for complex analytics queries

### Query Optimization:
- Denormalization may be considered for frequently-accessed computed values (e.g., stock value)
- Archive tables recommended for historical sales data
- Materialized views for complex analytics

---

## 8. Security Considerations

1. **Password Fields**: Store hashed passwords (bcrypt/SHA-256)
2. **Sensitive Data**: Restrict access to salary information
3. **Audit Trail**: Inventory_Tracking provides complete change history
4. **Role-Based Access**: Staff roles enforce permission levels
5. **Data Validation**: Ensure all inputs are sanitized

---

## 9. Implementation Status

✅ **Entities Defined**: All 6 core entities designed
✅ **Relationships Mapped**: One-to-many relationships established
✅ **Constraints Applied**: Primary keys, foreign keys, unique constraints
⏳ **Database Creation**: Ready for SQL implementation
⏳ **Backend Integration**: Awaiting MongoDB schema mapping (if using NoSQL)

---

## 10. Next Steps

1. Create SQL DDL scripts for database creation
2. Set up database user roles and permissions
3. Create database views for common queries
4. Implement data validation at application layer
5. Set up automated backups
6. Configure indexes based on actual usage patterns
7. Monitor and optimize query performance

---

**Document Version**: 1.0  
**Last Updated**: March 20, 2026  
**System**: Inventory Management System with Data Analytics  
**Organization**: Senthil Murugan Electricals
