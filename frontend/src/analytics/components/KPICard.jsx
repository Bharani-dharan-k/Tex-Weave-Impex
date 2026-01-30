import { TrendingUp, TrendingDown } from 'lucide-react';
import './KPICard.css';

const KPICard = ({ title, value, change, currency, icon: Icon, formatValue }) => {
  const isPositive = parseFloat(change) > 0;
  const displayValue = formatValue ? formatValue(value) : currency ? `${currency}${value.toLocaleString('en-IN')}` : value.toLocaleString('en-IN');
  
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        {Icon && <Icon className="kpi-icon" size={20} />}
      </div>
      
      <div className="kpi-value">{displayValue}</div>
      
      {change !== undefined && change !== null && (
        <div className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{Math.abs(change)}% vs last period</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
