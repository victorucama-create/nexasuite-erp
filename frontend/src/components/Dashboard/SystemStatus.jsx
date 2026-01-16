import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import api from '../../services/api';
import './SystemStatus.css';

const SystemStatus = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const { data: statusData, isLoading, refetch } = useQuery(
    'system-status',
    async () => {
      const response = await api.get('/system/status');
      return response.data;
    },
    {
      refetchInterval: 60000, // Auto-refresh every minute
      retry: 1
    }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusColor = (status) => {
    const colors = {
      operational: '#27ae60',
      degraded: '#f39c12',
      outage: '#e74c3c',
      maintenance: '#3498db'
    };
    return colors[status] || colors.operational;
  };

  const getStatusIcon = (status) => {
    const icons = {
      operational: 'fas fa-check-circle',
      degraded: 'fas fa-exclamation-triangle',
      outage: 'fas fa-times-circle',
      maintenance: 'fas fa-tools'
    };
    return icons[status] || icons.operational;
  };

  const services = statusData?.services || [
    { name: 'API Principal', status: 'operational', latency: 45, uptime: 99.8 },
    { name: 'Banco de Dados', status: 'operational', latency: 12, uptime: 99.9 },
    { name: 'Cache Redis', status: 'operational', latency: 2, uptime: 99.7 },
    { name: 'Serviço de Email', status: 'degraded', latency: 120, uptime: 98.5 },
    { name: 'Processamento de PDF', status: 'operational', latency: 85, uptime: 99.6 },
    { name: 'Integração Financeira', status: 'maintenance', latency: 0, uptime: 99.4 }
  ];

  const systemMetrics = statusData?.metrics || {
    cpu: 45,
    memory: 68,
    storage: 42,
    connections: 124,
    responseTime: 145,
    uptime: 86400 * 30 + 3600 * 12 // 30 days, 12 hours
  };

  const incidents = statusData?.incidents || [
    { id: 1, service: 'Serviço de Email', description: 'Atraso no envio', status: 'investigating', started: new Date(Date.now() - 3600000) },
    { id: 2, service: 'Integração Financeira', description: 'Manutenção programada', status: 'resolved', started: new Date(Date.now() - 86400000) }
  ];

  const handleServiceClick = (service) => {
    console.log('Service clicked:', service);
    // Navigate to service details or show modal
  };

  const handleRefresh = () => {
    refetch();
    setLastUpdate(new Date());
  };

  return (
    <div className="system-status">
      <div className="status-header">
        <div className="header-left">
          <h3>
            <i className="fas fa-server" /> Status do Sistema
          </h3>
          <div className="last-update">
            <i className="fas fa-clock" /> 
            Atualizado {lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        <button 
          className="refresh-status"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <i className={`fas fa-sync-alt ${isLoading ? 'fa-spin' : ''}`} />
          {isLoading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {/* System Health */}
      <div className="system-health">
        <div className="health-metric">
          <div className="metric-label">CPU</div>
          <div className="metric-bar">
            <div 
              className="metric-fill"
              style={{ 
                width: `${systemMetrics.cpu}%`,
                backgroundColor: systemMetrics.cpu > 80 ? '#e74c3c' : systemMetrics.cpu > 60 ? '#f39c12' : '#27ae60'
              }}
            />
          </div>
          <div className="metric-value">{systemMetrics.cpu}%</div>
        </div>
        
        <div className="health-metric">
          <div className="metric-label">RAM</div>
          <div className="metric-bar">
            <div 
              className="metric-fill"
              style={{ 
                width: `${systemMetrics.memory}%`,
                backgroundColor: systemMetrics.memory > 80 ? '#e74c3c' : systemMetrics.memory > 60 ? '#f39c12' : '#27ae60'
              }}
            />
          </div>
          <div className="metric-value">{systemMetrics.memory}%</div>
        </div>
        
        <div className="health-metric">
          <div className="metric-label">Storage</div>
          <div className="metric-bar">
            <div 
              className="metric-fill"
              style={{ 
                width: `${systemMetrics.storage}%`,
                backgroundColor: systemMetrics.storage > 80 ? '#e74c3c' : systemMetrics.storage > 60 ? '#f39c12' : '#27ae60'
              }}
            />
          </div>
          <div className="metric-value">{systemMetrics.storage}%</div>
        </div>
        
        <div className="health-metric">
          <div className="metric-label">Conexões</div>
          <div className="metric-value large">{systemMetrics.connections}</div>
        </div>
        
        <div className="health-metric">
          <div className="metric-label">Uptime</div>
          <div className="metric-value large">{formatUptime(systemMetrics.uptime)}</div>
        </div>
      </div>

      {/* Services Status */}
      <div className="services-status">
        <h4>Status dos Serviços</h4>
        <div className="services-list">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              className="service-item"
              onClick={() => handleServiceClick(service)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{ borderLeftColor: getStatusColor(service.status) }}
            >
              <div className="service-icon">
                <i className={getStatusIcon(service.status)} style={{ color: getStatusColor(service.status) }} />
              </div>
              
              <div className="service-info">
                <div className="service-name">{service.name}</div>
                <div className="service-meta">
                  <span className="service-latency">
                    <i className="fas fa-bolt" /> {service.latency}ms
                  </span>
                  <span className="service-uptime">
                    <i className="fas fa-chart-line" /> {service.uptime}%
                  </span>
                </div>
              </div>
              
              <div className="service-status">
                <span 
                  className="status-badge"
                  style={{ 
                    backgroundColor: `${getStatusColor(service.status)}20`,
                    color: getStatusColor(service.status)
                  }}
                >
                  {service.status === 'operational' ? 'Operacional' : 
                   service.status === 'degraded' ? 'Degradado' : 
                   service.status === 'outage' ? 'Indisponível' : 'Manutenção'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Incidents */}
      {incidents.length > 0 && (
        <div className="recent-incidents">
          <h4>
            <i className="fas fa-exclamation-triangle" /> Incidentes Recentes
          </h4>
          <div className="incidents-list">
            {incidents.map((incident) => (
              <div key={incident.id} className="incident-item">
                <div className="incident-header">
                  <strong>{incident.service}</strong>
                  <span className={`incident-status ${incident.status}`}>
                    {incident.status === 'investigating' ? 'Investigando' : 
                     incident.status === 'identified' ? 'Identificado' : 
                     incident.status === 'monitoring' ? 'Monitorando' : 'Resolvido'}
                  </span>
                </div>
                <p className="incident-description">{incident.description}</p>
                <div className="incident-time">
                  <i className="fas fa-clock" /> 
                  {new Date(incident.started).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Actions */}
      <div className="system-actions">
        <button className="system-action">
          <i className="fas fa-download" /> Backup Agora
        </button>
        <button className="system-action">
          <i className="fas fa-chart-bar" /> Ver Métricas Detalhadas
        </button>
        <button className="system-action">
          <i className="fas fa-bell" /> Configurar Alertas
        </button>
        <button className="system-action">
          <i className="fas fa-cog" /> Configurações Avançadas
        </button>
      </div>
    </div>
  );
};

export default SystemStatus;
