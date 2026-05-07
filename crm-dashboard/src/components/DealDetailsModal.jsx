import React, { useRef, useEffect } from 'react';
import { X, Briefcase } from 'lucide-react';
import { stages, users } from '../data/mockData';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const DealDetailsModal = ({ isOpen, onClose, deal, clientName }) => {
  const modalRef = useRef(null);

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

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return format(parseISO(dateStr), 'dd MMM yyyy', { locale: es });
  };

  if (!isOpen || !deal) return null;

  return (
    <div
      className="modal-overlay modal-overlay--open"
      ref={modalRef}
      onClick={handleBackdrop}
    >
      <div className="modal-container client-deals-modal" style={{ maxWidth: '600px' }}>
        <div className="cdm-header">
          <div className="cdm-header__info">
            <div className="cdm-header__avatar" style={{ borderRadius: '50%' }}>
              <Briefcase size={24} />
            </div>
            <div>
              <h2 className="cdm-header__title">{deal.title}</h2>
              <p className="cdm-header__subtitle">
                {clientName} · {deal.status === 'won' ? 'Ganado' : deal.status === 'lost' ? 'Perdido' : 'En proceso'}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="cdm-body" style={{ padding: '24px' }}>
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <span className="kpi-subtitle">Valor del Deal</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>
                {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(deal.amount)}
              </div>
            </div>
            <div className="card" style={{ padding: '16px' }}>
              <span className="kpi-subtitle">Etapa Actual</span>
              <div style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '4px', color: '#f97316' }}>
                {stages.find(s => s.id === deal.stage_id)?.name || 'N/A'}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Responsable</label>
              <p style={{ marginTop: '4px', fontWeight: 500 }}>{users.find(u => u.id === deal.owner_id)?.full_name || 'N/A'}</p>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Fecha de Cierre</label>
              <p style={{ marginTop: '4px', fontWeight: 500 }}>{formatDate(deal.expected_close_date || deal.closed_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
