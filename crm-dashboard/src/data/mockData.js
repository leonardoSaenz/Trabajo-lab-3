export const users = [
  { id: 'u1', full_name: 'Ana García', role: 'sales_rep', avatar_url: 'https://i.pravatar.cc/150?u=u1', quota_amount: 50000, status: 'active' },
  { id: 'u2', full_name: 'Carlos Ruiz', role: 'sales_rep', avatar_url: 'https://i.pravatar.cc/150?u=u2', quota_amount: 60000, status: 'active' },
];

export const stages = [
  { id: 's3', name: 'Negotiation', display_order: 1, win_probability: 60 },
  { id: 's4', name: 'Closed Won', display_order: 2, win_probability: 100 },
  { id: 's5', name: 'Closed Lost', display_order: 3, win_probability: 0 },
];

// Helper to generate dates relative to today
const today = new Date();
const daysAgo = (days) => {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

export const clients = [
  { id: 'c1', company_name: 'TechSolutions SL', industry: 'Software', contact_person: 'Elena Torres', email: 'elena@techsolutions.es', phone: '+34 612 345 678', status: 'active', created_at: daysAgo(180) },
  { id: 'c2', company_name: 'Acme Corp', industry: 'Manufacturing', contact_person: 'John Doe', email: 'john@acmecorp.com', phone: '+1 555 234 5678', status: 'active', created_at: daysAgo(150) },
  { id: 'c3', company_name: 'Google', industry: 'Technology', contact_person: 'Sarah Lee', email: 'sarah@google.com', phone: '+1 650 253 0000', status: 'active', created_at: daysAgo(120) },
  { id: 'c4', company_name: 'Stripe', industry: 'Finance', contact_person: 'Marcus Johnson', email: 'marcus@stripe.com', phone: '+1 888 926 2289', status: 'active', created_at: daysAgo(90) },
  { id: 'c5', company_name: 'Vercel', industry: 'Software', contact_person: 'Guillermo Rauch', email: 'guillermo@vercel.com', phone: '+1 559 000 1234', status: 'inactive', created_at: daysAgo(60) },
  { id: 'c6', company_name: 'Notion', industry: 'Software', contact_person: 'Ivan Zhao', email: 'ivan@notion.so', phone: '+1 415 555 0199', status: 'active', created_at: daysAgo(15) },
  { id: 'c7', company_name: 'Figma', industry: 'Design', contact_person: 'Dylan Field', email: 'dylan@figma.com', phone: '+1 415 555 0177', status: 'active', created_at: daysAgo(8) },
  { id: 'c8', company_name: 'Datadog', industry: 'Technology', contact_person: 'Olivier Pomel', email: 'olivier@datadoghq.com', phone: '+1 866 329 4466', status: 'inactive', created_at: daysAgo(200) },
];

export const lossReasons = ['Precio', 'Competencia', 'Presupuesto', 'Falta de respuesta', 'Funcionalidad faltante'];

export const deals = [
  { id: 'd1', title: 'Licencia Enterprise 2024', customer_id: 'c1', owner_id: 'u1', stage_id: 's4', amount: 25000.00, currency: 'EUR', status: 'won', created_at: daysAgo(45), closed_at: daysAgo(30) },
  { id: 'd2', title: 'Renovación Anual', customer_id: 'c2', owner_id: 'u2', stage_id: 's3', amount: 12000.00, currency: 'EUR', status: 'open', created_at: daysAgo(20), expected_close_date: daysAgo(-10) },
  { id: 'd3', title: 'Cloud Migration', customer_id: 'c3', owner_id: 'u1', stage_id: 's4', amount: 55000.00, currency: 'EUR', status: 'won', created_at: daysAgo(60), closed_at: daysAgo(15) },
  { id: 'd4', title: 'Payment Gateway Integration', customer_id: 'c4', owner_id: 'u2', stage_id: 's3', amount: 8500.00, currency: 'EUR', status: 'open', created_at: daysAgo(5), expected_close_date: daysAgo(-20) },
  { id: 'd5', title: 'Hosting Services', customer_id: 'c5', owner_id: 'u1', stage_id: 's3', amount: 5000.00, currency: 'EUR', status: 'open', created_at: daysAgo(2), expected_close_date: daysAgo(-30) },
  { id: 'd6', title: 'Consultoría Estratégica', customer_id: 'c1', owner_id: 'u2', stage_id: 's5', amount: 15000.00, currency: 'EUR', status: 'lost', loss_reason: 'Competencia', created_at: daysAgo(50), closed_at: daysAgo(40) },
  { id: 'd7', title: 'Soporte Premium', customer_id: 'c2', owner_id: 'u1', stage_id: 's4', amount: 9000.00, currency: 'EUR', status: 'won', created_at: daysAgo(35), closed_at: daysAgo(10) },
  { id: 'd8', title: 'Auditoría de Seguridad', customer_id: 'c3', owner_id: 'u2', stage_id: 's3', amount: 18000.00, currency: 'EUR', status: 'open', created_at: daysAgo(15), expected_close_date: daysAgo(-5) },
  { id: 'd9', title: 'Desarrollo a Medida', customer_id: 'c4', owner_id: 'u1', stage_id: 's3', amount: 32000.00, currency: 'EUR', status: 'open', created_at: daysAgo(10), expected_close_date: daysAgo(-40) },
  { id: 'd10', title: 'Capacitación de Equipo', customer_id: 'c5', owner_id: 'u2', stage_id: 's4', amount: 7500.00, currency: 'EUR', status: 'won', created_at: daysAgo(80), closed_at: daysAgo(50) },
  { id: 'd11', title: 'Licencias Adicionales', customer_id: 'c1', owner_id: 'u1', stage_id: 's3', amount: 4500.00, currency: 'EUR', status: 'open', created_at: daysAgo(8), expected_close_date: daysAgo(-15) },
  { id: 'd12', title: 'Mantenimiento Preventivo', customer_id: 'c2', owner_id: 'u2', stage_id: 's4', amount: 11000.00, currency: 'EUR', status: 'won', created_at: daysAgo(90), closed_at: daysAgo(60) },
  { id: 'd13', title: 'Infraestructura de Red', customer_id: 'c3', owner_id: 'u1', stage_id: 's5', amount: 45000.00, currency: 'EUR', status: 'lost', loss_reason: 'Precio', created_at: daysAgo(70), closed_at: daysAgo(45) },
  { id: 'd14', title: 'Actualización de Sistema', customer_id: 'c4', owner_id: 'u2', stage_id: 's4', amount: 21000.00, currency: 'EUR', status: 'won', created_at: daysAgo(40), closed_at: daysAgo(5) },
  { id: 'd15', title: 'Optimización SEO', customer_id: 'c5', owner_id: 'u1', stage_id: 's3', amount: 3000.00, currency: 'EUR', status: 'open', created_at: daysAgo(1), expected_close_date: daysAgo(-25) },
  { id: 'd16', title: 'Campaña de Marketing', customer_id: 'c1', owner_id: 'u2', stage_id: 's3', amount: 14000.00, currency: 'EUR', status: 'open', created_at: daysAgo(12), expected_close_date: daysAgo(-60) },
  { id: 'd17', title: 'Diseño UX/UI', customer_id: 'c2', owner_id: 'u1', stage_id: 's4', amount: 28000.00, currency: 'EUR', status: 'won', created_at: daysAgo(100), closed_at: daysAgo(80) },
  { id: 'd18', title: 'Licencia Starter', customer_id: 'c3', owner_id: 'u2', stage_id: 's3', amount: 2500.00, currency: 'EUR', status: 'open', created_at: daysAgo(18), expected_close_date: daysAgo(-12) },
  { id: 'd19', title: 'Migración a AWS', customer_id: 'c4', owner_id: 'u1', stage_id: 's4', amount: 60000.00, currency: 'EUR', status: 'won', created_at: daysAgo(120), closed_at: daysAgo(90) },
  { id: 'd20', title: 'Análisis de Datos', customer_id: 'c5', owner_id: 'u2', stage_id: 's3', amount: 16000.00, currency: 'EUR', status: 'open', created_at: daysAgo(4), expected_close_date: daysAgo(-45) },
  { id: 'd21', title: 'Soporte 24/7', customer_id: 'c1', owner_id: 'u1', stage_id: 's4', amount: 35000.00, currency: 'EUR', status: 'won', created_at: daysAgo(25), closed_at: daysAgo(2) },
  { id: 'd22', title: 'Expansión de Servidores', customer_id: 'c2', owner_id: 'u2', stage_id: 's3', amount: 42000.00, currency: 'EUR', status: 'open', created_at: daysAgo(7), expected_close_date: daysAgo(-35) },
  { id: 'd23', title: 'Desarrollo de App Móvil', customer_id: 'c3', owner_id: 'u1', stage_id: 's5', amount: 80000.00, currency: 'EUR', status: 'lost', loss_reason: 'Presupuesto', created_at: daysAgo(80), closed_at: daysAgo(20) },
  { id: 'd24', title: 'Servicios de Ciberseguridad', customer_id: 'c4', owner_id: 'u2', stage_id: 's4', amount: 52000.00, currency: 'EUR', status: 'won', created_at: daysAgo(65), closed_at: daysAgo(35) },
  { id: 'd25', title: 'Consultoría Big Data', customer_id: 'c1', owner_id: 'u1', stage_id: 's5', amount: 48000.00, currency: 'EUR', status: 'lost', loss_reason: 'Falta de respuesta', created_at: daysAgo(25), closed_at: daysAgo(5) },
];

export const activityTypes = [
  { id: 'call', name: 'Llamada', color: '#3b82f6' },
  { id: 'email', name: 'Correo', color: '#10b981' },
  { id: 'meeting', name: 'Reunión', color: '#a855f7' },
  { id: 'demo', name: 'Demo', color: '#f97316' },
  { id: 'proposal', name: 'Propuesta', color: '#ec4899' },
  { id: 'follow_up', name: 'Seguimiento', color: '#06b6d4' },
  { id: 'note', name: 'Nota Interna', color: '#64748b' },
];

export const activities = [
  { id: 'a1', title: 'Llamada inicial de prospección', type: 'call', customer_id: 'c1', deal_id: 'd1', owner_id: 'u1', date: daysAgo(45), status: 'completed', priority: 'medium', description: 'Presentación de las soluciones de IA para optimización de procesos.' },
  { id: 'a2', title: 'Demo de plataforma Core-AI', type: 'demo', customer_id: 'c1', deal_id: 'd1', owner_id: 'u1', date: daysAgo(35), status: 'completed', priority: 'high', description: 'Demostración técnica enfocada en integración enterprise.' },
  { id: 'a3', title: 'Envío de propuesta comercial', type: 'proposal', customer_id: 'c2', deal_id: 'd2', owner_id: 'u2', date: daysAgo(20), status: 'completed', priority: 'high', description: 'Propuesta detallada para renovación anual con soporte 24/7.' },
  { id: 'a4', title: 'Reunión de seguimiento', type: 'meeting', customer_id: 'c3', deal_id: 'd3', owner_id: 'u1', date: daysAgo(15), status: 'completed', priority: 'medium', description: 'Discusión sobre los plazos de migración a la nube.' },
  { id: 'a5', title: 'Correo: Dudas sobre facturación', type: 'email', customer_id: 'c4', deal_id: 'd4', owner_id: 'u2', date: daysAgo(5), status: 'completed', priority: 'low', description: 'Aclaración de los cargos por integración de pasarela.' },
  { id: 'a6', title: 'Nota: Interés en expansión', type: 'note', customer_id: 'c6', owner_id: 'u1', date: daysAgo(2), status: 'completed', priority: 'medium', description: 'El cliente mencionó que planean expandirse a LATAM el próximo trimestre.' },
  { id: 'a7', title: 'Reunión estratégica Q2', type: 'meeting', customer_id: 'c1', deal_id: 'd1', owner_id: 'u2', date: daysAgo(1), status: 'completed', priority: 'high', description: 'Definición de objetivos para el segundo trimestre.' },
  { id: 'a8', title: 'Seguimiento de auditoría', type: 'follow_up', customer_id: 'c3', deal_id: 'd8', owner_id: 'u2', date: daysAgo(-1), status: 'pending', priority: 'medium', description: 'Pendiente confirmar fecha de la auditoría de seguridad.' },
  { id: 'a9', title: 'Presentación de propuesta SEO', type: 'proposal', customer_id: 'c5', deal_id: 'd15', owner_id: 'u1', date: daysAgo(-2), status: 'pending', priority: 'high', description: 'Preparar presentación para el equipo de marketing.' },
  { id: 'a10', title: 'Llamada: Soporte técnico', type: 'call', customer_id: 'c2', owner_id: 'u2', date: daysAgo(10), status: 'completed', priority: 'low', description: 'Resolución de dudas sobre el panel de administración.' },
];
