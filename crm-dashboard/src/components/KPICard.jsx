import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const KPICard = ({ title, value, subtitle, trend, trendValue, icon: Icon, iconColor, trendLabel = 'vs last month' }) => {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{title}</span>
        {Icon && (
          <div className={`kpi-icon ${iconColor}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-subtitle">{subtitle}</div>
      <div className={`kpi-trend ${isPositive ? 'trend-up' : isNegative ? 'trend-down' : 'trend-neutral'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : isNegative ? <ArrowDownRight size={16} /> : <Minus size={16} />}
        <span>{trendValue}</span>
        {trendValue !== '—' && <span className="trend-text">{trendLabel}</span>}
      </div>
    </div>
  );
};
