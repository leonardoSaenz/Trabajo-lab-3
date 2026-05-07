import React, { useState } from 'react';
import { Download, Plus, Users, Target, CheckCircle, TrendingUp } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { KPICard } from './components/KPICard';
import { RevenueByStageChart } from './components/RevenueByStageChart';
import { SalesEvolutionChart } from './components/SalesEvolutionChart';
import { RecentDealsTable } from './components/RecentDealsTable';
import { AIChatWidget } from './components/AIChatWidget';
import { AddDealModal } from './components/AddDealModal';
import { DealDetailsModal } from './components/DealDetailsModal';
import { ClientsPage } from './components/ClientsPage';
import { DealsPage } from './components/DealsPage';
import { ReportsPage } from './components/ReportsPage';
import { ActivitiesPage } from './components/ActivitiesPage';
import { useDashboardData } from './hooks/useDashboardData';
import { deals as initialDeals } from './data/mockData';

function App() {
  const [deals, setDeals] = useState(initialDeals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('crm-theme') || 'light');
  const [selectedViewDeal, setSelectedViewDeal] = useState(null);
  const { kpis, charts, topDeals } = useDashboardData(deals);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('crm-theme', newTheme);
  };

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
    if (!isChatOpen) {
      setHasNewMessage(false);
    }
  };

  const handleAddDeal = (newDeal) => {
    setDeals(prev => [...prev, newDeal]);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const renderPage = () => {
    switch (activePage) {
      case 'clients':
        return <ClientsPage currentDeals={deals} />;
      case 'deals':
        return <DealsPage currentDeals={deals} onAddDeal={() => setIsModalOpen(true)} />;
      case 'reports':
        return <ReportsPage currentDeals={deals} />;
      case 'activities':
        return <ActivitiesPage />;
      case 'dashboard':
      default:
        return (
          <div className="dashboard-container">
            <div className="page-header">
              <div className="page-title">
                <h1>Clients Activity</h1>
                <p>Overview of your sales pipeline and client health.</p>
              </div>
              <div className="header-buttons">
                <button className="btn btn-outline">
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            <div className="kpi-grid">
              <KPICard
                title="Total Revenue (Won)"
                value={formatCurrency(kpis.totalRevenue)}
                subtitle="All closed won deals"
                trend={kpis.revenueGrowth >= 0 ? 'up' : 'down'}
                trendValue={formatPercentage(kpis.revenueGrowth)}
                icon={Target}
                iconColor="blue"
              />
              <KPICard
                title="Active Deals"
                value={kpis.activeDeals}
                subtitle="Current open opportunities"
                trend={kpis.activeDealsGrowth >= 0 ? 'up' : 'down'}
                trendValue={formatPercentage(kpis.activeDealsGrowth)}
                icon={Users}
                iconColor="orange"
              />
              <KPICard
                title="Win Rate"
                value={`${kpis.winRate.toFixed(1)}%`}
                subtitle="Of all closed deals"
                trend="neutral"
                trendValue="0.0%"
                icon={CheckCircle}
                iconColor="green"
              />
              <KPICard
                title="Avg Deal Size (Won)"
                value={formatCurrency(kpis.avgDealSize)}
                subtitle="Average revenue per won deal"
                trend={kpis.avgDealSizeGrowth >= 0 ? 'up' : 'down'}
                trendValue={formatPercentage(kpis.avgDealSizeGrowth)}
                icon={TrendingUp}
                iconColor="purple"
              />
            </div>

            <div className="charts-grid">
              <SalesEvolutionChart data={charts.salesEvolution} />
              <RevenueByStageChart data={charts.revenueByStage} />
            </div>

            <RecentDealsTable deals={topDeals} onViewDeal={setSelectedViewDeal} />
          </div>
        );
    }
  };

  return (
    <div className={`dashboard-layout ${theme}-theme`}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="main-content">
        <TopNav 
          onToggleChat={toggleChat} 
          hasNewMessage={hasNewMessage}
        />
        {renderPage()}
      </div>
      <AIChatWidget 
        isOpen={isChatOpen} 
        onToggle={setIsChatOpen} 
        onNewMessage={setHasNewMessage}
      />
      <AddDealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddDeal}
      />
      <DealDetailsModal
        isOpen={!!selectedViewDeal}
        onClose={() => setSelectedViewDeal(null)}
        deal={selectedViewDeal}
        clientName={selectedViewDeal?.clientName}
      />
    </div>
  );
}

export default App;
