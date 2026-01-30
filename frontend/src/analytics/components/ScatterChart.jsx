import { ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ZAxis } from 'recharts';
import { formatCurrency, formatNumber } from '../services/dataService';

const ScatterChart = ({ data, xKey, yKey, zKey, title, xLabel, yLabel, height = 300 }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{data.name}</p>
          <p>{xLabel}: {xKey.includes('price') || xKey.includes('revenue') ? formatCurrency(data[xKey]) : formatNumber(data[xKey])}</p>
          <p>{yLabel}: {formatNumber(data[yKey])}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey={xKey} 
            name={xLabel} 
            stroke="#666" 
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => xKey.includes('price') || xKey.includes('revenue') ? `₹${(value / 1000).toFixed(0)}k` : value}
          />
          <YAxis 
            dataKey={yKey} 
            name={yLabel} 
            stroke="#666" 
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => formatNumber(value)}
          />
          {zKey && <ZAxis dataKey={zKey} range={[100, 1000]} />}
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Legend wrapperStyle={{ fontSize: '13px' }} />
          <Scatter name="Products" data={data} fill="#667eea" />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterChart;
