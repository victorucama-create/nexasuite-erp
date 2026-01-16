import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './MobileMenu.css';

const MobileMenu = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { path: '/accounting', icon: 'fas fa-chart-line', label: 'Contabilidade' },
    { path: '/crm', icon: 'fas fa-users', label: 'CRM' },
    { path: '/crm/pos', icon: 'fas fa-cash-register', label: 'POS' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Config' }
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="mobile-menu">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={`mobile-menu-item ${isActive(item.path) ? 'active' : ''}`}
        >
          <i className={item.icon} />
          <span>{item.label}</span>
        </NavLink>
      ))}
      
      {/* Quick Action Button */}
      <button 
        className="mobile-menu-action"
        onClick={() => window.location.href = '/crm/sales/new'}
      >
        <i className="fas fa-plus" />
      </button>
    </div>
  );
};

export default MobileMenu;
