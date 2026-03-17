import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatNumber } from '../services/dataService';

const BarChart = ({ data, xKey, yKeys, colors, title, valuePrefix, height = 300, layout = 'vertical', onBarClick, onChartClick }) => {
  const emitBarClick = (entry) => {
    const payload = entry?.payload || entry;
    if (payload && onBarClick) {
      onBarClick(payload);
    }
  };

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

  const getCompactAxisMax = () => {
    if (!Array.isArray(data) || data.length === 0 || !Array.isArray(yKeys) || yKeys.length === 0) {
      return 10;
    }

    const rawMax = data.reduce((maxValue, row) => {
      const rowMax = yKeys.reduce((acc, key) => {
        const v = Number(row?.[key.dataKey] || 0);
        return Number.isFinite(v) ? Math.max(acc, v) : acc;
      }, 0);
      return Math.max(maxValue, rowMax);
    }, 0);

    if (rawMax <= 0) return 10;

    const padded = rawMax * 1.05;
    const roundBase = rawMax >= 100 ? 10 : rawMax >= 20 ? 5 : 1;
    return Math.ceil(padded / roundBase) * roundBase;
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

  if (layout === 'horizontal') {
    return (
      <div className="chart-container">
        {title && <h3 className="chart-title">{title}</h3>}
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart
            data={data}
            layout="horizontal"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onClick={(state) => {
              const hasActiveBar = !!state?.activePayload?.[0]?.payload;
              if (!hasActiveBar && onChartClick) {
                onChartClick();
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey={xKey}
                stroke="#666"
                style={{ fontSize: '12px' }}
                angle={0}
                textAnchor="middle"
                height={56}
                interval={0}
                tickMargin={10}
              />
            <YAxis stroke="#666" style={{ fontSize: '12px' }} 
              tickFormatter={(value) => valuePrefix === '₹' ? `₹${(value / 1000).toFixed(0)}k` : value} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '13px' }} />
            {yKeys.map((key, index) => (
              <Bar
                key={key.dataKey}
                dataKey={key.dataKey}
                name={key.name}
                fill={colors[index] || '#667eea'}
                radius={[4, 4, 0, 0]}
                onClick={emitBarClick}
              />
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
        <RechartsBarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          onClick={(state) => {
            const hasActiveBar = !!state?.activePayload?.[0]?.payload;
            if (!hasActiveBar && onChartClick) {
              onChartClick();
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            domain={[0, getCompactAxisMax()]}
            tickCount={6}
            stroke="#666"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => valuePrefix === '₹' ? `₹${(value / 1000).toFixed(0)}k` : value} />
          <YAxis type="category" dataKey={xKey} stroke="#666" style={{ fontSize: '12px' }} width={80} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '13px' }} />
          {yKeys.map((key, index) => (
            <Bar
              key={key.dataKey}
              dataKey={key.dataKey}
              name={key.name}
              fill={colors[index] || '#667eea'}
              radius={[0, 4, 4, 0]}
              onClick={emitBarClick}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
