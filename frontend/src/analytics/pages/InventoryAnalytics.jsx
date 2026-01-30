import { useState, useEffect } from 'react';
import { AlertTriangle, Download } from 'lucide-react';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import { getInventoryData, exportToCSV } from '../services/dataService';
import '../components/Charts.css';
import './AnalyticsDashboard.css';

const InventoryAnalytics = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [stockTrend, setStockTrend] = useState([]);

  useEffect(() => {
    const data = getInventoryData();
    setInventoryData(data);
    setLowStockItems(data.filter(item => item.stockStatus === 'low'));
    
    // Generate stock trend (simulated)
    const trend = data.slice(0, 8).map(item => ({
      name: item.name.split(' ')[0],
      current: item.currentStock,
      reorder: item.reorderLevel,
      max: item.maxCapacity
    }));
    setStockTrend(trend);
  }, []);

  const handleExport = () => {
    exportToCSV(inventoryData, 'inventory_data');
  };

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Inventory & Stock Analytics</h1>
          <p>Monitor stock levels and inventory health</p>
        </div>
        <button onClick={handleExport} className="export-btn">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {lowStockItems.length > 0 && (
        <div className="alert-banner">
          <AlertTriangle size={24} />
          <span><strong>{lowStockItems.length} products</strong> are running low on stock!</span>
        </div>
      )}

      <div className="charts-row">
        <div className="chart-half">
          <BarChart
            data={inventoryData.slice(0, 10)}
            xKey="name"
            yKeys={[{ dataKey: 'currentStock', name: 'Current Stock' }]}
            colors={['#43e97b']}
            title="Current Stock Levels (Top 10 Products)"
            height={400}
            layout="vertical"
          />
        </div>
        <div className="chart-half">
          <BarChart
            data={stockTrend}
            xKey="name"
            yKeys={[
              { dataKey: 'current', name: 'Current' },
              { dataKey: 'reorder', name: 'Reorder Level' },
              { dataKey: 'max', name: 'Max Capacity' }
            ]}
            colors={['#667eea', '#fa709a', '#43e97b']}
            title="Stock Levels vs Capacity"
            height={400}
            layout="horizontal"
          />
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-full">
          <LineChart
            data={inventoryData.slice(0, 10)}
            xKey="name"
            yKeys={[{ dataKey: 'daysUntilStockout', name: 'Days Until Stockout' }]}
            colors={['#f093fb']}
            title="Inventory Depletion Timeline"
            height={350}
          />
        </div>
      </div>

      <div className="chart-full">
        <div className="chart-container">
          <h3 className="chart-title">Low Stock Alert Table</h3>
          {lowStockItems.length === 0 ? (
            <p style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              No low stock items. All products are well stocked! 🎉
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Reorder Level</th>
                    <th>Status</th>
                    <th>Monthly Depletion</th>
                    <th>Days Until Stockout</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.currentStock.toLocaleString()}</td>
                      <td>{item.reorderLevel.toLocaleString()}</td>
                      <td>
                        <span className={`stock-status ${item.stockStatus}`}>
                          {item.stockStatus}
                        </span>
                      </td>
                      <td>{item.monthlyDepletion.toLocaleString()}/month</td>
                      <td>
                        <span className={item.daysUntilStockout < 30 ? 'trend-indicator negative' : ''}>
                          {item.daysUntilStockout} days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryAnalytics;
