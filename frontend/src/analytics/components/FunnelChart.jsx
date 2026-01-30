import './Charts.css';

const FunnelChart = ({ data, title, height = 400 }) => {
  const maxValue = Math.max(...data.map(d => d.outputUnits));
  
  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="funnel-container" style={{ height: `${height}px` }}>
        {data.map((stage, index) => {
          const widthPercent = (stage.outputUnits / maxValue) * 100;
          const lossPercent = stage.lossPercent;
          const isBottleneck = stage.bottleneck;
          
          return (
            <div key={stage.stage} className="funnel-stage">
              <div className="funnel-bar-wrapper">
                <div 
                  className={`funnel-bar ${isBottleneck ? 'bottleneck' : ''}`}
                  style={{ 
                    width: `${widthPercent}%`,
                    background: isBottleneck 
                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      : `linear-gradient(135deg, hsl(${250 - index * 30}, 70%, 60%) 0%, hsl(${250 - index * 30}, 70%, 50%) 100%)`
                  }}
                >
                  <div className="funnel-label">
                    <span className="funnel-stage-name">{stage.stage}</span>
                    <span className="funnel-value">{stage.outputUnits.toLocaleString()} units</span>
                  </div>
                </div>
                <div className="funnel-loss">
                  {stage.loss > 0 && (
                    <span className="loss-indicator">
                      -{stage.loss.toLocaleString()} ({lossPercent.toFixed(2)}% loss)
                    </span>
                  )}
                </div>
              </div>
              {index < data.length - 1 && (
                <div className="funnel-arrow">
                  <svg width="30" height="30" viewBox="0 0 30 30">
                    <path d="M15 5 L15 20 M10 15 L15 20 L20 15" stroke="#667eea" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="funnel-summary">
        <div className="summary-item">
          <strong>Initial Input:</strong> {data[0].inputUnits.toLocaleString()} units
        </div>
        <div className="summary-item">
          <strong>Final Output:</strong> {data[data.length - 1].outputUnits.toLocaleString()} units
        </div>
        <div className="summary-item">
          <strong>Total Loss:</strong> {(data[0].inputUnits - data[data.length - 1].outputUnits).toLocaleString()} units
          ({(((data[0].inputUnits - data[data.length - 1].outputUnits) / data[0].inputUnits) * 100).toFixed(2)}%)
        </div>
      </div>
    </div>
  );
};

export default FunnelChart;
