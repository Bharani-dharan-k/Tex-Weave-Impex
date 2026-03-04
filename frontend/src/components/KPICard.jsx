import React from 'react';
import './KPICard.css';

const KPICard = ({ title, value, subtitle, icon, trend, trendValue, color = 'blue' }) => {
  return (
    <div className={`kpi-card kpi-card-${color}`}>
      <div className="kpi-header">
        <div className="kpi-title">{title}</div>
        {icon && <div className="kpi-icon">{icon}</div>}
      </div>
      <div className="kpi-value">{value}</div>
      {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
      {trend && (
        <div className={`kpi-trend kpi-trend-${trend}`}>
          <span className="trend-icon">{trend === 'up' ? '↑' : '↓'}</span>
          <span className="trend-value">{trendValue}</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
