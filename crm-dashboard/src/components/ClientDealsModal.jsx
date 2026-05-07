import React, { useMemo, useRef, useEffect } from 'react';
import { X, Building2, Briefcase, Calendar, User, TrendingUp, DollarSign } from 'lucide-react';
import { stages, users } from '../data/mockData';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const ClientDealsModal = ({ isOpen, onClose, client, deals }) => {
  const modalRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleBackdrop = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  // Enrich deals with stage, owner info
  const enrichedDeals = useMemo(() => {
    if (!deals) return [];
    return deals.map(deal => ({
      ...deal,
      stageName: stages.find(s => s.id === deal.stage_id)?.name || 'Unknown',
      ownerName: users.find(u => u.id === deal.owner_id)?.full_name || 'Unknown',
      ownerAvatar: users.find(u => u.id === deal.owner_id)?.avatar_url || '',
    }));
  }, [deals]);

  // Summary
  const summary = useMemo(() => {
    if (!deals) return { total: 0, open: 0, won: 0, lost: 0, totalValue: 0, wonValue: 0 };
    return {
      total: deals.length,
      open: deals.filter(d => d.status === 'open').length,
      won: deals.filter(d => d.status === 'won').length,
      lost: deals.filter(d => d.status === 'lost').length,
      totalValue: deals.reduce((s, d) => s + d.amount, 0),
      wonValue: deals.filter(d => d.status === 'won').reduce((s, d) => s + d.amount, 0),
    };
  }, [deals]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return format(parseISO(dateStr), 'dd MMM yyyy', { locale: es });
    } catch {
      return '—';
    }
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

  if (!isOpen || !client) return null;

  return (
    <div
      className="modal-overlay modal-overlay--open"
      ref={modalRef}
      onClick={handleBackdrop}
    >
      <div className="modal-container client-deals-modal">
        {/* Header */}
        <div className="cdm-header">
          <div className="cdm-header__info">
            <div className="cdm-header__avatar">
              {client.company_name.charAt(0)}
            </div>
            <div>
              <h2 className="cdm-header__title">{client.company_name}</h2>
              <p className="cdm-header__subtitle">
                {client.industry} · {client.contact_person}
              </p>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Summary Strip */}
        <div className="cdm-summary">
          <div className="cdm-summary__item">
            <Briefcase size={14} />
            <span className="cdm-summary__value">{summary.total}</span>
            <span className="cdm-summary__label">Deals</span>
          </div>
          <div className="cdm-summary__divider" />
          <div className="cdm-summary__item">
            <DollarSign size={14} />
            <span className="cdm-summary__value">{formatCurrency(summary.totalValue)}</span>
            <span className="cdm-summary__label">Total</span>
          </div>
          <div className="cdm-summary__divider" />
          <div className="cdm-summary__item cdm-summary__item--green">
            <TrendingUp size={14} />
            <span className="cdm-summary__value">{formatCurrency(summary.wonValue)}</span>
            <span className="cdm-summary__label">Won</span>
          </div>
          <div className="cdm-summary__divider" />
          <div className="cdm-summary__item">
            <span className="cdm-summary__badges">
              <span className="client-card__deal-badge client-card__deal-badge--open">{summary.open} active</span>
              <span className="client-card__deal-badge client-card__deal-badge--won">{summary.won} won</span>
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="cdm-body">
          <div className="table-container">
            <table className="deals-table">
              <thead>
                <tr>
                  <th>Deal</th>
                  <th>Valor</th>
                  <th>Etapa</th>
                  <th>Status</th>
                  <th>Responsable</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {enrichedDeals.map(deal => (
                  <tr key={deal.id} className="deals-table__row">
                    <td>
                      <span className="deal-name-cell__title">{deal.title}</span>
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
                    <td>
                      <div className="cdm-date-cell">
                        <Calendar size={12} />
                        <span>
                          {deal.closed_at
                            ? formatDate(deal.closed_at)
                            : formatDate(deal.created_at)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {enrichedDeals.length === 0 && (
              <div className="cdm-empty">
                <Briefcase size={36} />
                <p>Este cliente no tiene deals registrados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


