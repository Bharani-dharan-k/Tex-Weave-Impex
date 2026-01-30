import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatNumber } from '../services/dataService';

const BarChart = ({ data, xKey, yKeys, colors, title, valuePrefix, height = 300, layout = 'vertical' }) => {
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

  if (layout === 'horizontal') {
    return (
      <div className="chart-container">
        {title && <h3 className="chart-title">{title}</h3>}
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart data={data} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xKey} stroke="#666" style={{ fontSize: '12px' }} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#666" style={{ fontSize: '12px' }} 
              tickFormatter={(value) => valuePrefix === '₹' ? `₹${(value / 1000).toFixed(0)}k` : value} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '13px' }} />
            {yKeys.map((key, index) => (
              <Bar key={key.dataKey} dataKey={key.dataKey} name={key.name} fill={colors[index] || '#667eea'} radius={[4, 4, 0, 0]} />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" stroke="#666" style={{ fontSize: '12px' }} 
            tickFormatter={(value) => valuePrefix === '₹' ? `₹${(value / 1000).toFixed(0)}k` : value} />
          <YAxis type="category" dataKey={xKey} stroke="#666" style={{ fontSize: '12px' }} width={110} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '13px' }} />
          {yKeys.map((key, index) => (
            <Bar key={key.dataKey} dataKey={key.dataKey} name={key.name} fill={colors[index] || '#667eea'} radius={[0, 4, 4, 0]} />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
