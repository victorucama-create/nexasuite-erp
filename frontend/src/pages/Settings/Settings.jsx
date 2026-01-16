import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../../store/authStore';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const tabs = [
    { id: 'general', label: 'Geral', icon: 'fas fa-sliders-h', path: '/settings/general' },
    { id: 'company', label: 'Empresa', icon: 'fas fa-building', path: '/settings/company' },
    { id: 'users', label: 'Usuários', icon: 'fas fa-user-shield', path: '/settings/users' },
    { id: 'modules', label: 'Módulos', icon: 'fas fa-cubes', path: '/settings/modules' },
    { id: 'integrations', label: 'Integrações', icon: 'fas fa-plug', path: '/settings/integrations' },
    { id: 'security', label: 'Segurança', icon: 'fas fa-shield-alt', path: '/settings/security' },
    { id: 'backup', label: 'Backup', icon: 'fas fa-database', path: '/settings/backup' },
    { id: 'audit', label: 'Auditoria', icon: 'fas fa-clipboard-list', path: '/settings/audit' },
    { id: 'subscriptions', label: 'Assinaturas', icon: 'fas fa-credit-card', path: '/settings/subscriptions' },
  ];

  const systemInfo = [
    { label: 'Versão do Sistema', value: import.meta.env.VITE_APP_VERSION || '1.0.0' },
    { label: 'Última Atualização', value: '15/03/2024' },
    { label: 'Licença', value: 'Professional' },
    { label: 'Expiração', value: '15/03/2025' },
    { label: 'Espaço em Disco', value: '2.4GB / 10GB' },
    { label: 'Backup Automático', value: 'Ativo' },
  ];

  const quickSettings = [
    { label: 'Notificações por Email', enabled: true },
    { label: 'Login com 2 Fatores', enabled: false },
    { label: 'Modo Escuro', enabled: false },
    { label: 'Backup Diário', enabled: true },
    { label: 'API Habilitada', enabled: true },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  const toggleQuickSetting = (index) => {
    console.log('Toggle setting:', index);
    // Implementar toggle
  };

  return (
    <>
      <Helmet>
        <title>Configurações - NexaSuite ERP</title>
      </Helmet>

      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <div className="header-left">
            <h1>
              <i className="fas fa-cog" /> Configurações do Sistema
            </h1>
            <p className="subtitle">Configure e personalize seu ERP</p>
          </div>
          
          <div className="header-right">
            <div className="system-health">
              <div className="health-item healthy">
                <i className="fas fa-server" />
                <div>
                  <span className="health-label">Servidor</span>
                  <span className="health-status">Online</span>
                </div>
              </div>
              <div className="health-item healthy">
                <i className="fas fa-database" />
                <div>
                  <span className="health-label">Banco de Dados</span>
                  <span className="health-status">Online</span>
                </div>
              </div>
              <div className="health-item warning">
                <i className="fas fa-hdd" />
                <div>
                  <span className="health-label">Armazenamento</span>
                  <span className="health-status">24% usado</span>
                </div>
              </div>
            </div>
            
            <button className="btn btn-primary">
              <i className="fas fa-save" /> Salvar Todas
            </button>
          </div>
        </div>

        <div className="settings-wrapper">
          {/* Left Sidebar */}
          <div className="settings-sidebar">
            <div className="sidebar-header">
              <div className="company-badge">
                <div className="company-avatar">
                  {user?.company?.name?.charAt(0) || 'N'}
                </div>
                <div className="company-info">
                  <strong>{user?.company?.name || 'NexaSuite ERP'}</strong>
                  <small>Plano Professional</small>
                </div>
              </div>
            </div>

            <nav className="settings-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id || location.pathname.startsWith(tab.path) ? 'active' : ''}`}
                  onClick={() => handleTabClick(tab)}
                >
                  <i className={tab.icon} />
                  <span>{tab.label}</span>
                  {tab.id === 'security' && (
                    <span className="nav-badge warning">!</span>
                  )}
                </button>
              ))}
            </nav>

            {/* System Info */}
            <div className="system-info-sidebar">
              <h5>
                <i className="fas fa-info-circle" /> Informações do Sistema
              </h5>
              <div className="info-list">
                {systemInfo.map((info, index) => (
                  <div key={index} className="info-item">
                    <span className="info-label">{info.label}:</span>
                    <span className="info-value">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Settings */}
            <div className="quick-settings-sidebar">
              <h5>
                <i className="fas fa-bolt" /> Configurações Rápidas
              </h5>
              {quickSettings.map((setting, index) => (
                <div key={index} className="quick-setting">
                  <span>{setting.label}</span>
                  <button
                    className={`toggle-switch ${setting.enabled ? 'enabled' : ''}`}
                    onClick={() => toggleQuickSetting(index)}
                  >
                    <div className="toggle-slider" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="settings-main">
            <Outlet />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="settings-bottom-bar">
          <div className="bottom-left">
            <div className="license-status">
              <i className="fas fa-certificate" />
              <div>
                <strong>Licença Professional</strong>
                <small>Válida até 15/03/2025</small>
              </div>
            </div>
          </div>
          
          <div className="bottom-center">
            <div className="support-info">
              <i className="fas fa-headset" />
              <div>
                <strong>Suporte 24/7</strong>
                <small>suporte@nexasuite.com</small>
              </div>
            </div>
          </div>
          
          <div className="bottom-right">
            <button className="btn btn-secondary">
              <i className="fas fa-redo" /> Restaurar Padrão
            </button>
            <button className="btn btn-danger">
              <i className="fas fa-trash" /> Limpar Cache
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
