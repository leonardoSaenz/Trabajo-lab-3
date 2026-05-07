import React, { useMemo, useState } from 'react';
import { Building2, Users, UserPlus, UserCheck, Search, Mail, Phone, ExternalLink, Briefcase, TrendingUp, Clock } from 'lucide-react';
import { clients, deals } from '../data/mockData';
import { KPICard } from './KPICard';
import { ClientDealsModal } from './ClientDealsModal';
import { parseISO, subDays, isAfter, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const ClientsPage = ({ currentDeals }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);

  const allDeals = currentDeals || deals;

  // Compute client data enriched with deal info
  const clientsData = useMemo(() => {
    return clients.map(client => {
      const clientDeals = allDeals.filter(d => d.customer_id === client.id);
      const totalRevenue = clientDeals.reduce((sum, d) => sum + d.amount, 0);
      const wonRevenue = clientDeals.filter(d => d.status === 'won').reduce((sum, d) => sum + d.amount, 0);
      const openDeals = clientDeals.filter(d => d.status === 'open').length;
      const wonDeals = clientDeals.filter(d => d.status === 'won').length;

      // Last activity = most recent created_at or closed_at across all their deals
      const allDates = clientDeals
        .flatMap(d => [d.created_at, d.closed_at].filter(Boolean))
        .map(d => parseISO(d))
        .sort((a, b) => b - a);
      const lastActivity = allDates.length > 0 ? allDates[0] : (client.created_at ? parseISO(client.created_at) : null);

      return {
        ...client,
        dealsCount: clientDeals.length,
        openDeals,
        wonDeals,
        totalRevenue,
        wonRevenue,
        lastActivity,
      };
    });
  }, [allDeals]);

  // KPIs
  const kpis = useMemo(() => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'active').length;
    const newClientsThisMonth = clients.filter(c =>
      c.created_at && isAfter(parseISO(c.created_at), thirtyDaysAgo)
    ).length;
    const totalPipelineValue = clientsData.reduce((sum, c) => sum + c.totalRevenue, 0);

    return { totalClients, activeClients, newClientsThisMonth, totalPipelineValue };
  }, [clientsData]);

  // Filter + Search
  const filteredClients = useMemo(() => {
    return clientsData.filter(c => {
      const matchesSearch =
        c.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clientsData, searchQuery, statusFilter]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  const getIndustryColor = (industry) => {
    const colors = {
      'Software': { bg: '#eff6ff', color: '#3b82f6' },
      'Manufacturing': { bg: '#fef3c7', color: '#d97706' },
      'Technology': { bg: '#ecfdf5', color: '#10b981' },
      'Finance': { bg: '#faf5ff', color: '#a855f7' },
      'Design': { bg: '#fdf2f8', color: '#ec4899' },
    };
    return colors[industry] || { bg: '#f1f5f9', color: '#64748b' };
  };

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>Clients</h1>
          <p>Manage your client portfolio and track relationships.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <KPICard
          title="Total Clients"
          value={kpis.totalClients}
          subtitle="All registered companies"
          trend="neutral"
          trendValue="—"
          icon={Building2}
          iconColor="blue"
        />
        <KPICard
          title="Active Clients"
          value={kpis.activeClients}
          subtitle="Currently engaged"
          trend="up"
          trendValue={`${((kpis.activeClients / kpis.totalClients) * 100).toFixed(0)}% of total`}
          icon={UserCheck}
          iconColor="green"
        />
        <KPICard
          title="New This Month"
          value={kpis.newClientsThisMonth}
          subtitle="Clients added in last 30 days"
          trend={kpis.newClientsThisMonth > 0 ? 'up' : 'neutral'}
          trendValue={kpis.newClientsThisMonth > 0 ? `+${kpis.newClientsThisMonth}` : '0'}
          icon={UserPlus}
          iconColor="orange"
        />
        <KPICard
          title="Total Pipeline"
          value={formatCurrency(kpis.totalPipelineValue)}
          subtitle="Across all client deals"
          trend="up"
          trendValue="+12.5%"
          icon={TrendingUp}
          iconColor="purple"
        />
      </div>

      {/* Search & Filters */}
      <div className="clients-toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            id="client-search"
            type="text"
            className="search-input"
            placeholder="Search clients by name, contact, or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${statusFilter === 'all' ? 'filter-tab--active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({clients.length})
          </button>
          <button
            className={`filter-tab ${statusFilter === 'active' ? 'filter-tab--active' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            Active ({clients.filter(c => c.status === 'active').length})
          </button>
          <button
            className={`filter-tab ${statusFilter === 'inactive' ? 'filter-tab--active' : ''}`}
            onClick={() => setStatusFilter('inactive')}
          >
            Inactive ({clients.filter(c => c.status === 'inactive').length})
          </button>
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="clients-grid">
        {filteredClients.map((client) => {
          const industryStyle = getIndustryColor(client.industry);
          return (
            <div key={client.id} className="client-card card">
              {/* Card Header */}
              <div className="client-card__header">
                <div className="client-card__avatar">
                  {client.company_name.charAt(0)}
                </div>
                <div className="client-card__info">
                  <h3 className="client-card__name">{client.company_name}</h3>
                  <span
                    className="client-card__industry"
                    style={{ background: industryStyle.bg, color: industryStyle.color }}
                  >
                    {client.industry}
                  </span>
                </div>
                <span className={`client-card__status client-card__status--${client.status}`}>
                  {client.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              {/* Contact Info */}
              <div className="client-card__contact">
                <div className="client-card__contact-row">
                  <Users size={14} />
                  <span>{client.contact_person}</span>
                </div>
                <div className="client-card__contact-row">
                  <Mail size={14} />
                  <span>{client.email}</span>
                </div>
                <div className="client-card__contact-row">
                  <Phone size={14} />
                  <span>{client.phone}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="client-card__metrics">
                <div className="client-card__metric">
                  <div className="client-card__metric-icon">
                    <Briefcase size={14} />
                  </div>
                  <div>
                    <span className="client-card__metric-value">{client.dealsCount}</span>
                    <span className="client-card__metric-label">Deals</span>
                  </div>
                </div>
                <div className="client-card__metric">
                  <div className="client-card__metric-icon client-card__metric-icon--green">
                    <TrendingUp size={14} />
                  </div>
                  <div>
                    <span className="client-card__metric-value">{formatCurrency(client.totalRevenue)}</span>
                    <span className="client-card__metric-label">Revenue</span>
                  </div>
                </div>
                <div className="client-card__metric">
                  <div className="client-card__metric-icon client-card__metric-icon--orange">
                    <Clock size={14} />
                  </div>
                  <div>
                    <span className="client-card__metric-value">
                      {client.lastActivity
                        ? formatDistanceToNow(client.lastActivity, { addSuffix: true, locale: es })
                        : 'N/A'}
                    </span>
                    <span className="client-card__metric-label">Last Activity</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="client-card__footer">
                <div className="client-card__deals-summary">
                  <span className="client-card__deal-badge client-card__deal-badge--open">{client.openDeals} open</span>
                  <span className="client-card__deal-badge client-card__deal-badge--won">{client.wonDeals} won</span>
                </div>
                <button
                  className="btn btn-outline client-card__view-btn"
                  onClick={() => setSelectedClient(client)}
                >
                  <ExternalLink size={14} />
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredClients.length === 0 && (
        <div className="clients-empty">
          <Search size={48} />
          <h3>No clients found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}

      <ClientDealsModal
        isOpen={!!selectedClient}
        onClose={() => setSelectedClient(null)}
        client={selectedClient}
        deals={selectedClient ? allDeals.filter(d => d.customer_id === selectedClient.id) : []}
      />
    </div>
  );
};
