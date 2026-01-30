import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatNumber } from '../services/dataService';

const AreaChart = ({ data, xKey, yKeys, colors, title, valuePrefix, height = 300 }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {valuePrefix === '₹' ? formatCurrency(entry.value) : formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {yKeys.map((key, index) => (
              <linearGradient key={key.dataKey} id={`color${key.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[index] || '#667eea'} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[index] || '#667eea'} stopOpacity={0.1}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={xKey} stroke="#666" style={{ fontSize: '12px' }} />
          <YAxis stroke="#666" style={{ fontSize: '12px' }} 
            tickFormatter={(value) => valuePrefix === '₹' ? `₹${(value / 1000).toFixed(0)}k` : value} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '13px' }} />
          {yKeys.map((key, index) => (
            <Area 
              key={key.dataKey} 
              type="monotone" 
              dataKey={key.dataKey} 
              name={key.name}
              stroke={colors[index] || '#667eea'} 
              fillOpacity={1}
              fill={`url(#color${key.dataKey})`}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChart;
