import React from 'react';
import { LayoutDashboard, Users, Briefcase, Activity, FileText, Layers } from 'lucide-react';

export const Sidebar = ({ activePage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'deals', label: 'Deals', icon: Briefcase },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo-icon">
          <Layers size={20} />
        </div>
        <span className="logo-text">ClientCRM</span>
      </div>
      <nav className="nav-menu">
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};
