import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, TrendingUp, Package } from 'lucide-react';
import KPICard from '../components/KPICard';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import { getKPISummary, getSalesData, getCategoryData, getRegionalData } from '../services/dataService';
import '../components/KPICard.css';
import '../components/Charts.css';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [kpiData, setKpiData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [regionalData, setRegionalData] = useState([]);

  useEffect(() => {
    // Load all dashboard data
    setKpiData(getKPISummary());
    setSalesData(getSalesData(30));
    setCategoryData(getCategoryData().slice(0, 6));
    setRegionalData(getRegionalData());
  }, []);

  if (!kpiData) return <div>Loading...</div>;

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <p>Overview of your textile business performance</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard
          title="Total Revenue"
          value={kpiData.totalRevenue.value}
          change={kpiData.totalRevenue.change}
          currency="₹"
          icon={DollarSign}
        />
        <KPICard
          title="Total Orders"
          value={kpiData.totalOrders.value}
          change={kpiData.totalOrders.change}
          icon={ShoppingCart}
        />
        <KPICard
          title="Total Customers"
          value={kpiData.totalCustomers.value}
          change={kpiData.totalCustomers.change}
          icon={Users}
        />
        <KPICard
          title="Avg Order Value"
          value={kpiData.avgOrderValue.value}
          change={kpiData.avgOrderValue.change}
          currency="₹"
          icon={TrendingUp}
        />
        <KPICard
          title="Low Stock Items"
          value={kpiData.lowStockProducts.value}
          icon={Package}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="charts-row">
        <div className="chart-half">
          <LineChart
            data={salesData}
            xKey="date"
            yKeys={[{ dataKey: 'revenue', name: 'Revenue' }]}
            colors={['#667eea']}
            title="Revenue Over Time (Last 30 Days)"
            valuePrefix="₹"
            height={350}
          />
        </div>
        <div className="chart-half">
          <BarChart
            data={categoryData}
            xKey="category"
            yKeys={[{ dataKey: 'revenue', name: 'Revenue' }]}
            colors={['#764ba2']}
            title="Revenue by Category"
            valuePrefix="₹"
            height={350}
            layout="horizontal"
          />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-row">
        <div className="chart-half">
          <PieChart
            data={regionalData}
            dataKey="revenue"
            nameKey="region"
            title="Revenue Distribution by Region"
            valuePrefix="₹"
            height={400}
          />
        </div>
        <div className="chart-half">
          <LineChart
            data={salesData}
            xKey="date"
            yKeys={[
              { dataKey: 'orders', name: 'Orders' },
              { dataKey: 'customers', name: 'Customers' }
            ]}
            colors={['#43e97b', '#fa709a']}
            title="Orders & Customers Trend"
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
