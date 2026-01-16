import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileMenu from './MobileMenu';
import LoadingSpinner from '../UI/LoadingSpinner';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Redirect if no user
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="layout-loading">
        <LoadingSpinner size="large" text="Carregando sistema..." />
      </div>
    );
  }

  return (
    <div className="layout-container">
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button
          className="mobile-menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          <i className={`fas fa-${sidebarOpen ? 'times' : 'bars'}`} />
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''}`}>
        <Sidebar onClose={() => isMobile && setSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="page-content">
          <div className="content-container">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-left">
              <p>
                <strong>NexaSuite ERP v{import.meta.env.VITE_APP_VERSION}</strong>
                <span className="footer-separator">•</span>
                © {new Date().getFullYear()} NexaSuite
              </p>
              <small className="footer-status">
                <i className="fas fa-circle status-online" /> Sistema online
              </small>
            </div>
            <div className="footer-right">
              <a
                href="https://nexasuite.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                <i className="fas fa-book" /> Documentação
              </a>
              <a
                href="https://nexasuite.com/support"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                <i className="fas fa-headset" /> Suporte
              </a>
              <a
                href="https://status.nexasuite.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                <i className="fas fa-server" /> Status
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Menu (Bottom Navigation) */}
      {isMobile && <MobileMenu />}
    </div>
  );
};

export default Layout;
