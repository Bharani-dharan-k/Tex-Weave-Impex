import { useState, useEffect } from 'react'
import { DollarSign, ShoppingCart, Users, TrendingUp, Package, BarChart3, Factory, Settings, CheckCircle, Truck } from 'lucide-react'
import './Dashboard.css'
import '../analytics/components/KPICard.css'
import '../analytics/components/Charts.css'
import '../analytics/pages/AnalyticsDashboard.css'
import KPICard from '../analytics/components/KPICard'
import LineChart from '../analytics/components/LineChart'
import BarChart from '../analytics/components/BarChart'
import PieChart from '../analytics/components/PieChart'
import ScatterChart from '../analytics/components/ScatterChart'
import FunnelChart from '../analytics/components/FunnelChart'
import { 
  getKPISummary, 
  getSalesData, 
  getCategoryData, 
  getRegionalData,
  getProductData,
  getInventoryData,
  getTopCustomers,
  formatCurrency,
  getProductCategoryData,
  getProcessFlowData,
  getDefectAnalysis,
  getThroughputData,
  getQualityMetrics,
  getQualityTrend,
  getPackingDispatchStatus,
  getDispatchTimeline,
  getProcessTimeBreakdown
} from '../analytics/services/dataService'

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [kpiData, setKpiData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [_categoryData, _setCategoryData] = useState([]);
  const [regionalData, setRegionalData] = useState([]);
  const [_productData, _setProductData] = useState([]);
  const [_inventoryData, _setInventoryData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [_lowStockItems, _setLowStockItems] = useState([]);
  
  // Manufacturing data
  const [productCategoryData, setProductCategoryData] = useState([]);
  const [processFlowData, setProcessFlowData] = useState([]);
  const [defectData, setDefectData] = useState([]);
  const [throughputData, setThroughputData] = useState([]);
  const [qualityMetrics, setQualityMetrics] = useState(null);
  const [qualityTrend, setQualityTrend] = useState([]);
  const [packingStatus, setPackingStatus] = useState([]);
  const [dispatchTimeline, setDispatchTimeline] = useState([]);
  const [processTime, setProcessTime] = useState([]);

  useEffect(() => {
    // Load all dashboard data
    const loadData = () => {
      setKpiData(getKPISummary());
      setSalesData(getSalesData(30));
      _setCategoryData(getCategoryData().slice(0, 6));
      setRegionalData(getRegionalData());
      
      const products = getProductData();
      _setProductData(products.sort((a, b) => b.revenue - a.revenue).slice(0, 8));
      
      const inventory = getInventoryData();
      _setInventoryData(inventory);
      _setLowStockItems(inventory.filter(item => item.stockStatus === 'low'));
      
      setTopCustomers(getTopCustomers().slice(0, 8));
      
      // Load manufacturing data
      setProductCategoryData(getProductCategoryData());
      setProcessFlowData(getProcessFlowData());
      setDefectData(getDefectAnalysis());
      setThroughputData(getThroughputData());
      setQualityMetrics(getQualityMetrics());
      setQualityTrend(getQualityTrend());
      setPackingStatus(getPackingDispatchStatus());
      setDispatchTimeline(getDispatchTimeline());
      setProcessTime(getProcessTimeBreakdown());
    };
    
    loadData();
  }, []);

  if (!kpiData || !qualityMetrics) return <div>Loading...</div>;

  const tabs = [
    { id: 'overview', label: 'Business Overview', icon: BarChart3 },
    { id: 'product', label: 'Product Analytics', icon: Package },
    { id: 'process', label: 'Process Flow', icon: Factory },
    { id: 'manufacturing', label: 'Time & Throughput', icon: Settings },
    { id: 'quality', label: 'Quality Control', icon: CheckCircle },
    { id: 'dispatch', label: 'Packing & Dispatch', icon: Truck }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverview();
      case 'product':
        return renderProductAnalytics();
      case 'process':
        return renderProcessFlow();
      case 'manufacturing':
        return renderManufacturingAnalytics();
      case 'quality':
        return renderQualityAnalytics();
      case 'dispatch':
        return renderDispatchAnalytics();
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <>
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

      {/* Sales & Revenue Charts */}
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
          <LineChart
            data={salesData}
            xKey="date"
            yKeys={[
              { dataKey: 'orders', name: 'Orders' },
              { dataKey: 'customers', name: 'Customers' }
            ]}
            colors={['#43e97b', '#fa709a']}
            title="Orders & Customers Trend"
            height={350}
          />
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-half">
          <PieChart
            data={regionalData}
            dataKey="revenue"
            nameKey="region"
            title="Revenue Distribution by Region"
            valuePrefix="₹"
            height={350}
          />
        </div>
        <div className="chart-half">
          <BarChart
            data={topCustomers}
            xKey="name"
            yKeys={[{ dataKey: 'revenue', name: 'Revenue' }]}
            colors={['#f093fb']}
            title="Top 8 Customers by Revenue"
            valuePrefix="₹"
            height={350}
            layout="vertical"
          />
        </div>
      </div>
    </>
  );

  const renderProductAnalytics = () => {
    if (!productCategoryData.length) return <div>Loading product data...</div>;
    
    return (
    <>
      <div className="kpi-grid">
        <KPICard
          title="Total Product Categories"
          value={productCategoryData.length}
          icon={Package}
        />
        <KPICard
          title="Total SKUs"
          value={productCategoryData.reduce((acc, cat) => acc + (cat?.skuCount || 0), 0)}
          icon={BarChart3}
        />
        <KPICard
          title="Avg Units per Category"
          value={Math.round(productCategoryData.reduce((acc, cat) => acc + (cat?.units || 0), 0) / productCategoryData.length) || 0}
          icon={ShoppingCart}
        />
        <KPICard
          title="Total Production"
          value={productCategoryData.reduce((acc, cat) => acc + (cat?.units || 0), 0)}
          icon={Factory}
        />
      </div>

      <div className="charts-row">
        <div className="chart-half">
          <BarChart
            data={productCategoryData}
            xKey="category"
            yKeys={[{ dataKey: 'units', name: 'Units Produced' }]}
            colors={['#667eea']}
            title="Production by Product Category"
            height={350}
          />
        </div>
        <div className="chart-half">
          <PieChart
            data={productCategoryData}
            dataKey="revenue"
            nameKey="category"
            title="Revenue Contribution by Product"
            valuePrefix="₹"
            height={350}
          />
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-full">
          <div className="analytics-card">
            <h3 className="card-title">Product Category Details</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Units Produced</th>
                  <th>Revenue</th>
                  <th>SKU Count</th>
                  <th>Market Segment</th>
                </tr>
              </thead>
              <tbody>
                {productCategoryData.map((cat, index) => (
                  <tr key={cat?.category || index}>
                    <td>{cat?.category || 'N/A'}</td>
                    <td>{cat?.units?.toLocaleString() || '0'}</td>
                    <td>{formatCurrency(cat?.revenue || 0)}</td>
                    <td>{cat?.skuCount || 0}</td>
                    <td>{cat?.segment || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
    );
  };

  const renderProcessFlow = () => {
    if (!processFlowData.length) return <div>Loading process data...</div>;
    
    return (
    <>
      <div className="kpi-grid">
        <KPICard
          title="Process Stages"
          value={processFlowData.length}
          icon={Factory}
        />
        <KPICard
          title="Total Loss %"
          value={processFlowData[0]?.input && processFlowData[processFlowData.length - 1]?.output ? ((1 - processFlowData[processFlowData.length - 1].output / processFlowData[0].input) * 100).toFixed(1) + '%' : '0.0%'}
          icon={TrendingUp}
        />
        <KPICard
          title="Avg Utilization"
          value={Math.round(processFlowData.reduce((acc, stage) => acc + (stage?.utilization || 0), 0) / processFlowData.length) + '%'}
          icon={Settings}
        />
        <KPICard
          title="Total Defects"
          value={processFlowData.reduce((acc, stage) => acc + stage.defects, 0)}
          icon={Package}
        />
      </div>

      <div className="charts-row">
        <div className="chart-full">
          <FunnelChart
            data={processFlowData}
            title="Manufacturing Process Pipeline"
            height={400}
          />
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-half">
          <BarChart
            data={defectData}
            xKey="stage"
            yKeys={[
              { dataKey: 'colorMismatch', name: 'Color Mismatch' },
              { dataKey: 'stitchError', name: 'Stitch Error' },
              { dataKey: 'printBlur', name: 'Print Blur' },
              { dataKey: 'fabricTear', name: 'Fabric Tear' },
              { dataKey: 'other', name: 'Other' }
            ]}
            colors={['#f093fb', '#f5576c', '#ffa726', '#43e97b', '#667eea']}
            title="Defect Analysis by Stage"
            height={350}
            stacked={true}
          />
        </div>
        <div className="chart-half">
          <div className="analytics-card">
            <h3 className="card-title">Process Stage Details</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Input</th>
                  <th>Output</th>
                  <th>Loss %</th>
                  <th>Defects</th>
                  <th>Utilization</th>
                </tr>
              </thead>
              <tbody>
                {processFlowData.map((stage, index) => (
                  <tr key={stage?.stage || index}>
                    <td>{stage?.stage || 'N/A'}</td>
                    <td>{stage?.input?.toLocaleString() || '0'}</td>
                    <td>{stage?.output?.toLocaleString() || '0'}</td>
                    <td className={(stage?.loss || 0) > 2 ? 'text-danger' : ''}>
                      {stage?.loss?.toFixed(1) || '0.0'}%
                    </td>
                    <td>{stage?.defects || 0}</td>
                    <td>{stage?.utilization || 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
    );
  };

  const renderManufacturingAnalytics = () => {
    if (!processFlowData.length || !throughputData.length || !processTime.length || !dispatchTimeline.length) {
      return <div>Loading manufacturing data...</div>;
    }
    
    return (
    <>
      <div className="kpi-grid">
        <KPICard
          title="Avg Process Time"
          value={Math.round(processFlowData.reduce((acc, stage) => acc + (stage?.time || 0), 0) / processFlowData.length) + ' hrs'}
          icon={Settings}
        />
        <KPICard
          title="Orders Received"
          value={throughputData.reduce((acc, day) => acc + (day?.received || 0), 0)}
          icon={ShoppingCart}
        />
        <KPICard
          title="Orders Completed"
          value={throughputData.reduce((acc, day) => acc + (day?.completed || 0), 0)}
          change={5.2}
          icon={CheckCircle}
        />
        <KPICard
          title="On-Time Delivery"
          value={dispatchTimeline.length ? ((dispatchTimeline.filter(d => d?.onTime).length / dispatchTimeline.length) * 100).toFixed(0) + '%' : '0%'}
          change={3.4}
          icon={Truck}
        />
      </div>

      <div className="charts-row">
        <div className="chart-half">
          <LineChart
            data={throughputData}
            xKey="date"
            yKeys={[
              { dataKey: 'received', name: 'Received' },
              { dataKey: 'completed', name: 'Completed' }
            ]}
            colors={['#667eea', '#43e97b']}
            title="Daily Order Throughput (Last 30 Days)"
            height={350}
          />
        </div>
        <div className="chart-half">
          <BarChart
            data={processTime}
            xKey="stage"
            yKeys={[{ dataKey: 'hours', name: 'Hours' }]}
            colors={['#f093fb']}
            title="Process Time Breakdown"
            height={350}
            layout="horizontal"
          />
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-full">
          <div className="analytics-card">
            <h3 className="card-title">Process Time Details</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Average Time (hrs)</th>
                  <th>% of Total Time</th>
                  <th>Bottleneck</th>
                </tr>
              </thead>
              <tbody>
                {processTime.map((stage, index) => (
                  <tr key={stage?.stage || index}>
                    <td>{stage?.stage || 'N/A'}</td>
                    <td>{stage?.hours || 0}</td>
                    <td>{stage?.percentage || 0}%</td>
                    <td>{stage?.bottleneck ? 'Yes' : ' No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
    );
  };

  const renderQualityAnalytics = () => {
    if (!qualityMetrics || !qualityTrend.length) return <div>Loading quality data...</div>;
    
    return (
    <>
      <div className="kpi-grid">
        <KPICard
          title="Pass Rate"
          value={(qualityMetrics?.passRate?.toFixed(1) || '0.0') + '%'}
          change={2.3}
          icon={CheckCircle}
        />
        <KPICard
          title="Fail Rate"
          value={(qualityMetrics?.failRate?.toFixed(1) || '0.0') + '%'}
          change={-1.2}
          icon={Package}
        />
        <KPICard
          title="Rework Rate"
          value={(qualityMetrics?.reworkRate?.toFixed(1) || '0.0') + '%'}
          icon={Settings}
        />
        <KPICard
          title="Scrap Rate"
          value={(qualityMetrics?.scrapRate?.toFixed(1) || '0.0') + '%'}
          change={-0.8}
          icon={TrendingUp}
        />
      </div>

      <div className="charts-row">
        <div className="chart-half">
          <PieChart
            data={[
              { name: 'Passed', value: qualityMetrics.passed },
              { name: 'Failed', value: qualityMetrics.failed },
              { name: 'Rework', value: qualityMetrics.rework },
              { name: 'Scrap', value: qualityMetrics.scrap }
            ]}
            dataKey="value"
            nameKey="name"
            title="Quality Status Distribution"
            height={350}
          />
        </div>
        <div className="chart-half">
          <LineChart
            data={qualityTrend}
            xKey="date"
            yKeys={[
              { dataKey: 'passRate', name: 'Pass Rate' },
              { dataKey: 'failRate', name: 'Fail Rate' },
              { dataKey: 'reworkRate', name: 'Rework Rate' }
            ]}
            colors={['#43e97b', '#f5576c', '#ffa726']}
            title="Quality Metrics Trend (Last 30 Days)"
            valueSuffix="%"
            height={350}
          />
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-full">
          <div className="analytics-card">
            <h3 className="card-title">Quality Summary</h3>
            <div className="quality-summary">
              <div className="quality-stat">
                <div className="stat-label">Total Inspected</div>
                <div className="stat-value">{qualityMetrics?.totalInspected?.toLocaleString() || '0'}</div>
              </div>
              <div className="quality-stat">
                <div className="stat-label">Passed</div>
                <div className="stat-value text-success">{qualityMetrics?.passed?.toLocaleString() || '0'}</div>
              </div>
              <div className="quality-stat">
                <div className="stat-label">Failed</div>
                <div className="stat-value text-danger">{qualityMetrics?.failed?.toLocaleString() || '0'}</div>
              </div>
              <div className="quality-stat">
                <div className="stat-label">Rework</div>
                <div className="stat-value text-warning">{qualityMetrics?.rework?.toLocaleString() || '0'}</div>
              </div>
              <div className="quality-stat">
                <div className="stat-label">Scrap</div>
                <div className="stat-value text-danger">{qualityMetrics?.scrap?.toLocaleString() || '0'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    );
  };

  const renderDispatchAnalytics = () => {
    if (!packingStatus.length || !dispatchTimeline.length) return <div>Loading dispatch data...</div>;
    
    return (
    <>
      <div className="kpi-grid">
        {packingStatus.map((status, index) => (
          <KPICard
            key={status?.status || index}
            title={status?.status || 'N/A'}
            value={status?.count || 0}
            icon={status?.status?.includes('Ready') ? Truck : Package}
          />
        ))}
      </div>

      <div className="charts-row">
        <div className="chart-half">
          <BarChart
            data={packingStatus}
            xKey="status"
            yKeys={[{ dataKey: 'count', name: 'Orders' }]}
            colors={['#667eea']}
            title="Packing & Dispatch Status"
            height={350}
          />
        </div>
        <div className="chart-half">
          <BarChart
            data={[
              { status: 'Scheduled', count: dispatchTimeline.length },
              { status: 'On-Time', count: dispatchTimeline.filter(d => d.onTime).length },
              { status: 'Delayed', count: dispatchTimeline.filter(d => d.delayed).length }
            ]}
            xKey="status"
            yKeys={[{ dataKey: 'count', name: 'Dispatches' }]}
            colors={['#43e97b']}
            title="Dispatch Performance"
            height={350}
          />
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-full">
          <div className="analytics-card">
            <h3 className="card-title">Recent Dispatch Schedule</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Scheduled</th>
                  <th>On-Time</th>
                  <th>Delayed</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {dispatchTimeline.slice(0, 10).map((day, index) => (
                  <tr key={day?.date || index}>
                    <td>{day?.date || 'N/A'}</td>
                    <td>{day?.scheduled || 0}</td>
                    <td className="text-success">{day?.onTime || 0}</td>
                    <td className="text-danger">{day?.delayed || 0}</td>
                    <td>{day?.scheduled ? ((day.onTime / day.scheduled) * 100).toFixed(0) : '0'}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Tex Weave Impex - Manufacturing Analytics</h1>
          <p className="welcome-text">Welcome, {user?.name || 'Admin'}!</p>
        </div>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>

      {/* Tab Navigation */}
      <div className="analytics-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default Dashboard

