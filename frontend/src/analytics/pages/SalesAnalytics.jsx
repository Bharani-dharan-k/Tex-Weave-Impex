import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import AreaChart from '../components/AreaChart';
import { getSalesData, exportToCSV, formatCurrency } from '../services/dataService';
import '../components/Charts.css';
import './AnalyticsDashboard.css';

const SalesAnalytics = () => {
  const [salesData, setSalesData] = useState([]);
  const [timeRange, setTimeRange] = useState('30');
  const [cumulativeData, setCumulativeData] = useState([]);

  useEffect(() => {
    const data = getSalesData(parseInt(timeRange));
    setSalesData(data);
    
    // Calculate cumulative sales
    let cumulative = 0;
    const cumulativeArray = data.map(item => {
      cumulative += item.revenue;
      return { ...item, cumulativeRevenue: cumulative };
    });
    setCumulativeData(cumulativeArray);
  }, [timeRange]);

  const handleExport = () => {
    exportToCSV(salesData, 'sales_data');
  };

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Sales Analytics</h1>
          <p>Detailed sales performance and trends</p>
        </div>
        <div className="header-controls">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="time-range-select">
            <option value="30">Last 30 Days</option>
            <option value="60">Last 60 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
          <button onClick={handleExport} className="export-btn">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-full">
          <LineChart
            data={salesData}
            xKey="date"
            yKeys={[{ dataKey: 'revenue', name: 'Revenue' }]}
            colors={['#667eea']}
            title="Daily Sales Revenue"
            valuePrefix="₹"
            height={400}
          />
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-half">
          <BarChart
            data={salesData.slice(-30)}
            xKey="date"
            yKeys={[
              { dataKey: 'orders', name: 'Orders' },
              { dataKey: 'revenue', name: 'Revenue (÷1000)' }
            ]}
            colors={['#43e97b', '#f093fb']}
            title="Orders vs Revenue (Last 30 Days)"
            height={350}
            layout="horizontal"
          />
        </div>
        <div className="chart-half">
          <AreaChart
            data={cumulativeData}
            xKey="date"
            yKeys={[{ dataKey: 'cumulativeRevenue', name: 'Cumulative Revenue' }]}
            colors={['#764ba2']}
            title="Cumulative Sales Growth"
            valuePrefix="₹"
            height={350}
          />
        </div>
      </div>

      <div className="chart-full">
        <div className="chart-container">
          <h3 className="chart-title">Sales Summary Table</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Orders</th>
                  <th>Customers</th>
                  <th>Revenue</th>
                  <th>Avg Order Value</th>
                  <th>Growth %</th>
                </tr>
              </thead>
              <tbody>
                {salesData.slice(-15).reverse().map((item, index, arr) => {
                  const previousDayRevenue = index < arr.length - 1 ? arr[index + 1].revenue : item.revenue;
                  const growth = ((item.revenue - previousDayRevenue) / previousDayRevenue * 100).toFixed(2);
                  
                  return (
                    <tr key={item.date}>
                      <td>{item.date}</td>
                      <td>{item.orders}</td>
                      <td>{item.customers}</td>
                      <td>{formatCurrency(item.revenue)}</td>
                      <td>{formatCurrency(item.avgOrderValue)}</td>
                      <td>
                        <span className={`trend-indicator ${parseFloat(growth) >= 0 ? 'positive' : 'negative'}`}>
                          {growth}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
