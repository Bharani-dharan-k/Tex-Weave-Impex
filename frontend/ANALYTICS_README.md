# Tex-Weave-Impex Analytics Dashboard

## 📊 Overview

A comprehensive, analyst-centric analytics dashboard built for textile business visualization. Provides deep insights into sales, products, inventory, and customer behavior with interactive charts and real-time data filtering.

## 🎯 Business Insights Provided

### 1. **Main Analytics Dashboard** (`/analytics`)
**Purpose**: Quick overview of business health and key metrics

**Features**:
- **5 KPI Cards** with trend indicators (↑↓)
  - Total Revenue with % change
  - Total Orders growth
  - Customer acquisition trends
  - Average Order Value tracking
  - Low stock alerts count
- **Revenue Trend Line Chart** - Daily revenue over last 30 days
- **Category Performance Bar Chart** - Which textile categories drive revenue
- **Regional Distribution Pie Chart** - Domestic vs Export breakdown
- **Orders & Customers Trend** - Correlation analysis

**Why**: Executives need instant visibility into business performance. This dashboard answers "How are we doing today?"

---

### 2. **Sales Analytics** (`/analytics/sales`)
**Purpose**: Deep-dive into sales performance and revenue trends

**Features**:
- **Daily Sales Revenue Line Chart** - Identify peaks and troughs
- **Orders vs Revenue Bar Chart** - Understand order volume impact
- **Cumulative Sales Growth Area Chart** - Track momentum
- **Time Range Filter** - 30/60/90 days
- **Sales Summary Table** with:
  - Daily breakdown
  - Growth % calculations
  - Sortable columns
- **CSV Export** for offline analysis

**Why**: Sales teams need to identify trends, forecast revenue, and spot anomalies. Answers "Where is our revenue coming from?"

---

### 3. **Product Performance** (`/analytics/products`)
**Purpose**: Analyze which products drive profitability

**Features**:
- **Top 10 Products Bar Chart** - Revenue leaders
- **Category Performance** - Which fabric types sell best
- **Price vs Quantity Scatter Plot** - Identify:
  - Premium low-volume products
  - High-volume affordable products
  - Pricing sweet spots
- **Product Table** with:
  - Units sold
  - Revenue contribution
  - Profit margins
  - Profitability indicators

**Why**: Product managers need to optimize inventory mix and pricing strategy. Answers "What should we stock more of?"

---

### 4. **Inventory Analytics** (`/analytics/inventory`)
**Purpose**: Prevent stockouts and optimize inventory levels

**Features**:
- **Low Stock Alert Banner** - Immediate attention to critical items
- **Current Stock Levels Bar Chart** - Visual inventory status
- **Stock vs Capacity Comparison** - Optimize warehouse space
- **Depletion Timeline** - Forecast when products run out
- **Alert Table** with:
  - Days until stockout
  - Reorder triggers
  - Monthly depletion rates
  - Color-coded status (red/yellow/green)

**Why**: Operations teams need to prevent lost sales from stockouts while avoiding excess inventory. Answers "What do we need to reorder?"

---

### 5. **Customer & Region Analytics** (`/analytics/customers`)
**Purpose**: Understand customer behavior and geographic performance

**Features**:
- **Domestic vs Export Pie Chart** - Market composition
- **Regional Revenue Distribution** - Geographic insights
- **Top 10 Customers Bar Chart** - Key account identification
- **Customer Table** with:
  - Order frequency
  - Revenue contribution
  - Average order value
  - Last order date (churn risk)

**Why**: Sales and marketing teams need to identify valuable customers and growth regions. Answers "Who are our best customers?"

---

## 🛠️ Technical Implementation

### Tech Stack
- **React 19** with Vite
- **Recharts** - Declarative charting library
- **date-fns** - Date manipulation and formatting
- **lucide-react** - Icon library
- **React Router** - Multi-page navigation

### File Structure
```
src/analytics/
├── components/          # Reusable chart components
│   ├── KPICard.jsx     # Metric cards with trends
│   ├── LineChart.jsx   # Time-series visualization
│   ├── BarChart.jsx    # Categorical comparison
│   ├── AreaChart.jsx   # Cumulative trends
│   ├── PieChart.jsx    # Distribution analysis
│   ├── ScatterChart.jsx # Correlation analysis
│   └── Charts.css      # Shared chart styles
├── pages/              # Dashboard pages
│   ├── AnalyticsDashboard.jsx  # Main overview
│   ├── SalesAnalytics.jsx      # Sales deep-dive
│   ├── ProductPerformance.jsx  # Product analysis
│   ├── InventoryAnalytics.jsx  # Stock management
│   └── CustomerAnalytics.jsx   # Customer insights
├── services/
│   └── dataService.js  # Mock data & utilities
└── AnalyticsLayout.jsx # Navigation wrapper
```

### Data Structure
All mock data shaped like real API responses:
```javascript
{
  date: "2026-01-30",
  revenue: 125000,
  orders: 42,
  customers: 35,
  region: "North India",
  category: "Cotton Fabric"
}
```

### Chart Component Pattern
```javascript
<LineChart
  data={salesData}
  xKey="date"
  yKeys={[{ dataKey: 'revenue', name: 'Revenue' }]}
  colors={['#667eea']}
  title="Revenue Over Time"
  valuePrefix="₹"
  height={350}
/>
```

---

## 🎨 UX Features

### Analyst-Friendly Design
1. **Tooltips** - Hover over any data point for detailed information
2. **Legends** - Clear labeling of all metrics
3. **Axis Units** - All axes show ₹, %, or quantity units
4. **Responsive** - Works on desktop and tablet
5. **Empty States** - Graceful handling of no data
6. **Color Consistency** - Same metrics use same colors across charts

