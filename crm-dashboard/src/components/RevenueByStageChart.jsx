import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const RevenueByStageChart = ({ data }) => {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Revenue by Pipeline Stage</span>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(value) => `€${value >= 1000 ? (value / 1000) + 'k' : value}`} />
            <Tooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => [`€${value.toLocaleString()}`, 'Revenue']}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
