import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../../store/authStore';
import './CRM.css';

const CRM = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: 'fas fa-tachometer-alt', path: '/crm' },
    { id: 'customers', label: 'Clientes', icon: 'fas fa-address-book', path: '/crm/customers' },
    { id: 'sales', label: 'Vendas', icon: 'fas fa-shopping-cart', path: '/crm/sales' },
    { id: 'loyalty', label: 'Fidelização', icon: 'fas fa-star', path: '/crm/loyalty' },
    { id: 'pos', label: 'POS', icon: 'fas fa-cash-register', path: '/crm/pos' },
    { id: 'inventory', label: 'Inventário', icon: 'fas fa-warehouse', path: '/crm/inventory' },
    { id: 'reports', label: 'Relatórios', icon: 'fas fa-chart-line', path: '/crm/reports' },
    { id: 'promotions', label: 'Promoções', icon: 'fas fa-tags', path: '/crm/promotions' },
  ];

  const quickActions = [
    { label: 'Nova Venda', icon: 'fas fa-cash-register', action: () => navigate('/crm/sales/new'), color: 'success' },
    { label: 'Novo Cliente', icon: 'fas fa-user-plus', action: () => navigate('/crm/customers/new'), color: 'primary' },
    { label: 'Abrir PDV', icon: 'fas fa-shopping-cart', action: () => navigate('/crm/pos'), color: 'warning' },
    { label: 'Transferir Stock', icon: 'fas fa-exchange-alt', action: () => navigate('/crm/inventory/transfer'), color: 'info' },
    { label: 'Criar Promoção', icon: 'fas fa-tag', action: () => navigate('/crm/promotions/new'), color: 'danger' },
  ];

  const recentActivities = [
    { id: 1, type: 'sale', customer: 'João Silva', amount: 'R$ 1.250,00', time: '2 horas atrás' },
    { id: 2, type: 'customer', customer: 'Maria Santos', action: 'Cadastrada', time: '4 horas atrás' },
    { id: 3, type: 'payment', customer: 'Empresa XYZ', amount: 'R$ 5.800,00', time: '1 dia atrás' },
    { id: 4, type: 'support', customer: 'Carlos Oliveira', action: 'Ticket aberto', time: '2 dias atrás' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/crm/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  return (
    <>
      <Helmet>
        <title>CRM - NexaSuite ERP</title>
      </Helmet>

      <div className="crm-container">
        {/* Header */}
        <div className="crm-header">
          <div className="header-left">
            <h1>
              <i className="fas fa-users" /> CRM System
            </h1>
            <p className="subtitle">Gestão completa de relacionamento com clientes</p>
          </div>
          
          <div className="header-right">
            <form onSubmit={handleSearch} className="crm-search">
              <div className="search-box">
                <i className="fas fa-search" />
                <input
                  type="text"
                  placeholder="Buscar cliente, produto, venda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  <i className="fas fa-arrow-right" />
                </button>
              </div>
            </form>
            
            <div className="stats-summary">
              <div className="stat-item">
                <span className="stat-label">Clientes</span>
                <span className="stat-value">1,247</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Vendas Hoje</span>
                <span className="stat-value">R$ 2.850</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Conversão</span>
                <span className="stat-value success">24.5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`quick-action-card ${action.color}`}
              onClick={action.action}
            >
              <i className={action.icon} />
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="crm-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id || location.pathname.startsWith(tab.path) ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              <i className={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content & Sidebar */}
        <div className="crm-content-wrapper">
          <div className="crm-main-content">
            <Outlet />
          </div>
          
          <div className="crm-sidebar">
            {/* Recent Activities */}
            <div className="sidebar-section">
              <h4>
                <i className="fas fa-history" /> Atividades Recentes
              </h4>
              <div className="activities-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      <i className={`fas fa-${
                        activity.type === 'sale' ? 'shopping-cart' :
                        activity.type === 'customer' ? 'user-plus' :
                        activity.type === 'payment' ? 'money-bill-wave' : 'headset'
                      }`} />
                    </div>
                    <div className="activity-content">
                      <strong>{activity.customer}</strong>
                      <p>
                        {activity.type === 'sale' ? `Venda: ${activity.amount}` :
                         activity.type === 'customer' ? `Cliente ${activity.action}` :
                         activity.type === 'payment' ? `Pagamento: ${activity.amount}` :
                         `Suporte: ${activity.action}`}
                      </p>
                      <small>{activity.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Customers */}
            <div className="sidebar-section">
              <h4>
                <i className="fas fa-crown" /> Top Clientes
              </h4>
              <div className="top-customers">
                {[1, 2, 3].map(index => (
                  <div key={index} className="customer-item">
                    <div className="customer-rank">#{index}</div>
                    <div className="customer-info">
                      <strong>Cliente VIP {index}</strong>
                      <small>R$ {(index * 12500).toLocaleString()}</small>
                    </div>
                    <span className="customer-points">{(index * 3250).toLocaleString()} pts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock Alerts */}
            <div className="sidebar-section">
              <h4>
                <i className="fas fa-exclamation-triangle" /> Alertas de Stock
              </h4>
              <div className="stock-alerts">
                <div className="alert-item danger">
                  <i className="fas fa-box" />
                  <div>
                    <strong>Produto A</strong>
                    <p>Stock baixo: 15 unidades</p>
                  </div>
                </div>
                <div className="alert-item warning">
                  <i className="fas fa-box" />
                  <div>
                    <strong>Produto B</strong>
                    <p>Stock crítico: 5 unidades</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CRM;