### Export Capabilities
- **CSV Download** - Export raw data for Excel analysis
- **Date Filtering** - Focus on relevant time periods
- **Trend Indicators** - Visual ↑↓ with percentage changes

### Visual Hierarchy
- **Gradient Colors** - Modern professional look
- **Card Shadows** - Depth perception
- **Hover Effects** - Interactive feedback
- **Conditional Formatting** - Red/yellow/green status indicators

---

## 📈 Key Metrics Explained

### KPI Calculations
```javascript
// Revenue Growth
((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(2)

// Profit Margin
((revenue - cost) / revenue * 100).toFixed(2)

// Days Until Stockout
Math.floor(currentStock / monthlyDepletion)

// Average Order Value
revenue / orders
```

### Chart Types & Use Cases

| Chart Type | Best For | Example Use |
|------------|----------|-------------|
| Line Chart | Trends over time | Daily revenue tracking |
| Bar Chart | Categorical comparison | Products by revenue |
| Area Chart | Cumulative growth | Total sales momentum |
| Pie Chart | Distribution | Regional market share |
| Scatter Plot | Correlation | Price vs volume relationship |

---

## 🚀 Usage

### Navigate to Analytics
```
http://localhost:5173/analytics
```

### Available Routes
- `/analytics` - Main dashboard
- `/analytics/sales` - Sales analysis
- `/analytics/products` - Product performance
- `/analytics/inventory` - Stock management
- `/analytics/customers` - Customer insights

### Export Data
Click the **Export CSV** button on any page to download filtered data for offline analysis in Excel or Google Sheets.

---

## 🔄 Data Updates

Currently uses mock data from `dataService.js`. To connect to real API:

1. Replace mock functions in `dataService.js`:
```javascript
// Before
export const getSalesData = (days = 90) => {
  return generateMockData();
};

// After
export const getSalesData = async (days = 90) => {
  const response = await fetch(`/api/analytics/sales?days=${days}`);
  return response.json();
};
```

2. Add loading states to components
3. Handle API errors gracefully

---

## 💡 Business Value

### For Executives
- **Quick Health Check** - 5-second business overview
- **Trend Identification** - Spot growth or decline early
- **Data-Driven Decisions** - Replace gut feel with facts

### For Sales Teams
- **Performance Tracking** - Individual and team metrics
- **Customer Intelligence** - Who to focus on
- **Territory Analysis** - Geographic opportunities

### For Operations
- **Inventory Optimization** - Reduce carrying costs
- **Stockout Prevention** - Never miss a sale
- **Demand Forecasting** - Plan procurement better

### For Product Managers
- **Product Mix Optimization** - What to stock
- **Pricing Strategy** - Premium vs volume
- **Profitability Focus** - Margin analysis

---

## 🎓 Chart Interpretation Guide

### Line Chart Patterns
- **Upward Trend** - Positive growth momentum
- **Downward Trend** - Investigate causes
- **Seasonality** - Recurring patterns
- **Spikes** - One-time events or promotions

### Scatter Plot Insights
- **Top Right** - High price, high volume (premium winners)
- **Top Left** - Low price, high volume (mass market)
- **Bottom Right** - High price, low volume (niche luxury)
- **Bottom Left** - Low price, low volume (phase out?)

### Pie Chart Analysis
- **Large Slices** - Core business focus
- **Many Small Slices** - Fragmented market
- **Changing Proportions** - Shifting strategy

---

## 📊 Sample Insights

### Example: Product Analysis
"Cotton T-Shirts generate ₹1.24M revenue from 6,200 units at ₹200 each. Despite 40% profit margin, they're low-margin due to volume pricing. Consider: (1) Premium line at ₹350, or (2) Increase volume to 10K units for economies of scale."

### Example: Inventory Alert
"Silk Blend Fabric has only 45 days of stock remaining at current depletion rate. Monthly usage is 30 units. Trigger reorder NOW to avoid Q2 stockout during wedding season."

### Example: Customer Segmentation
"Fashion Hub Pvt Ltd (145 orders, ₹2.85M) is top customer but avg order value declined 12% vs last quarter. Schedule account review to understand needs shift."

---

## 🔧 Customization

### Add New Chart
```javascript
import MyChart from '../components/MyChart';

<MyChart
  data={myData}
  title="My Custom Analysis"
  // ... other props
/>
```

### Modify Colors
Edit the color arrays in chart components:
```javascript
colors={['#667eea', '#764ba2', '#43e97b']}
```

### Add New KPI
```javascript
<KPICard
  title="New Metric"
  value={calculatedValue}
  change={percentChange}
  icon={MyIcon}
/>
```

---

## 📝 Notes

- All currency values in Indian Rupees (₹)
- Mock data represents realistic textile business scenarios
- Charts auto-format large numbers (e.g., ₹125k instead of ₹125,000)
- Responsive breakpoints at 768px (tablet) and 1200px (desktop)
- Color scheme optimized for accessibility

---

## 🎯 Future Enhancements

1. **Real-time Updates** - WebSocket connection for live data
2. **Drill-down** - Click charts to see detailed breakdowns
3. **Custom Date Ranges** - Calendar picker for any period
4. **Saved Views** - Bookmark favorite analyses
5. **Alerts** - Email notifications for critical metrics
6. **Forecasting** - ML-powered predictions
7. **Comparison Mode** - Side-by-side period analysis
8. **PDF Reports** - Automated report generation

---

Built with ❤️ for data-driven decision making
