# Analytics Implemented (Admin Dashboard)

This file lists all analytics currently implemented and used in the Admin Analytics page.

## 1. Global Analytics Controls

1. Date range filtering (`startDate`, `endDate`) for dashboard analytics API.
2. Trend granularity selection (`day`, `week`, `month`).
3. Quick date presets (`Last 7/30/90/180 Days`, `Year to Date`, `Custom`).
4. Drill-down support on trend chart (month point -> daily view for selected month).
5. Drill-up support to return to previous range/granularity.

## 2. Core API Analytics (`GET /api/analytics/dashboard`)

1. KPI summary (`kpiCards`):
- `totalOrders`
- `totalRevenue`
- `totalCustomers`
- `averageOrderValue`

2. Sales trend (`monthlySalesTrend`) with dynamic granularity:
- Revenue by period
- Orders by period
- Quantity sold by period

3. Daily order activity (`dailyOrderActivity`):
- Daily order count
- Daily revenue

4. Sales by product category (`salesByCategory`):
- Units sold by category
- Order count by category

5. Revenue by product category (`revenueByCategory`).

6. Top selling products (`topSellingProducts`).

7. Least selling products (`leastSellingProducts`).

8. Customer growth (`customerGrowth`):
- New customers by month

9. Top customers (`topCustomers`):
- Revenue by customer
- Order count by customer

10. Order status distribution (`orderStatusDistribution`).

11. Order cancellation analytics (`cancellationData`):
- Total orders
- Cancelled orders
- Cancellation rate

12. Inventory stock levels (`inventoryStockLevels`):
- In-stock quantity
- Reorder level
- Stock status

13. Low stock detection (`lowStockProducts`):
- Product/category
- Deficit
- Alert level (`CRITICAL`/`WARNING`)

14. Fast moving products (`fastMovingProducts`).

15. Slow moving products (`slowMovingProducts`).

16. Price range performance (`priceRangePerformance`):
- Transaction count
- Revenue by price bucket
- Quantity by price bucket

17. Revenue growth rate (`revenueGrowthRate`):
- Growth % vs previous period

18. Customer purchase pattern (`customerPurchasePattern`):
- New customers
- Returning customers

19. Revenue by weekday (`revenueByWeekday`):
- Orders and revenue for Sun-Sat

20. Cumulative revenue trend (`cumulativeRevenueTrend`):
- Daily revenue
- Running cumulative revenue

21. Date metadata in response (`dateRange`):
- Applied `startDate`
- Applied `endDate`
- Applied `granularity`

## 3. Analytics Rendered in Tabs

### Overview Tab
1. KPI cards: Total Orders, Total Revenue, Total Customers, Avg Order Value, Low Stock Items.
2. Sales trend chart (revenue + orders).
3. Daily order activity chart.
4. Cumulative revenue progress chart.
5. Weekday revenue pattern chart.
6. Revenue growth rate chart.
7. Order status distribution pie chart.

### Sales Tab
1. Sales by product category chart.
2. Revenue by category (doughnut/pie) chart.
3. Top selling products chart.
4. Least selling products chart.
5. Price range performance chart.
6. New vs returning customers pie chart.

### Customers Tab
1. Customer growth analysis chart.
2. Top customers by revenue chart.
3. Cancellation rate gauge chart.

### Inventory Tab
1. KPI cards: Total SKUs, Low Stock Alerts, Fast Moving (90d), Slow Moving (90d).
2. Inventory stock levels chart (In Stock vs Reorder Level).
3. Low stock detection table (when applicable).
4. Fast moving products chart.
5. Slow moving products chart.

## 4. Notes

1. All analytics above are date-range aware where data source allows date filtering.
2. Inventory snapshots (stock levels/low stock) are current-state analytics (not time-series snapshots).
3. The dashboard endpoint is designed as a single-call analytics payload for faster page rendering.
