import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../../store/authStore';
import './Accounting.css';

const Accounting = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuthStore();

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: 'fas fa-tachometer-alt', path: '/accounting' },
    { id: 'accounts', label: 'Plano de Contas', icon: 'fas fa-list-ol', path: '/accounting/accounts' },
    { id: 'transactions', label: 'Transações', icon: 'fas fa-exchange-alt', path: '/accounting/transactions' },
    { id: 'payable', label: 'Contas a Pagar', icon: 'fas fa-money-check-alt', path: '/accounting/payable' },
    { id: 'receivable', label: 'Contas a Receber', icon: 'fas fa-hand-holding-usd', path: '/accounting/receivable' },
    { id: 'reports', label: 'Relatórios', icon: 'fas fa-chart-bar', path: '/accounting/reports' },
    { id: 'import', label: 'Importar', icon: 'fas fa-file-import', path: '/accounting/import' },
  ];

  const quickActions = [
    { label: 'Nova Transação', icon: 'fas fa-plus', action: () => navigate('/accounting/transactions/new') },
    { label: 'Lançar Receita', icon: 'fas fa-arrow-down', action: () => navigate('/accounting/transactions/new?type=income') },
    { label: 'Lançar Despesa', icon: 'fas fa-arrow-up', action: () => navigate('/accounting/transactions/new?type=expense') },
    { label: 'Gerar DRE', icon: 'fas fa-file-invoice-dollar', action: () => navigate('/accounting/reports/income-statement') },
    { label: 'Exportar Excel', icon: 'fas fa-file-excel', action: () => console.log('Export to Excel') },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  return (
    <>
      <Helmet>
        <title>Contabilidade - NexaSuite ERP</title>
      </Helmet>

      <div className="accounting-container">
        {/* Header */}
        <div className="accounting-header">
          <div className="header-left">
            <h1>
              <i className="fas fa-chart-line" /> FinanSys Core
            </h1>
            <p className="subtitle">Sistema de gestão financeira e contábil integrado</p>
          </div>
          
          <div className="header-right">
            <div className="period-selector">
              <select defaultValue="current-month" className="period-select">
                <option value="today">Hoje</option>
                <option value="week">Esta Semana</option>
                <option value="current-month">Este Mês</option>
                <option value="last-month">Mês Anterior</option>
                <option value="quarter">Este Trimestre</option>
                <option value="year">Este Ano</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
            
            <div className="quick-actions-buttons">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="quick-action-btn"
                  onClick={action.action}
                >
                  <i className={action.icon} />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="ai-recommendations">
          <div className="ai-header">
            <i className="fas fa-robot" />
            <h3>Recomendações da IA Financeira</h3>
          </div>
          <div className="recommendations-list">
            <div className="recommendation-item warning">
              <i className="fas fa-exclamation-triangle" />
              <div>
                <strong>Liquidez Corrente</strong>
                <p>Índice abaixo do ideal (1.2). Considere melhorar o capital de giro.</p>
              </div>
            </div>
            <div className="recommendation-item success">
              <i className="fas fa-chart-line" />
              <div>
                <strong>Margem de Lucro</strong>
                <p>25.4% - Acima da média do setor. Continue com a estratégia atual.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="accounting-tabs">
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

        {/* Content Area */}
        <div className="accounting-content">
          <Outlet />
        </div>

        {/* Quick Stats Footer */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-header">
              <span>Ativo Total</span>
              <i className="fas fa-chart-line success" />
            </div>
            <div className="stat-value">R$ 1.250.450,00</div>
            <div className="stat-change positive">+12.5%</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <span>Lucro Líquido</span>
              <i className="fas fa-coins success" />
            </div>
            <div className="stat-value">R$ 245.780,00</div>
            <div className="stat-change positive">+8.3%</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <span>Contas a Receber</span>
              <i className="fas fa-hand-holding-usd warning" />
            </div>
            <div className="stat-value">R$ 450.230,00</div>
            <div className="stat-change">15 dias</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <span>Contas a Pagar</span>
              <i className="fas fa-money-check-alt danger" />
            </div>
            <div className="stat-value">R$ 320.150,00</div>
            <div className="stat-change negative">7 dias</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Accounting;
