import React, { useMemo, useState } from 'react';
import { Download, FileText, Calendar, Filter, Users, Building2, TrendingUp, AlertCircle, PieChart as PieIcon, BarChart as BarIcon, ChevronDown } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend, LineChart, Line 
} from 'recharts';
import { clients, users, stages, lossReasons } from '../data/mockData';
import { KPICard } from './KPICard';
import { 
  parseISO, isAfter, isBefore, subDays, startOfMonth, endOfMonth, 
  startOfQuarter, endOfQuarter, startOfYear, differenceInDays 
} from 'date-fns';

export const ReportsPage = ({ currentDeals }) => {
  // Filter States
  const [dateRange, setDateRange] = useState('last_30_days');
  const [salesRep, setSalesRep] = useState('all');
  const [pipelineStage, setPipelineStage] = useState('all');
  const [industry, setIndustry] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter Logic
  const filteredDeals = useMemo(() => {
    return currentDeals.filter(deal => {
      // Date Filter: Use closed_at for won/lost deals, created_at for open ones
      const dateToFilter = (deal.status === 'won' || deal.status === 'lost') && deal.closed_at 
        ? parseISO(deal.closed_at) 
        : parseISO(deal.created_at);
      
      const today = new Date();
      let dateMatch = true;

      if (dateRange === 'last_30_days') {
        dateMatch = isAfter(dateToFilter, subDays(today, 30));
      } else if (dateRange === 'this_month') {
        dateMatch = isAfter(dateToFilter, startOfMonth(today)) && isBefore(dateToFilter, endOfMonth(today));
      } else if (dateRange === 'last_quarter') {
        const startQ = startOfQuarter(subDays(today, 90));
        const endQ = endOfQuarter(subDays(today, 90));
        dateMatch = isAfter(dateToFilter, startQ) && isBefore(dateToFilter, endQ);
      } else if (dateRange === 'this_year') {
        dateMatch = isAfter(dateToFilter, startOfYear(today));
      }

      // Sales Rep Filter
      const repMatch = salesRep === 'all' || deal.owner_id === salesRep;

      // Pipeline Stage Filter
      const stageMatch = pipelineStage === 'all' || deal.stage_id === pipelineStage;

      // Status Filter
      const statusMatch = statusFilter === 'all' || deal.status === statusFilter;

      // Industry Filter (needs to join with clients)
      const client = clients.find(c => c.id === deal.customer_id);
      const industryMatch = industry === 'all' || client?.industry === industry;

      return dateMatch && repMatch && stageMatch && statusMatch && industryMatch;
    });
  }, [currentDeals, dateRange, salesRep, pipelineStage, industry, statusFilter]);

  const prevFilteredDeals = useMemo(() => {
    return currentDeals.filter(deal => {
      const dateToFilter = (deal.status === 'won' || deal.status === 'lost') && deal.closed_at 
        ? parseISO(deal.closed_at) 
        : parseISO(deal.created_at);
      
      const today = new Date();
      let dateMatch = false;

      if (dateRange === 'last_30_days') {
        const start = subDays(today, 60);
        const end = subDays(today, 30);
        dateMatch = isAfter(dateToFilter, start) && isBefore(dateToFilter, end);
      } else if (dateRange === 'this_month') {
        const prevMonthDate = subDays(startOfMonth(today), 1);
        dateMatch = isAfter(dateToFilter, startOfMonth(prevMonthDate)) && isBefore(dateToFilter, endOfMonth(prevMonthDate));
      } else if (dateRange === 'last_quarter') {
        const prevQStart = startOfQuarter(subDays(today, 90));
        const prevQEnd = endOfQuarter(subDays(today, 90));
        dateMatch = isAfter(dateToFilter, prevQStart) && isBefore(dateToFilter, prevQEnd);
      } else if (dateRange === 'this_year') {
        const lastYearStart = startOfYear(subDays(today, 365));
        const lastYearEnd = startOfYear(today);
        dateMatch = isAfter(dateToFilter, lastYearStart) && isBefore(dateToFilter, lastYearEnd);
      }

      const repMatch = salesRep === 'all' || deal.owner_id === salesRep;
      const stageMatch = pipelineStage === 'all' || deal.stage_id === pipelineStage;
      const statusMatch = statusFilter === 'all' || deal.status === statusFilter;
      const client = clients.find(c => c.id === deal.customer_id);
      const industryMatch = industry === 'all' || client?.industry === industry;

      return dateMatch && repMatch && stageMatch && statusMatch && industryMatch;
    });
  }, [currentDeals, dateRange, salesRep, pipelineStage, industry, statusFilter]);

  // KPI Calculations
  const reportKPIs = useMemo(() => {
    const wonDeals = filteredDeals.filter(d => d.status === 'won');
    const lostDeals = filteredDeals.filter(d => d.status === 'lost');
    const openDeals = filteredDeals.filter(d => d.status === 'open');
    const closedDeals = [...wonDeals, ...lostDeals];

    const revenueReported = wonDeals.reduce((sum, d) => sum + d.amount, 0);
    const dealsClosed = closedDeals.length;
    const winRate = dealsClosed > 0 ? (wonDeals.length / dealsClosed) * 100 : 0;
    const lostRevenue = lostDeals.reduce((sum, d) => sum + d.amount, 0);
    const pipelineValue = openDeals.reduce((sum, d) => sum + d.amount, 0);

    const prevWonDeals = prevFilteredDeals.filter(d => d.status === 'won');
    const prevLostDeals = prevFilteredDeals.filter(d => d.status === 'lost');
    const prevOpenDeals = prevFilteredDeals.filter(d => d.status === 'open');
    const prevClosedDeals = [...prevWonDeals, ...prevLostDeals];

    const prevRevenueReported = prevWonDeals.reduce((sum, d) => sum + d.amount, 0);
    const prevDealsClosed = prevClosedDeals.length;
    const prevWinRate = prevDealsClosed > 0 ? (prevWonDeals.length / prevDealsClosed) * 100 : 0;
    const prevLostRevenue = prevLostDeals.reduce((sum, d) => sum + d.amount, 0);
    const prevPipelineValue = prevOpenDeals.reduce((sum, d) => sum + d.amount, 0);

    const revenueGrowth = prevRevenueReported === 0 ? 0 : ((revenueReported - prevRevenueReported) / prevRevenueReported) * 100;
    const dealsClosedGrowth = prevDealsClosed === 0 ? 0 : ((dealsClosed - prevDealsClosed) / prevDealsClosed) * 100;
    const winRateGrowth = winRate - prevWinRate;
    const lostRevGrowth = prevLostRevenue === 0 ? 0 : ((lostRevenue - prevLostRevenue) / prevLostRevenue) * 100;
    const pipelineGrowth = prevPipelineValue === 0 ? 0 : ((pipelineValue - prevPipelineValue) / prevPipelineValue) * 100;

    // Avg Sales Cycle
    const wonWithDates = wonDeals.filter(d => d.created_at && d.closed_at);
    const avgSalesCycle = wonWithDates.length > 0 
      ? wonWithDates.reduce((sum, d) => sum + differenceInDays(parseISO(d.closed_at), parseISO(d.created_at)), 0) / wonWithDates.length
      : 0;

    const prevWonWithDates = prevWonDeals.filter(d => d.created_at && d.closed_at);
    const prevAvgSalesCycle = prevWonWithDates.length > 0
      ? prevWonWithDates.reduce((sum, d) => sum + differenceInDays(parseISO(d.closed_at), parseISO(d.created_at)), 0) / prevWonWithDates.length
      : 0;
    const cycleGrowth = avgSalesCycle - prevAvgSalesCycle;

    return { 
      revenueReported, dealsClosed, winRate, lostRevenue, pipelineValue, avgSalesCycle,
      revenueGrowth, dealsClosedGrowth, winRateGrowth, lostRevGrowth, pipelineGrowth, cycleGrowth
    };
  }, [filteredDeals, prevFilteredDeals]);

  // Report Data: Sales Rep Performance
  const repPerformance = useMemo(() => {
    return users.map(user => {
      const repDeals = filteredDeals.filter(d => d.owner_id === user.id);
      const won = repDeals.filter(d => d.status === 'won');
      const lost = repDeals.filter(d => d.status === 'lost');
      const open = repDeals.filter(d => d.status === 'open');
      
      const wonRevenue = won.reduce((sum, d) => sum + d.amount, 0);
      const openPipeline = open.reduce((sum, d) => sum + d.amount, 0);
      const winRate = (won.length + lost.length) > 0 ? (won.length / (won.length + lost.length)) * 100 : 0;
      const quotaAttainment = user.quota_amount > 0 ? (wonRevenue / user.quota_amount) * 100 : 0;

      return {
        name: user.full_name,
        wonRevenue,
        openPipeline,
        dealsWon: won.length,
        dealsLost: lost.length,
        winRate,
        quotaAttainment
      };
    });
  }, [filteredDeals]);

  // Report Data: Pipeline Stage
  const stageReport = useMemo(() => {
    return stages.map(stage => {
      const stageDeals = filteredDeals.filter(d => d.stage_id === stage.id);
      const totalAmount = stageDeals.reduce((sum, d) => sum + d.amount, 0);
      const avgAmount = stageDeals.length > 0 ? totalAmount / stageDeals.length : 0;

      return {
        name: stage.name,
        count: stageDeals.length,
        totalAmount,
        avgAmount,
        probability: stage.win_probability
      };
    });
  }, [filteredDeals]);

  // Report Data: Loss Reasons
  const lossReport = useMemo(() => {
    const lostDeals = filteredDeals.filter(d => d.status === 'lost');
    const reasons = [...new Set(lostDeals.map(d => d.loss_reason || 'Sin especificar'))];
    
    return reasons.map(reason => {
      const matches = lostDeals.filter(d => (d.loss_reason || 'Sin especificar') === reason);
      const lostRevenue = matches.reduce((sum, d) => sum + d.amount, 0);
      const totalLostRevenue = lostDeals.reduce((sum, d) => sum + d.amount, 0);

      return {
        name: reason,
        count: matches.length,
        lostRevenue,
        percentage: totalLostRevenue > 0 ? (lostRevenue / totalLostRevenue) * 100 : 0
      };
    }).sort((a, b) => b.lostRevenue - a.lostRevenue);
  }, [filteredDeals]);

  // Report Data: Industry
  const industryReport = useMemo(() => {
    const industries = [...new Set(clients.map(c => c.industry))];
    
    return industries.map(ind => {
      const indClients = clients.filter(c => c.industry === ind);
      const clientIds = indClients.map(c => c.id);
      const indDeals = filteredDeals.filter(d => clientIds.includes(d.customer_id));
      
      const won = indDeals.filter(d => d.status === 'won');
      const lost = indDeals.filter(d => d.status === 'lost');
      const open = indDeals.filter(d => d.status === 'open');
      
      const wonRevenue = won.reduce((sum, d) => sum + d.amount, 0);
      const openPipeline = open.reduce((sum, d) => sum + d.amount, 0);
      const winRate = (won.length + lost.length) > 0 ? (won.length / (won.length + lost.length)) * 100 : 0;

      return {
        industry: ind,
        clientCount: indClients.length,
        wonRevenue,
        openPipeline,
        winRate
      };
    }).sort((a, b) => b.wonRevenue - a.wonRevenue);
  }, [filteredDeals]);

  // Chart Colors
  const COLORS = ['#3b82f6', '#10b981', '#f97316', '#a855f7', '#ef4444', '#64748b'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  const getTrendLabel = () => {
    switch(dateRange) {
      case 'last_30_days': return 'vs prev 30 days';
      case 'this_month': return 'vs last month';
      case 'last_quarter': return 'vs prev quarter';
      case 'this_year': return 'vs last year';
      default: return 'vs prev period';
    }
  };
  const trendLabel = getTrendLabel();

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>Reports</h1>
          <p>Analyze sales performance, pipeline health and revenue trends.</p>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="reports-filters card">
        <div className="filter-group">
          <label>Date Range</label>
          <div className="select-wrapper">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="last_30_days">Last 30 Days</option>
              <option value="this_month">This Month</option>
              <option value="last_quarter">Last Quarter</option>
              <option value="this_year">This Year</option>
            </select>
            <ChevronDown size={14} className="select-icon" />
          </div>
        </div>
        <div className="filter-group">
          <label>Sales Rep</label>
          <div className="select-wrapper">
            <select value={salesRep} onChange={(e) => setSalesRep(e.target.value)}>
              <option value="all">All Reps</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
            </select>
            <ChevronDown size={14} className="select-icon" />
          </div>
        </div>
        <div className="filter-group">
          <label>Stage</label>
          <div className="select-wrapper">
            <select value={pipelineStage} onChange={(e) => setPipelineStage(e.target.value)}>
              <option value="all">All Stages</option>
              {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <ChevronDown size={14} className="select-icon" />
          </div>
        </div>
        <div className="filter-group">
          <label>Industry</label>
          <div className="select-wrapper">
            <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option value="all">All Industries</option>
              {[...new Set(clients.map(c => c.industry))].map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            <ChevronDown size={14} className="select-icon" />
          </div>
        </div>
        <div className="filter-group">
          <label>Status</label>
          <div className="select-wrapper">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
            <ChevronDown size={14} className="select-icon" />
          </div>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="kpi-grid">
        <KPICard 
          title="Revenue Reported"
          value={formatCurrency(reportKPIs.revenueReported)}
          subtitle="Won deals in period"
          trend={reportKPIs.revenueGrowth >= 0 ? 'up' : 'down'}
          trendValue={`${reportKPIs.revenueGrowth >= 0 ? '+' : ''}${reportKPIs.revenueGrowth.toFixed(1)}%`}
          trendLabel={trendLabel}
          icon={TrendingUp}
          iconColor="green"
        />
        <KPICard 
          title="Deals Closed"
          value={reportKPIs.dealsClosed}
          subtitle="Won or lost deals"
          trend={reportKPIs.dealsClosedGrowth >= 0 ? 'up' : 'down'}
          trendValue={`${reportKPIs.dealsClosedGrowth >= 0 ? '+' : ''}${reportKPIs.dealsClosedGrowth.toFixed(1)}%`}
          trendLabel={trendLabel}
          icon={CheckCircle}
          iconColor="blue"
        />
        <KPICard 
          title="Win Rate"
          value={`${reportKPIs.winRate.toFixed(1)}%`}
          subtitle="Success ratio"
          trend={reportKPIs.winRateGrowth >= 0 ? 'up' : 'down'}
          trendValue={`${reportKPIs.winRateGrowth >= 0 ? '+' : ''}${reportKPIs.winRateGrowth.toFixed(1)}%`}
          trendLabel={trendLabel}
          icon={TrendingUp}
          iconColor="purple"
        />
        <KPICard 
          title="Lost Revenue"
          value={formatCurrency(reportKPIs.lostRevenue)}
          subtitle="Closed lost deals"
          trend={reportKPIs.lostRevGrowth <= 0 ? 'up' : 'down'} // Less lost revenue is better
          trendValue={`${reportKPIs.lostRevGrowth >= 0 ? '+' : ''}${reportKPIs.lostRevGrowth.toFixed(1)}%`}
          trendLabel={trendLabel}
          icon={AlertCircle}
          iconColor="red"
        />
        <KPICard 
          title="Pipeline Value"
          value={formatCurrency(reportKPIs.pipelineValue)}
          subtitle="Open opportunities"
          trend={reportKPIs.pipelineGrowth >= 0 ? 'up' : 'down'}
          trendValue={`${reportKPIs.pipelineGrowth >= 0 ? '+' : ''}${reportKPIs.pipelineGrowth.toFixed(1)}%`}
          trendLabel={trendLabel}
          icon={BarIcon}
          iconColor="orange"
        />
        <KPICard 
          title="Avg Sales Cycle"
          value={`${reportKPIs.avgSalesCycle.toFixed(0)} days`}
          subtitle="From start to won"
          trend={reportKPIs.cycleGrowth <= 0 ? 'up' : 'down'} // Shorter cycle is better
          trendValue={`${reportKPIs.cycleGrowth > 0 ? '+' : ''}${reportKPIs.cycleGrowth.toFixed(0)} days`}
          trendLabel={trendLabel}
          icon={Clock}
          iconColor="blue"
        />
      </div>

      {/* Charts Grid */}
      <div className="reports-grid">
        {/* Sales Rep Performance Chart */}
        <div className="card report-card">
          <div className="card-header">
            <h3 className="card-title">Revenue by Sales Rep</h3>
            <Users size={16} className="text-muted" />
          </div>
          <div className="chart-container" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={repPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `€${val/1000}k`} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="wonRevenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Won Revenue" />
                <Bar dataKey="openPipeline" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Open Pipeline" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Stage Distribution */}
        <div className="card report-card">
          <div className="card-header">
            <h3 className="card-title">Deals by Pipeline Stage</h3>
            <BarIcon size={16} className="text-muted" />
          </div>
          <div className="chart-container" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageReport} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} name="Deals" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Team Performance Table */}
      <div className="card table-card mt-24">
        <div className="card-header">
          <h3 className="card-title">Team Performance Report</h3>
        </div>
        <div className="table-container">
          <table className="deals-table">
            <thead>
              <tr>
                <th>Sales Rep</th>
                <th>Won Revenue</th>
                <th>Open Pipeline</th>
                <th>Won / Lost</th>
                <th>Win Rate</th>
                <th>Quota Attainment</th>
              </tr>
            </thead>
            <tbody>
              {repPerformance.map((rep, idx) => (
                <tr key={idx} className="deals-table__row">
                  <td><span className="font-600">{rep.name}</span></td>
                  <td><span className="deal-amount">{formatCurrency(rep.wonRevenue)}</span></td>
                  <td><span className="text-secondary">{formatCurrency(rep.openPipeline)}</span></td>
                  <td>
                    <span className="text-secondary">
                      {rep.dealsWon} <span className="text-success">W</span> / {rep.dealsLost} <span className="text-danger">L</span>
                    </span>
                  </td>
                  <td>
                    <div className="progress-cell">
                      <span className="mr-8">{rep.winRate.toFixed(1)}%</span>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${rep.winRate}%`, background: '#3b82f6' }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="progress-cell">
                      <span className="mr-8">{rep.quotaAttainment.toFixed(0)}%</span>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${Math.min(rep.quotaAttainment, 100)}%`, background: rep.quotaAttainment >= 100 ? '#10b981' : '#f97316' }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="reports-grid mt-24">

        {/* Industry Performance */}
        <div className="card report-card">
          <div className="card-header">
            <h3 className="card-title">Performance by Industry</h3>
            <Building2 size={16} className="text-muted" />
          </div>
          <div className="table-container px-20 pb-20">
            <table className="mini-table">
              <thead>
                <tr>
                  <th>Industry</th>
                  <th>Won</th>
                  <th>Pipeline</th>
                  <th>Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {industryReport.map((ind, idx) => (
                  <tr key={idx}>
                    <td><span className="font-600">{ind.industry}</span></td>
                    <td>{formatCurrency(ind.wonRevenue)}</td>
                    <td>{formatCurrency(ind.openPipeline)}</td>
                    <td>{ind.winRate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components if needed or just use standard HTML
const CheckCircle = ({ size, className }) => <div className={className}><TrendingUp size={size} /></div>;
const Clock = ({ size, className }) => <div className={className}><TrendingUp size={size} /></div>;
