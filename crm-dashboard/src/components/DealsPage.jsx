import React, { useMemo, useState } from 'react';
import { Briefcase, DollarSign, TrendingUp, AlertCircle, Search, Plus, Filter } from 'lucide-react';
import { clients, users, stages } from '../data/mockData';
import { KPICard } from './KPICard';
import { DealDetailsModal } from './DealDetailsModal';
import { subDays, isAfter, parseISO } from 'date-fns';

export const DealsPage = ({ currentDeals, onAddDeal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDeal, setSelectedDeal] = useState(null);

  // Enrich deals with client, owner, and stage info
  const enrichedDeals = useMemo(() => {
    return currentDeals.map(deal => ({
      ...deal,
      clientName: clients.find(c => c.id === deal.customer_id)?.company_name || 'Unknown',
      ownerName: users.find(u => u.id === deal.owner_id)?.full_name || 'Unknown',
      ownerAvatar: users.find(u => u.id === deal.owner_id)?.avatar_url || '',
      stageName: stages.find(s => s.id === deal.stage_id)?.name || 'Unknown',
      stageOrder: stages.find(s => s.id === deal.stage_id)?.display_order || 0,
    }));
  }, [currentDeals]);

  // KPIs
  const kpis = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);
    const sixtyDaysAgo = subDays(today, 60);

    const currentMonthDeals = currentDeals.filter(d => d.created_at && isAfter(parseISO(d.created_at), thirtyDaysAgo));
    const lastMonthDeals = currentDeals.filter(d => d.created_at && isAfter(parseISO(d.created_at), sixtyDaysAgo) && !isAfter(parseISO(d.created_at), thirtyDaysAgo));

    const total = currentDeals.length;
    const open = currentDeals.filter(d => d.status === 'open').length;
    const won = currentDeals.filter(d => d.status === 'won').length;
    const lost = currentDeals.filter(d => d.status === 'lost').length;
    
    const totalPipelineValue = currentDeals
      .filter(d => d.status === 'open')
      .reduce((sum, d) => sum + d.amount, 0);
    const wonRevenue = currentDeals
      .filter(d => d.status === 'won')
      .reduce((sum, d) => sum + d.amount, 0);
    const winRate = (won + lost) > 0 ? (won / (won + lost)) * 100 : 0;

    const currentTotal = currentMonthDeals.length;
    const lastTotal = lastMonthDeals.length;
    const totalGrowth = lastTotal === 0 ? 0 : ((currentTotal - lastTotal) / lastTotal) * 100;

    const currentOpenVal = currentMonthDeals.filter(d => d.status === 'open').reduce((sum, d) => sum + d.amount, 0);
    const lastOpenVal = lastMonthDeals.filter(d => d.status === 'open').reduce((sum, d) => sum + d.amount, 0);
    const openValGrowth = lastOpenVal === 0 ? 0 : ((currentOpenVal - lastOpenVal) / lastOpenVal) * 100;

    const currentWonRev = currentMonthDeals.filter(d => d.status === 'won').reduce((sum, d) => sum + d.amount, 0);
    const lastWonRev = lastMonthDeals.filter(d => d.status === 'won').reduce((sum, d) => sum + d.amount, 0);
    const wonRevGrowth = lastWonRev === 0 ? 0 : ((currentWonRev - lastWonRev) / lastWonRev) * 100;

    const currentLost = currentMonthDeals.filter(d => d.status === 'lost').length;
    const lastLost = lastMonthDeals.filter(d => d.status === 'lost').length;
    const lostGrowth = currentLost - lastLost;

    return { 
      total, open, won, lost, totalPipelineValue, wonRevenue, winRate,
      totalGrowth, openValGrowth, wonRevGrowth, lostGrowth
    };
  }, [currentDeals]);

  // Filter + Search
  const filteredDeals = useMemo(() => {
    return enrichedDeals.filter(d => {
      const matchesSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStage = stageFilter === 'all' || d.stage_id === stageFilter;
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
      return matchesSearch && matchesStage && matchesStatus;
    });
  }, [enrichedDeals, searchQuery, stageFilter, statusFilter]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'won': return 'status-won';
      case 'open': return 'status-open';
      case 'lost': return 'status-lost';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'won': return 'Ganado';
      case 'open': return 'Activo';
      case 'lost': return 'Perdido';
      default: return status;
    }
  };

  const getStageBadgeClass = (stageName) => {
    switch (stageName) {
      case 'Negotiation': return 'stage-badge--negotiation';
      case 'Closed Won': return 'stage-badge--won';
      case 'Closed Lost': return 'stage-badge--lost';
      default: return '';
    }
  };

  const getStageLabel = (stageName) => {
    switch (stageName) {
      case 'Negotiation': return 'Negociación';
      case 'Closed Won': return 'Ganado';
      case 'Closed Lost': return 'Perdido';
      default: return stageName;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>Deals</h1>
          <p>Sales opportunities, active negotiations, and deal tracking.</p>
        </div>
        <div className="header-buttons">
          <button
            className="btn btn-primary"
            id="add-deal-from-page-btn"
            onClick={onAddDeal}
          >
            <Plus size={16} />
            New Deal
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <KPICard
          title="Total Deals"
          value={kpis.total}
          subtitle="All deals in the system"
          trend={kpis.totalGrowth >= 0 ? 'up' : 'down'}
          trendValue={`${kpis.totalGrowth >= 0 ? '+' : ''}${kpis.totalGrowth.toFixed(1)}%`}
          trendLabel="vs last month"
          icon={Briefcase}
          iconColor="blue"
        />
        <KPICard
          title="Open Pipeline"
          value={formatCurrency(kpis.totalPipelineValue)}
          subtitle={`${kpis.open} active opportunities`}
          trend={kpis.openValGrowth >= 0 ? 'up' : 'down'}
          trendValue={`${kpis.openValGrowth >= 0 ? '+' : ''}${kpis.openValGrowth.toFixed(1)}%`}
          trendLabel="vs last month"
          icon={DollarSign}
          iconColor="orange"
        />
        <KPICard
          title="Won Revenue"
          value={formatCurrency(kpis.wonRevenue)}
          subtitle={`${kpis.won} deals closed won`}
          trend={kpis.wonRevGrowth >= 0 ? 'up' : 'down'}
          trendValue={`${kpis.wonRevGrowth >= 0 ? '+' : ''}${kpis.wonRevGrowth.toFixed(1)}%`}
          trendLabel="vs last month"
          icon={TrendingUp}
          iconColor="green"
        />
        <KPICard
          title="Lost Deals"
          value={kpis.lost}
          subtitle="Deals closed lost"
          trend={kpis.lostGrowth <= 0 ? 'up' : 'down'}
          trendValue={`${kpis.lostGrowth > 0 ? '+' : ''}${kpis.lostGrowth}`}
          trendLabel="vs last month"
          icon={AlertCircle}
          iconColor="purple"
        />
      </div>

      {/* Toolbar */}
      <div className="deals-toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            id="deal-search"
            type="text"
            className="search-input"
            placeholder="Search by deal name, client, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="deals-filters">
          <div className="deals-filter-group">
            <Filter size={14} />
            <select
              id="stage-filter"
              className="deals-filter-select"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              <option value="all">All Stages</option>
              {stages.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-tabs">
            <button
              className={`filter-tab ${statusFilter === 'all' ? 'filter-tab--active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({currentDeals.length})
            </button>
            <button
              className={`filter-tab ${statusFilter === 'open' ? 'filter-tab--active' : ''}`}
              onClick={() => setStatusFilter('open')}
            >
              Active ({kpis.open})
            </button>
            <button
              className={`filter-tab ${statusFilter === 'won' ? 'filter-tab--active' : ''}`}
              onClick={() => setStatusFilter('won')}
            >
              Won ({kpis.won})
            </button>
            <button
              className={`filter-tab ${statusFilter === 'lost' ? 'filter-tab--active' : ''}`}
              onClick={() => setStatusFilter('lost')}
            >
              Lost ({kpis.lost})
            </button>
          </div>
        </div>
      </div>

      {/* Deals Table */}
      <div className="card deals-table-card">
        <div className="card-header">
          <span className="card-title">
            {filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''} found
          </span>
        </div>
        <div className="table-container">
          <table className="deals-table">
            <thead>
              <tr>
                <th>Deal Name</th>
                <th>Client</th>
                <th>Value</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal) => (
                <tr 
                  key={deal.id} 
                  className="deals-table__row" 
                  onClick={() => setSelectedDeal(deal)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div className="deal-name-cell">
                      <span className="deal-name-cell__title">{deal.title}</span>
                    </div>
                  </td>
                  <td>
                    <div className="deal-client-cell">
                      <div className="deal-client-cell__avatar">
                        {deal.clientName.charAt(0)}
                      </div>
                      <span>{deal.clientName}</span>
                    </div>
                  </td>
                  <td>
                    <span className="deal-amount">{formatCurrency(deal.amount)}</span>
                  </td>
                  <td>
                    <span className={`stage-badge ${getStageBadgeClass(deal.stageName)}`}>
                      {getStageLabel(deal.stageName)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(deal.status)}`}>
                      {getStatusLabel(deal.status)}
                    </span>
                  </td>
                  <td>
                    <div className="deal-owner-cell">
                      <img
                        src={deal.ownerAvatar}
                        alt={deal.ownerName}
                        className="deal-owner-cell__avatar"
                      />
                      <span>{deal.ownerName}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDeals.length === 0 && (
          <div className="clients-empty">
            <Search size={48} />
            <h3>No deals found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      <DealDetailsModal
        isOpen={!!selectedDeal}
        onClose={() => setSelectedDeal(null)}
        deal={selectedDeal}
        clientName={selectedDeal?.clientName}
      />
    </div>
  );
};
