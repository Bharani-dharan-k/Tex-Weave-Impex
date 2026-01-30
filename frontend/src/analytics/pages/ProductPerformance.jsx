import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import BarChart from '../components/BarChart';
import ScatterChart from '../components/ScatterChart';
import { getProductData, getCategoryData, exportToCSV, formatCurrency } from '../services/dataService';
import '../components/Charts.css';
import './AnalyticsDashboard.css';

const ProductPerformance = () => {
  const [productData, setProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const products = getProductData();
    setProductData(products);
    setCategoryData(getCategoryData());
    setTopProducts(products.sort((a, b) => b.revenue - a.revenue).slice(0, 10));
  }, []);

  const handleExport = () => {
    exportToCSV(productData, 'product_performance');
  };

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Product Performance Analytics</h1>
          <p>Analyze product sales, revenue, and profitability</p>
        </div>
        <button onClick={handleExport} className="export-btn">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="charts-row">
        <div className="chart-half">
          <BarChart
            data={topProducts}
            xKey="name"
            yKeys={[{ dataKey: 'revenue', name: 'Revenue' }]}
            colors={['#667eea']}
            title="Top 10 Products by Revenue"
            valuePrefix="₹"
            height={400}
            layout="vertical"
          />
        </div>
        <div className="chart-half">
          <BarChart
            data={categoryData}
            xKey="category"
            yKeys={[{ dataKey: 'revenue', name: 'Revenue' }]}
            colors={['#764ba2']}
            title="Revenue by Product Category"
            valuePrefix="₹"
            height={400}
            layout="vertical"
          />
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-full">
          <ScatterChart
            data={productData}
            xKey="price"
            yKey="unitsSold"
            title="Price vs Quantity Sold Analysis"
            xLabel="Price (₹)"
            yLabel="Units Sold"
            height={400}
          />
        </div>
      </div>

      <div className="chart-full">
        <div className="chart-container">
          <h3 className="chart-title">Product Performance Table</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Units Sold</th>
                  <th>Price</th>
                  <th>Revenue</th>
                  <th>Profit</th>
                  <th>Profit Margin %</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.unitsSold.toLocaleString()}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{formatCurrency(product.revenue)}</td>
                    <td>{formatCurrency(product.profit)}</td>
                    <td>
                      <span className={`trend-indicator ${parseFloat(product.profitMargin) >= 30 ? 'positive' : 'negative'}`}>
                        {product.profitMargin}%
                      </span>
                    </td>
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

export default ProductPerformance;
