import React, { useState, useEffect, useRef } from 'react';
import { X, Briefcase, DollarSign, Users, Building2, FileText, CalendarDays, Flag, Sparkles } from 'lucide-react';
import { clients, users, stages } from '../data/mockData';

const initialForm = {
  title: '',
  customer_id: '',
  owner_id: '',
  stage_id: 's3',
  amount: '',
  currency: 'EUR',
  expected_close_date: '',
};

export const AddDealModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Only show open stages for new deals (not Closed Won/Lost)
  const openStages = stages.filter(s => s.id !== 's4' && s.id !== 's5');

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      setErrors({});
      setShowSuccess(false);
      // Focus first input after animation
      setTimeout(() => firstInputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'El título es obligatorio';
    if (!form.customer_id) newErrors.customer_id = 'Selecciona un cliente';
    if (!form.owner_id) newErrors.owner_id = 'Selecciona un responsable';
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'El monto debe ser mayor a 0';
    if (!form.expected_close_date) newErrors.expected_close_date = 'La fecha estimada es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate a small delay for UX
    await new Promise(r => setTimeout(r, 600));

    const newDeal = {
      id: `d${Date.now()}`,
      title: form.title.trim(),
      customer_id: form.customer_id,
      owner_id: form.owner_id,
      stage_id: form.stage_id,
      amount: parseFloat(form.amount),
      currency: form.currency,
      status: 'open',
      created_at: new Date().toISOString(),
      expected_close_date: new Date(form.expected_close_date).toISOString(),
    };

    onSubmit(newDeal);
    setIsSubmitting(false);
    setShowSuccess(true);

    // Auto close after success
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? 'modal-overlay--open' : ''}`}
      ref={modalRef}
      onClick={handleBackdrop}
    >
      <div className={`modal-container ${showSuccess ? 'modal-container--success' : ''}`}>
        {/* Success state */}
        {showSuccess ? (
          <div className="modal-success">
            <div className="modal-success__icon">
              <Sparkles size={32} />
            </div>
            <h3>¡Deal creado exitosamente!</h3>
            <p>El nuevo deal ha sido añadido al pipeline.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="modal-header">
              <div className="modal-header__info">
                <div className="modal-header__icon">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h2 className="modal-header__title">Nuevo Deal</h2>
                  <p className="modal-header__subtitle">Completa la información del nuevo deal</p>
                </div>
              </div>
              <button
                id="modal-close-btn"
                className="modal-close-btn"
                onClick={onClose}
                aria-label="Cerrar formulario"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Title */}
                <div className={`form-group ${errors.title ? 'form-group--error' : ''}`}>
                  <label htmlFor="deal-title" className="form-label">
                    <FileText size={14} />
                    Título del Deal
                  </label>
                  <input
                    ref={firstInputRef}
                    id="deal-title"
                    name="title"
                    type="text"
                    className="form-input"
                    placeholder="Ej. Licencia Enterprise 2025"
                    value={form.title}
                    onChange={handleChange}
                  />
                  {errors.title && <span className="form-error">{errors.title}</span>}
                </div>

                {/* Client + Owner Row */}
                <div className="form-row">
                  <div className={`form-group ${errors.customer_id ? 'form-group--error' : ''}`}>
                    <label htmlFor="deal-client" className="form-label">
                      <Building2 size={14} />
                      Cliente
                    </label>
                    <select
                      id="deal-client"
                      name="customer_id"
                      className="form-select"
                      value={form.customer_id}
                      onChange={handleChange}
                    >
                      <option value="">Seleccionar cliente...</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.company_name}</option>
                      ))}
                    </select>
                    {errors.customer_id && <span className="form-error">{errors.customer_id}</span>}
                  </div>

                  <div className={`form-group ${errors.owner_id ? 'form-group--error' : ''}`}>
                    <label htmlFor="deal-owner" className="form-label">
                      <Users size={14} />
                      Responsable
                    </label>
                    <select
                      id="deal-owner"
                      name="owner_id"
                      className="form-select"
                      value={form.owner_id}
                      onChange={handleChange}
                    >
                      <option value="">Seleccionar responsable...</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.full_name}</option>
                      ))}
                    </select>
                    {errors.owner_id && <span className="form-error">{errors.owner_id}</span>}
                  </div>
                </div>

                {/* Amount + Currency Row */}
                <div className="form-row">
                  <div className={`form-group form-group--grow ${errors.amount ? 'form-group--error' : ''}`}>
                    <label htmlFor="deal-amount" className="form-label">
                      <DollarSign size={14} />
                      Monto
                    </label>
                    <div className="form-input-group">
                      <span className="form-input-prefix">€</span>
                      <input
                        id="deal-amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-input form-input--with-prefix"
                        placeholder="25,000"
                        value={form.amount}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.amount && <span className="form-error">{errors.amount}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="deal-stage" className="form-label">
                      <Flag size={14} />
                      Etapa
                    </label>
                    <select
                      id="deal-stage"
                      name="stage_id"
                      className="form-select"
                      value={form.stage_id}
                      onChange={handleChange}
                    >
                      {openStages.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Expected Close Date */}
                <div className={`form-group ${errors.expected_close_date ? 'form-group--error' : ''}`}>
                  <label htmlFor="deal-date" className="form-label">
                    <CalendarDays size={14} />
                    Fecha estimada de cierre
                  </label>
                  <input
                    id="deal-date"
                    name="expected_close_date"
                    type="date"
                    className="form-input"
                    value={form.expected_close_date}
                    onChange={handleChange}
                  />
                  {errors.expected_close_date && <span className="form-error">{errors.expected_close_date}</span>}
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline modal-btn"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary modal-btn"
                  disabled={isSubmitting}
                  id="deal-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <span className="btn-spinner" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Crear Deal
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
