import React from 'react';
import { MessageSquare } from 'lucide-react';

export const TopNav = ({ onToggleChat, hasNewMessage }) => {
  return (
    <header className="top-nav" style={{ justifyContent: 'flex-end' }}>
      <div className="header-actions">
        <button 
          className="icon-btn" 
          title="Messages"
          onClick={onToggleChat}
          style={{ position: 'relative' }}
        >
          <MessageSquare size={20} />
          {hasNewMessage && (
            <span className="notification-badge" />
          )}
        </button>
      </div>
    </header>
  );
};
