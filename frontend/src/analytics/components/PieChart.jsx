import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatNumber } from '../services/dataService';

const PieChart = ({ data, dataKey, nameKey, title, colors, valuePrefix, height = 300, onSliceClick, onChartClick }) => {
  const COLORS = colors || ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0'];

  const total = (data || []).reduce((sum, d) => sum + (d[dataKey] || 0), 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{item.name}</p>
          <p style={{ color: item.payload.fill }}>
            Value: {valuePrefix === '₹' ? formatCurrency(item.value) : formatNumber(item.value)}
          </p>
          <p>Percentage: {pct}%</p>
        </div>
      );
    }
    return null;
  };

  const renderAlignedLabel = ({ cx, cy, midAngle, outerRadius, payload }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 18;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const pct = total > 0 ? Math.round((payload[dataKey] / total) * 100) : 0;

    return (
      <text
        x={x}
        y={y}
        fill="#55627a"
        textAnchor={x >= cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '12px', fontWeight: 500 }}
      >
        {`${payload[nameKey]}: ${pct}%`}
      </text>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        {title && <h3 className="chart-title">{title}</h3>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: height, color: '#a0aec0', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: '2rem' }}>📊</span>
          <span style={{ fontSize: '0.9rem' }}>No data available yet</span>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart
          onClick={(state) => {
            const hasActiveSlice = !!state?.activePayload?.[0]?.payload;
            if (!hasActiveSlice && onChartClick) {
              onChartClick();
            }
          }}
        >
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={92}
            label={renderAlignedLabel}
            labelLine={{ stroke: '#666', strokeWidth: 1 }}
            onClick={(entry) => {
              const payload = entry?.payload || entry;
              if (payload && onSliceClick) {
                onSliceClick(payload);
              }
            }}
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
