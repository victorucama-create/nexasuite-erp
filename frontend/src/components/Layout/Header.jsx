import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import NotificationDropdown from '../Common/NotificationDropdown';
import QuickSearch from '../Common/QuickSearch';
import './Header.css';

const Header = () => {
  const [time, setTime] = useState('');
  const [notifications] = useState(3);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu') && !event.target.closest('.user-dropdown')) {
        setUserMenuOpen(false);
      }
      if (!event.target.closest('.search-container')) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/dashboard') return 'Dashboard Integrado';
    if (path.startsWith('/accounting')) return 'FinanSys Core - Contabilidade';
    if (path.startsWith('/crm')) return 'CRM System - Gestão de Clientes';
    if (path.startsWith('/settings')) return 'Configurações do Sistema';
    
    return 'NexaSuite ERP';
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const userMenuItems = [
    { label: 'Meu Perfil', icon: 'fas fa-user', action: () => navigate('/settings/profile') },
    { label: 'Configurações', icon: 'fas fa-cog', action: () => navigate('/settings/general') },
    { label: 'Alterar Senha', icon: 'fas fa-key', action: () => navigate('/settings/security') },
    { type: 'divider' },
    { label: 'Documentação', icon: 'fas fa-book', action: () => window.open('https://docs.nexasuite.com', '_blank') },
    { label: 'Suporte', icon: 'fas fa-headset', action: () => navigate('/support') },
    { type: 'divider' },
    { label: 'Sair do Sistema', icon: 'fas fa-sign-out-alt', action: () => useAuthStore.getState().logout() }
  ];

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="page-info">
          <h1 className="page-title">{getPageTitle()}</h1>
          <div className="page-meta">
            <span className="meta-item">
              <i className="fas fa-clock" /> {time}
            </span>
            <span className="meta-item">
              <i className="fas fa-map-marker-alt" /> {user?.company?.country || 'MZ'}
            </span>
            <span className="meta-item">
              <i className="fas fa-money-bill-wave" /> {user?.company?.currency || 'MZN'}
            </span>
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Quick Search */}
        <div className="search-container">
          <button 
            className="search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Pesquisar"
          >
            <i className="fas fa-search" />
          </button>
          {searchOpen && <QuickSearch onClose={() => setSearchOpen(false)} />}
        </div>

        {/* Notifications */}
        <NotificationDropdown count={notifications} />

        {/* Messages */}
        <div className="header-icon messages">
          <i className="fas fa-envelope" />
          <span className="icon-badge">2</span>
        </div>

        {/* Calendar */}
        <button 
          className="header-icon calendar"
          onClick={() => navigate('/calendar')}
          aria-label="Calendário"
        >
          <i className="fas fa-calendar" />
        </button>

        {/* Help */}
        <button 
          className="header-icon help"
          onClick={() => window.open('https://help.nexasuite.com', '_blank')}
          aria-label="Ajuda"
        >
          <i className="fas fa-question-circle" />
        </button>

        {/* User Menu */}
        <div className="user-menu-container">
          <button 
            className="user-menu-toggle"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            aria-label="Menu do usuário"
          >
            <div className="user-avatar">
              {getUserInitials()}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Usuário'}</span>
              <span className="user-role">{user?.role || 'Administrador'}</span>
            </div>
            <i className={`fas fa-chevron-${userMenuOpen ? 'up' : 'down'}`} />
          </button>

          {userMenuOpen && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="dropdown-user">
                  <div className="dropdown-avatar">
                    {getUserInitials()}
                  </div>
                  <div>
                    <strong>{user?.name}</strong>
                    <small>{user?.email}</small>
                  </div>
                </div>
              </div>
              
              <div className="dropdown-menu">
                {userMenuItems.map((item, index) => (
                  item.type === 'divider' ? (
                    <div key={index} className="dropdown-divider" />
                  ) : (
                    <button
                      key={index}
                      className="dropdown-item"
                      onClick={() => {
                        item.action();
                        setUserMenuOpen(false);
                      }}
                    >
                      <i className={item.icon} />
                      <span>{item.label}</span>
                    </button>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
