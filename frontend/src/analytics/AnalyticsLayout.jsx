import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, TrendingUp, Package, Users } from 'lucide-react';
import './Analytics.css';

const AnalyticsLayout = () => {
  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', overflow: 'hidden' }}>
      <nav className="analytics-nav" style={{ margin: '0 24px', paddingTop: '20px' }}>
        <ul>
          <li>
            <NavLink to="/analytics" end>
              <BarChart3 size={18} />
              Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics/sales">
              <TrendingUp size={18} />
              Sales
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics/products">
              <Package size={18} />
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics/inventory">
              <Package size={18} />
              Inventory
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics/customers">
              <Users size={18} />
              Customers
            </NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default AnalyticsLayout;
