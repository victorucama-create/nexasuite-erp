import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './Sidebar.css';

const Sidebar = ({ onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    accounting: false,
    crm: false,
    system: false
  });
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const navItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'fas fa-home',
      path: '/dashboard',
      type: 'main'
    },
    {
      id: 'accounting',
      title: 'Contabilidade',
      icon: 'fas fa-chart-line',
      type: 'section',
      children: [
        { title: 'Visão Geral', path: '/accounting', icon: 'fas fa-tachometer-alt' },
        { title: 'Plano de Contas', path: '/accounting/accounts', icon: 'fas fa-list-ol' },
        { title: 'Transações', path: '/accounting/transactions', icon: 'fas fa-exchange-alt' },
        { title: 'Contas a Pagar', path: '/accounting/payable', icon: 'fas fa-money-check-alt' },
        { title: 'Contas a Receber', path: '/accounting/receivable', icon: 'fas fa-hand-holding-usd' },
        { title: 'Balanço Patrimonial', path: '/accounting/reports/balance-sheet', icon: 'fas fa-balance-scale' },
        { title: 'DRE', path: '/accounting/reports/income-statement', icon: 'fas fa-file-invoice-dollar' },
        { title: 'DFC', path: '/accounting/reports/cash-flow', icon: 'fas fa-money-bill-wave' },
        { title: 'Balancete', path: '/accounting/reports/trial-balance', icon: 'fas fa-file-alt' },
        { title: 'Índices Financeiros', path: '/accounting/reports/financial-ratios', icon: 'fas fa-chart-pie' },
        { title: 'Análise de Custos', path: '/accounting/reports/cost-analysis', icon: 'fas fa-calculator' },
        { title: 'Importar Dados', path: '/accounting/import', icon: 'fas fa-file-import' }
      ]
    },
    {
      id: 'crm',
      title: 'CRM & Vendas',
      icon: 'fas fa-users',
      type: 'section',
      children: [
        { title: 'Visão Geral', path: '/crm', icon: 'fas fa-tachometer-alt' },
        { title: 'Clientes', path: '/crm/customers', icon: 'fas fa-address-book' },
        { title: 'Vendas', path: '/crm/sales', icon: 'fas fa-shopping-cart' },
        { title: 'Fidelização', path: '/crm/loyalty', icon: 'fas fa-star' },
        { title: 'POS - Ponto de Venda', path: '/crm/pos', icon: 'fas fa-cash-register' },
        { title: 'Inventário', path: '/crm/inventory', icon: 'fas fa-warehouse' },
        { title: 'Relatórios de Vendas', path: '/crm/reports/sales', icon: 'fas fa-chart-line' },
        { title: 'Promoções', path: '/crm/promotions', icon: 'fas fa-tags' }
      ]
    },
    {
      id: 'system',
      title: 'Sistema',
      icon: 'fas fa-cog',
      type: 'section',
      children: [
        { title: 'Configurações', path: '/settings/general', icon: 'fas fa-sliders-h' },
        { title: 'Usuários', path: '/settings/users', icon: 'fas fa-user-shield' },
        { title: 'Assinaturas', path: '/settings/subscriptions', icon: 'fas fa-credit-card' },
        { title: 'Backup', path: '/settings/backup', icon: 'fas fa-database' },
        { title: 'Logs', path: '/settings/audit', icon: 'fas fa-clipboard-list' }
      ]
    }
  ];

  const comingSoonModules = [
    { title: 'Recursos Humanos', icon: 'fas fa-user-tie', status: 'Em Breve' },
    { title: 'MRP - Produção', icon: 'fas fa-industry', status: 'Em Breve' },
    { title: 'Marketplace B2B', icon: 'fas fa-exchange-alt', status: 'Em Breve' }
  ];

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-container">
          <i className="fas fa-chart-network logo-icon" />
          <div className="logo-text">
            <h2>NexaSuite</h2>
            <small>ERP All-in-One</small>
          </div>
        </div>
        <div className="company-info">
          <div className="company-avatar">
            {user?.company?.name?.charAt(0) || 'N'}
          </div>
          <div className="company-details">
            <strong>{user?.company?.name || 'Minha Empresa'}</strong>
            <small>{user?.company?.plan || 'Plano Profissional'}</small>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div key={item.id} className="nav-section">
            {item.type === 'main' ? (
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `nav-item ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <i className={item.icon} />
                <span>{item.title}</span>
              </NavLink>
            ) : (
              <>
                <div 
                  className="nav-section-header"
                  onClick={() => toggleSection(item.id)}
                >
                  <div className="section-title">
                    <i className={item.icon} />
                    <span>{item.title}</span>
                  </div>
                  <i className={`fas fa-chevron-${expandedSections[item.id] ? 'up' : 'down'} section-arrow`} />
                </div>
                
                {expandedSections[item.id] && (
                  <div className="nav-subitems">
                    {item.children.map((child, index) => (
                      <NavLink
                        key={index}
                        to={child.path}
                        className={({ isActive }) => 
                          `nav-subitem ${isActive ? 'active' : ''}`
                        }
                        onClick={onClose}
                      >
                        <i className={child.icon} />
                        <span>{child.title}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>

      {/* Coming Soon Modules */}
      <div className="coming-soon-section">
        <div className="section-title">
          <i className="fas fa-rocket" />
          <span>Módulos Futuros</span>
        </div>
        {comingSoonModules.map((module, index) => (
          <div key={index} className="coming-soon-item">
            <i className={module.icon} />
            <span>{module.title}</span>
            <span className="badge badge-warning">{module.status}</span>
          </div>
        ))}
      </div>

      {/* User Profile & Logout */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="user-info">
            <strong>{user?.name || 'Usuário'}</strong>
            <small>{user?.role || 'Administrador'}</small>
          </div>
        </div>
        
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" />
          <span>Sair</span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className="quick-action-btn" 
          onClick={() => navigate('/crm/sales/new')}
        >
          <i className="fas fa-plus" />
          <span>Nova Venda</span>
        </button>
        <button 
          className="quick-action-btn" 
          onClick={() => navigate('/accounting/transactions/new')}
        >
          <i className="fas fa-plus" />
          <span>Nova Transação</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
