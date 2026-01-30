import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import { getRegionalData, getTopCustomers, exportToCSV, formatCurrency } from '../services/dataService';
import '../components/Charts.css';
import './AnalyticsDashboard.css';

const CustomerAnalytics = () => {
  const [regionalData, setRegionalData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [domesticVsExport, setDomesticVsExport] = useState([]);

  useEffect(() => {
    const regional = getRegionalData();
    setRegionalData(regional);
    setCustomerData(getTopCustomers());
    
    // Calculate domestic vs export
    const domestic = regional.filter(r => r.region.includes('Domestic')).reduce((sum, r) => sum + r.revenue, 0);
    const exportRevenue = regional.filter(r => r.region.includes('Export')).reduce((sum, r) => sum + r.revenue, 0);
    
    setDomesticVsExport([
      { region: 'Domestic', revenue: domestic, percentage: Math.round(domestic / (domestic + exportRevenue) * 100) },
      { region: 'Export', revenue: exportRevenue, percentage: Math.round(exportRevenue / (domestic + exportRevenue) * 100) }
    ]);
  }, []);

  const handleExport = () => {
    exportToCSV(customerData, 'customer_data');
  };

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Customer & Region Analytics</h1>
          <p>Analyze customer behavior and regional performance</p>
        </div>
        <button onClick={handleExport} className="export-btn">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="charts-row">
        <div className="chart-half">
          <PieChart
            data={domesticVsExport}
            dataKey="revenue"
            nameKey="region"
            title="Domestic vs Export Revenue"
            valuePrefix="₹"
            height={400}
            colors={['#667eea', '#43e97b']}
          />
        </div>
        <div className="chart-half">
          <PieChart
            data={regionalData}
            dataKey="revenue"
            nameKey="region"
            title="Revenue by Region"
            valuePrefix="₹"
            height={400}
          />
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-full">
          <BarChart
            data={customerData}
            xKey="name"
            yKeys={[{ dataKey: 'revenue', name: 'Revenue' }]}
            colors={['#764ba2']}
            title="Top 10 Customers by Revenue"
            valuePrefix="₹"
            height={400}
            layout="vertical"
          />
        </div>
      </div>

      <div className="chart-full">
        <div className="chart-container">
          <h3 className="chart-title">Top Customers Table</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Location</th>
                  <th>Total Orders</th>
                  <th>Total Revenue</th>
                  <th>Avg Order Value</th>
                  <th>Last Order Date</th>
                </tr>
              </thead>
              <tbody>
                {customerData.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.location}</td>
                    <td>{customer.orders}</td>
                    <td>{formatCurrency(customer.revenue)}</td>
                    <td>{formatCurrency(Math.floor(customer.revenue / customer.orders))}</td>
                    <td>{customer.lastOrder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalytics;
