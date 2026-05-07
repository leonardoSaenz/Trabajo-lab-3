import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const SalesEvolutionChart = ({ data }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="card-title">Deal Evolution — Last 30 Days</span>
          <span className="kpi-subtitle" style={{ marginBottom: 0, marginTop: '4px' }}>Daily deal acquisition and activity</span>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e2e8f0" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} minTickGap={30} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line type="monotone" dataKey="deals" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
