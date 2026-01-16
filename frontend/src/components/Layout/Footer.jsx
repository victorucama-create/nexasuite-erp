import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        {/* Left Section - Copyright & Info */}
        <div className="footer-left">
          <div className="footer-brand">
            <i className="fas fa-chart-network" />
            <div className="brand-info">
              <strong>NexaSuite ERP</strong>
              <small>v{import.meta.env.VITE_APP_VERSION || '1.0.0'}</small>
            </div>
          </div>
          
          <div className="footer-copyright">
            <p>
              © {currentYear} NexaSuite Technologies. Todos os direitos reservados.
              <span className="footer-separator">•</span>
              <Link to="/terms" className="footer-link">Termos</Link>
              <span className="footer-separator">•</span>
              <Link to="/privacy" className="footer-link">Privacidade</Link>
            </p>
            <small className="footer-status">
              <i className="fas fa-circle status-online" /> Sistema online
              <span className="status-separator">•</span>
              Uptime: 99.9%
            </small>
          </div>
        </div>

        {/* Middle Section - Quick Links */}
        <div className="footer-middle">
          <div className="footer-section">
            <h5>Recursos</h5>
            <ul className="footer-links">
              <li><Link to="/docs">Documentação</Link></li>
              <li><Link to="/api">API</Link></li>
              <li><Link to="/integrations">Integrações</Link></li>
              <li><Link to="/marketplace">Marketplace</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h5>Suporte</h5>
            <ul className="footer-links">
              <li><Link to="/help">Central de Ajuda</Link></li>
              <li><Link to="/tutorials">Tutoriais</Link></li>
              <li><Link to="/contact">Contato</Link></li>
              <li><Link to="/status">Status do Sistema</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h5>Empresa</h5>
            <ul className="footer-links">
              <li><Link to="/about">Sobre</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/careers">Carreiras</Link></li>
              <li><Link to="/partners">Parceiros</Link></li>
            </ul>
          </div>
        </div>

        {/* Right Section - System Info & Actions */}
        <div className="footer-right">
          <div className="system-info">
            <div className="info-item">
              <i className="fas fa-server" />
              <div>
                <span className="info-label">Servidor:</span>
                <span className="info-value">production-01</span>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-database" />
              <div>
                <span className="info-label">Banco de dados:</span>
                <span className="info-value">PostgreSQL 14</span>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-shield-alt" />
              <div>
                <span className="info-label">Segurança:</span>
                <span className="info-value">SSL/TLS Ativo</span>
              </div>
            </div>
          </div>

          <div className="footer-actions">
            <button 
              className="action-btn backup-btn"
              onClick={() => console.log('Backup triggered')}
            >
              <i className="fas fa-download" /> Backup
            </button>
            <button 
              className="action-btn report-btn"
              onClick={() => console.log('Report generated')}
            >
              <i className="fas fa-chart-bar" /> Relatório
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="bottom-left">
          <span className="performance">
            <i className="fas fa-tachometer-alt" /> Performance: 95%
          </span>
          <span className="memory">
            <i className="fas fa-memory" /> Memória: 2.4GB/8GB
          </span>
        </div>
        
        <div className="bottom-center">
          <span className="user-count">
            <i className="fas fa-users" /> Usuários online: 12
          </span>
        </div>
        
        <div className="bottom-right">
          <span className="last-update">
            <i className="fas fa-sync-alt" /> Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
