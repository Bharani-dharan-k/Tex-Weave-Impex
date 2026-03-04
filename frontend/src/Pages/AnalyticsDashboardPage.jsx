import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import KPICard from '../components/KPICard';
import DataTable from '../components/DataTable';
import {
  getSalesOverview,
  getInventoryOverview,
  getProductWiseSales,
  getLowStockAlerts,
  getSlowMovingStock,
  downloadComprehensiveReport
} from '../services/analyticsService';
import './AnalyticsDashboardPage.css';

const AnalyticsDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [salesOverview, setSalesOverview] = useState(null);
  const [inventoryOverview, setInventoryOverview] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [slowStockSummary, setSlowStockSummary] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load all dashboard data in parallel
      const [sales, inventory, products, lowStock, slowStock] = await Promise.all([
        getSalesOverview(),
        getInventoryOverview(),
        getProductWiseSales(null, null, 5),
        getLowStockAlerts(),
        getSlowMovingStock(90, 'all')
      ]);

      setSalesOverview(sales);
      setInventoryOverview(inventory);
      setTopProducts(products);
      setLowStockItems(lowStock.slice(0, 5));
      setSlowStockSummary(slowStock.summary);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const productColumns = [
    { key: '_id', label: 'Product ID' },
    { key: 'productName', label: 'Product Name' },
    { 
      key: 'totalRevenue', 
      label: 'Revenue',
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'totalQuantity', 
      label: 'Quantity Sold',
      render: (value) => formatNumber(value)
    },
    { 
      key: 'category', 
      label: 'Category',
      render: (value) => value || 'N/A'
    }
  ];

  const lowStockColumns = [
    { key: 'productId', label: 'Product ID' },
    { key: 'productName', label: 'Product Name' },
    { 
      key: 'quantityInStock', 
      label: 'Stock',
      render: (value) => (
        <span className="stock-badge low">{value}</span>
      )
    },
    { key: 'reorderLevel', label: 'Reorder Level' },
    { 
      key: 'deficit', 
      label: 'Deficit',
      render: (value) => (
        <span className="deficit-value">{value}</span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="analytics-dashboard loading">
        <div className="loading-spinner">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <button className="back-button" onClick={() => navigate(-1)}>
         Back
      </button>
      <div className="dashboard-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <p>Tex Weave Impex - Data Analytics System</p>
        </div>
        <button 
          onClick={() => downloadComprehensiveReport()}
          className="btn btn-download"
        >
          📥 Download Report
        </button>
      </div>

      {/* KPI Cards Section */}
      <div className="kpi-grid">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(salesOverview?.sales?.totalRevenue || 0)}
          subtitle={`${formatNumber(salesOverview?.sales?.totalTransactions || 0)} transactions`}
          icon=""
          color="blue"
        />
        <KPICard
          title="Total Profit"
          value={formatCurrency(salesOverview?.profit || 0)}
          subtitle="From cost analysis"
          icon=""
          color="green"
        />
        <KPICard
          title="Inventory Value"
          value={formatCurrency(salesOverview?.inventoryValue || 0)}
          subtitle={`${inventoryOverview?.totalProducts || 0} products`}
          icon=""
          color="purple"
        />
        <KPICard
          title="Low Stock Items"
          value={salesOverview?.lowStockCount || 0}
          subtitle="Requires attention"
          icon=""
          color="orange"
        />
        <KPICard
          title="Out of Stock"
          value={inventoryOverview?.outOfStock || 0}
          subtitle="Immediate action needed"
          icon=""
          color="red"
        />
        <KPICard
          title="Slow Moving Stock"
          value={slowStockSummary?.totalSlowMovingProducts + slowStockSummary?.totalDeadStockProducts || 0}
          subtitle={`₹${formatNumber(slowStockSummary?.totalBlockedValue || 0)} blocked`}
          icon=""
          color="orange"
        />
      </div>

      {/* Quick Links Section */}
      <div className="quick-links">
        <Link to="/analytics/sales" className="quick-link">
          <div className="link-icon"></div>
          <div className="link-content">
            <h3>Sales Analytics</h3>
            <p>Detailed sales trends and analysis</p>
          </div>
        </Link>
        <Link to="/analytics/inventory" className="quick-link">
          <div className="link-icon"></div>
          <div className="link-content">
            <h3>Inventory Analytics</h3>
            <p>Stock levels and alerts</p>
          </div>
        </Link>
        <Link to="/analytics/products" className="quick-link">
          <div className="link-icon"></div>
          <div className="link-content">
            <h3>Product Performance</h3>
            <p>Profitability and forecasting</p>
          </div>
        </Link>
        <Link to="/data-upload" className="quick-link">
          <div className="link-icon"></div>
          <div className="link-content">
            <h3>Data Upload</h3>
            <p>Import sales and inventory data</p>
          </div>
        </Link>
      </div>

      {/* Top Products Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Top 5 Performing Products</h2>
          <Link to="/analytics/products" className="view-all-link">View All →</Link>
        </div>
        <DataTable columns={productColumns} data={topProducts} itemsPerPage={5} />
      </div>

      {/* Low Stock Alerts Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Low Stock Alerts</h2>
          <Link to="/analytics/inventory" className="view-all-link">View All →</Link>
        </div>
        {lowStockItems.length > 0 ? (
          <DataTable columns={lowStockColumns} data={lowStockItems} itemsPerPage={5} />
        ) : (
          <div className="no-alerts">
             No low stock items. All inventory levels are healthy.
          </div>
        )}
      </div>

      {/* System Info */}
      <div className="system-info">
        <p>Last updated: {new Date().toLocaleString()}</p>
        <p>System Status: <span className="status-badge online">Online</span></p>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;
