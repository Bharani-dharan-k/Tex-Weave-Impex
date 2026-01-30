import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatNumber } from '../services/dataService';

const PieChart = ({ data, dataKey, nameKey, title, colors, valuePrefix, height = 300 }) => {
  const COLORS = colors || ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0'];
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{data.name}</p>
          <p style={{ color: data.payload.fill }}>
            Value: {valuePrefix === '₹' ? formatCurrency(data.value) : formatNumber(data.value)}
          </p>
          {data.payload.percentage && <p>Percentage: {data.payload.percentage}%</p>}
        </div>
      );
    }
    return null;
  };

  const renderLabel = (entry) => {
    return `${entry[nameKey]}: ${entry.percentage}%`;
  };

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={renderLabel}
            labelLine={{ stroke: '#666', strokeWidth: 1 }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '13px' }} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
