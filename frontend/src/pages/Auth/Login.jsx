import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [version] = useState(import.meta.env.VITE_APP_VERSION || '1.0.0');
  
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Load saved email if exists
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        toast.success('Login realizado com sucesso!');
        
        // Redirect to dashboard or intended page
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        toast.error(result.error || 'Erro ao fazer login');
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('admin@nexasuite.com');
    setPassword('Nexa@2025Master!');
    setRememberMe(false);
    
    // Auto-submit after 500ms
    setTimeout(() => {
      const form = document.getElementById('login-form');
      if (form) {
        const submitEvent = new Event('submit', { cancelable: true });
        form.dispatchEvent(submitEvent);
      }
    }, 500);
  };

  return (
    <>
      <Helmet>
        <title>Login - NexaSuite ERP</title>
        <meta name="description" content="Faça login no NexaSuite ERP, sistema de gestão empresarial completo" />
      </Helmet>

      <div className="login-container">
        <div className="login-background">
          <div className="background-gradient" />
          <div className="background-pattern" />
        </div>

        <div className="login-box">
          {/* Logo */}
          <div className="login-logo">
            <div className="logo-icon">
              <i className="fas fa-chart-network" />
            </div>
            <h1>NexaSuite ERP</h1>
            <p>Sistema Integrado All-in-One</p>
          </div>

          {/* Login Form */}
          <form id="login-form" onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope" /> Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nexasuite.com"
                required
                autoComplete="username"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock" /> Senha
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`} />
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span>Lembrar email</span>
              </label>
              <a href="/forgot-password" className="forgot-password">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt" />
                  <span>Entrar no Sistema</span>
                </>
              )}
            </button>

            {/* Demo Login */}
            <button
              type="button"
              className="demo-button"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              <i className="fas fa-rocket" />
              <span>Entrar com Demo</span>
            </button>

            {/* Divider */}
            <div className="divider">
              <span>ou</span>
            </div>

            {/* Additional Options */}
            <div className="additional-options">
              <button
                type="button"
                className="social-button"
                onClick={() => toast.success('Em breve disponível')}
                disabled={loading}
              >
                <i className="fab fa-google" />
                <span>Continuar com Google</span>
              </button>
              
              <p className="register-link">
                Não tem uma conta?{' '}
                <a href="/register">Solicitar acesso</a>
              </p>
            </div>
          </form>

          {/* Login Footer */}
          <div className="login-footer">
            <div className="security-notice">
              <i className="fas fa-shield-alt" />
              <span>Seus dados estão protegidos com criptografia de ponta a ponta</span>
            </div>
            
            <div className="demo-credentials">
              <p><strong>Super Admin:</strong> admin@nexasuite.com</p>
              <p><strong>Senha:</strong> Nexa@2025Master!</p>
            </div>
            
            <div className="system-info">
              <p>Sistema Integrado RH + Contabilidade + CRM + MRP + B2B</p>
              <small>Versão {version} • © {new Date().getFullYear()} NexaSuite</small>
            </div>
          </div>
        </div>

        {/* Features Sidebar */}
        <div className="features-sidebar">
          <h3>Por que escolher NexaSuite?</h3>
          <ul className="features-list">
            <li>
              <i className="fas fa-chart-line" />
              <div>
                <strong>Contabilidade Completa</strong>
                <small>Balanço, DRE, DFC e muito mais</small>
              </div>
            </li>
            <li>
              <i className="fas fa-users" />
              <div>
                <strong>CRM Avançado</strong>
                <small>Gestão completa de clientes e vendas</small>
              </div>
            </li>
            <li>
              <i className="fas fa-warehouse" />
              <div>
                <strong>Inventário Inteligente</strong>
                <small>Controle multi-armazém em tempo real</small>
              </div>
            </li>
            <li>
              <i className="fas fa-mobile-alt" />
              <div>
                <strong>Totalmente Responsivo</strong>
                <small>Funciona em qualquer dispositivo</small>
              </div>
            </li>
            <li>
              <i className="fas fa-shield-alt" />
              <div>
                <strong>Segurança Máxima</strong>
                <small>Criptografia AES-256 e 2FA</small>
              </div>
            </li>
            <li>
              <i className="fas fa-headset" />
              <div>
                <strong>Suporte 24/7</strong>
                <small>Equipe especializada disponível</small>
              </div>
            </li>
          </ul>
          
          <div className="stats">
            <div className="stat-item">
              <strong>1.2k+</strong>
              <small>Empresas</small>
            </div>
            <div className="stat-item">
              <strong>99.8%</strong>
              <small>Uptime</small>
            </div>
            <div className="stat-item">
              <strong>24/7</strong>
              <small>Suporte</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
