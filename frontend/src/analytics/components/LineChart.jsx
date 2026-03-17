import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatNumber } from '../services/dataService';

const LineChart = ({ data, xKey, yKeys, colors, title, valuePrefix, height = 300, onPointClick, onChartClick }) => {
  const emitPointClick = (payload) => {
    if (payload && onPointClick) {
      onPointClick(payload)
    }
  }

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

  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        {title && <h3 className="chart-title">{title}</h3>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: height, color: '#a0aec0', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: '2rem' }}>📈</span>
          <span style={{ fontSize: '0.9rem' }}>No data available yet</span>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          onClick={(state) => {
            const point = state?.activePayload?.[0]?.payload;
            if (point) {
              emitPointClick(point)
              return
            }
            if (onChartClick) {
              onChartClick()
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={xKey} stroke="#666" style={{ fontSize: '12px' }} />
          <YAxis stroke="#666" style={{ fontSize: '12px' }} 
            tickFormatter={(value) => valuePrefix === '₹' ? `₹${(value / 1000).toFixed(0)}k` : value} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '13px' }} />
          {yKeys.map((key, index) => (
            <Line 
              key={key.dataKey} 
              type="monotone" 
              dataKey={key.dataKey} 
              name={key.name}
              stroke={colors[index] || '#667eea'} 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              onClick={(pointState) => {
                const payload = pointState?.payload || pointState?.activePayload?.[0]?.payload
                emitPointClick(payload)
              }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
