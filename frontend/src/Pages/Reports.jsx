import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/axiosConfig';
import './Reports.css';

const Reports = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [slowStockDays, setSlowStockDays] = useState(90);

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const downloadSalesReport = () => {
    const params = new URLSearchParams();
    if (dateRange.startDate && dateRange.endDate) {
      params.append('startDate', dateRange.startDate);
      params.append('endDate', dateRange.endDate);
    }
    window.open(`${API_BASE_URL}/api/reports/sales?${params.toString()}`, '_blank');
  };

  const downloadInventoryReport = () => {
    const params = new URLSearchParams();
    if (selectedStatus && selectedStatus !== 'all') {
      params.append('status', selectedStatus);
    }
    window.open(`${API_BASE_URL}/api/reports/inventory?${params.toString()}`, '_blank');
  };

  const downloadSlowStockReport = () => {
    window.open(`${API_BASE_URL}/api/reports/slow-stock?days=${slowStockDays}`, '_blank');
  };

  const downloadProfitabilityReport = () => {
    const params = new URLSearchParams();
    if (dateRange.startDate && dateRange.endDate) {
      params.append('startDate', dateRange.startDate);
      params.append('endDate', dateRange.endDate);
    }
    window.open(`${API_BASE_URL}/api/reports/profitability?${params.toString()}`, '_blank');
  };

  const downloadComprehensiveReport = () => {
    const params = new URLSearchParams();
    if (dateRange.startDate && dateRange.endDate) {
      params.append('startDate', dateRange.startDate);
      params.append('endDate', dateRange.endDate);
    }
    window.open(`${API_BASE_URL}/api/reports/comprehensive?${params.toString()}`, '_blank');
  };

  return (
    <div className="reports-container">      <button className="back-button" onClick={() => navigate(-1)}>
         Back
      </button>      <div className="reports-header">
        <h1> Reports & Downloads</h1>
        <p>Generate and download various analytical reports</p>
      </div>

      <div className="date-filter-section">
        <h3>Date Range Filter (Optional)</h3>
        <div className="date-inputs">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="date-input"
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="date-input"
            />
          </div>
        </div>
      </div>

      <div className="reports-grid">
        {/* Sales Report */}
        <div className="report-card">
          <div className="report-icon"></div>
          <h3>Sales Report</h3>
          <p>Comprehensive sales data including revenue, products sold, and customer information.</p>
          <ul className="report-features">
            <li>✓ Sales by product</li>
            <li>✓ Revenue analysis</li>
            <li>✓ Customer details</li>
            <li>✓ Regional breakdown</li>
          </ul>
          <button onClick={downloadSalesReport} className="download-btn">
            Download Sales Report
          </button>
        </div>

        {/* Inventory Report */}
        <div className="report-card">
          <div className="report-icon"></div>
          <h3>Inventory Report</h3>
          <p>Current stock levels, reorder alerts, and warehouse locations.</p>
          <div className="filter-section">
            <label>Filter by Status:</label>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="status-select"
            >
              <option value="all">All Items</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
              <option value="adequate">Adequate Stock</option>
            </select>
          </div>
          <ul className="report-features">
            <li>✓ Stock quantities</li>
            <li>✓ Reorder levels</li>
            <li>✓ Warehouse locations</li>
            <li>✓ Last restock dates</li>
          </ul>
          <button onClick={downloadInventoryReport} className="download-btn">
            Download Inventory Report
          </button>
        </div>

        {/* Slow Stock Report */}
        <div className="report-card">
          <div className="report-icon"></div>
          <h3>Slow Moving Stock</h3>
          <p>Identify products with low sales velocity and aging inventory.</p>
          <div className="filter-section">
            <label>Days Threshold:</label>
            <input
              type="number"
              value={slowStockDays}
              onChange={(e) => setSlowStockDays(e.target.value)}
              min="30"
              max="365"
              className="days-input"
            />
          </div>
          <ul className="report-features">
            <li>✓ Slow-moving items</li>
            <li>✓ Days since last sale</li>
            <li>✓ Stock value analysis</li>
            <li>✓ Recommendations</li>
          </ul>
          <button onClick={downloadSlowStockReport} className="download-btn">
            Download Slow Stock Report
          </button>
        </div>

        {/* Profitability Report */}
        <div className="report-card">
          <div className="report-icon"></div>
          <h3>Profitability Analysis</h3>
          <p>Profit margins, cost analysis, and revenue breakdown by product.</p>
          <ul className="report-features">
            <li>✓ Profit margins</li>
            <li>✓ Cost vs revenue</li>
            <li>✓ Top performers</li>
            <li>✓ Category analysis</li>
          </ul>
          <button onClick={downloadProfitabilityReport} className="download-btn">
            Download Profitability Report
          </button>
        </div>

        {/* Comprehensive Report */}
        <div className="report-card featured">
          <div className="report-icon"></div>
          <h3>Comprehensive Report</h3>
          <p>All-in-one report combining sales, inventory, profitability, and forecasts.</p>
          <ul className="report-features">
            <li>✓ Complete sales data</li>
            <li>✓ Inventory status</li>
            <li>✓ Profitability metrics</li>
            <li>✓ Demand forecasts</li>
            <li>✓ Executive summary</li>
          </ul>
          <button onClick={downloadComprehensiveReport} className="download-btn featured-btn">
            Download Comprehensive Report
          </button>
        </div>
      </div>

      <div className="reports-info">
        <h3> Report Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Format:</strong> Excel (.xlsx)
          </div>
          <div className="info-item">
            <strong>Date Range:</strong> Optional - Leave empty for all-time data
          </div>
          <div className="info-item">
            <strong>Download:</strong> Reports open in a new tab
          </div>
          <div className="info-item">
            <strong>Data:</strong> Real-time data from database
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
