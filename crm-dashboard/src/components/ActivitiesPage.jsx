import React, { useMemo, useState } from 'react';
import { Search, Filter, Phone, Mail, Users, Monitor, FileText, Clock, StickyNote, Calendar, Briefcase, User, Activity } from 'lucide-react';
import { activities, activityTypes, clients, deals, users } from '../data/mockData';
import { KPICard } from './KPICard';
import { format, parseISO, isAfter, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

export const ActivitiesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           act.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || act.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || act.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || act.priority === priorityFilter;
      
      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    }).map(act => ({
      ...act,
      clientName: clients.find(c => c.id === act.customer_id)?.company_name || 'N/A',
      dealName: deals.find(d => d.id === act.deal_id)?.title || '',
      ownerName: users.find(u => u.id === act.owner_id)?.full_name || 'N/A',
      typeName: activityTypes.find(t => t.id === act.type)?.name || act.type,
      typeColor: activityTypes.find(t => t.id === act.type)?.color || '#64748b'
    }));
  }, [searchQuery, typeFilter, statusFilter, priorityFilter]);

  const kpis = useMemo(() => {
    const total = activities.length;
    const completed = activities.filter(a => a.status === 'completed').length;
    const pending = activities.filter(a => a.status === 'pending').length;
    const highPriority = activities.filter(a => a.priority === 'high').length;
    
    return { total, completed, pending, highPriority };
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'call': return <Phone size={18} />;
      case 'email': return <Mail size={18} />;
      case 'meeting': return <Users size={18} />;
      case 'demo': return <Monitor size={18} />;
      case 'proposal': return <FileText size={18} />;
      case 'follow_up': return <Clock size={18} />;
      case 'note': return <StickyNote size={18} />;
      default: return <Activity size={18} />;
    }
  };

  const formatDate = (dateStr) => {
    return format(parseISO(dateStr), "dd 'de' MMM, HH:mm", { locale: es });
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title">
          <h1>Activities</h1>
          <p>Historial y seguimiento de interacciones con clientes y negocios.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <KPICard 
          title="Total Actividades"
          value={kpis.total}
          subtitle="Registradas históricamente"
          trend="neutral"
          trendValue="—"
          icon={Activity}
          iconColor="blue"
        />
        <KPICard 
          title="Completadas"
          value={kpis.completed}
          subtitle="Acciones realizadas"
          trend="up"
          trendValue={`${((kpis.completed / kpis.total) * 100).toFixed(0)}%`}
          icon={Activity}
          iconColor="green"
        />
        <KPICard 
          title="Pendientes"
          value={kpis.pending}
          subtitle="Próximas acciones"
          trend={kpis.pending > 0 ? 'down' : 'neutral'}
          trendValue={kpis.pending.toString()}
          icon={Clock}
          iconColor="orange"
        />
        <KPICard 
          title="Prioridad Alta"
          value={kpis.highPriority}
          subtitle="Requieren atención inmediata"
          trend="neutral"
          trendValue="Crítico"
          icon={Activity}
          iconColor="purple"
        />
      </div>

      <div className="activities-toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por título o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="activities-filter-group">
          <Filter size={14} className="text-muted" />
          <span className="activities-filter-label">Tipo:</span>
          <select 
            className="activities-filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            {activityTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div className="activities-filter-group">
          <span className="activities-filter-label">Estado:</span>
          <select 
            className="activities-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Cualquiera</option>
            <option value="completed">Completado</option>
            <option value="pending">Pendiente</option>
          </select>
        </div>

        <div className="activities-filter-group">
          <span className="activities-filter-label">Prioridad:</span>
          <select 
            className="activities-filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map(act => (
            <div key={act.id} className="activity-card">
              <div 
                className="activity-card__icon" 
                style={{ backgroundColor: `${act.typeColor}15`, color: act.typeColor }}
              >
                {getIcon(act.type)}
              </div>
              <div className="activity-card__content">
                <div className="activity-card__top">
                  <h3 className="activity-card__title">{act.title}</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className={`priority-badge priority-${act.priority}`}>
                      {act.priority}
                    </span>
                    <span className={`activity-badge status-${act.status}`}>
                      {act.status === 'completed' ? 'Realizado' : 'Pendiente'}
                    </span>
                  </div>
                </div>
                <p className="activity-card__desc">{act.description}</p>
                <div className="activity-card__meta">
                  <div className="activity-card__meta-item">
                    <Calendar size={12} />
                    <span>{formatDate(act.date)}</span>
                  </div>
                  <div className="activity-card__meta-item">
                    <Building2 size={12} />
                    <span>{act.clientName}</span>
                  </div>
                  {act.dealName && (
                    <div className="activity-card__meta-item">
                      <Briefcase size={12} />
                      <span>{act.dealName}</span>
                    </div>
                  )}
                  <div className="activity-card__meta-item">
                    <User size={12} />
                    <span>{act.ownerName}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="cdm-empty" style={{ padding: '80px' }}>
            <Activity size={48} />
            <p>No se encontraron actividades que coincidan con los filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Building2 = ({ size, className }) => <Users size={size} className={className} />;
