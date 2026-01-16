import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import './RecentActivities.css';

const RecentActivities = () => {
  const [filter, setFilter] = useState('all');
  
  const { data: activities, isLoading, error } = useQuery(
    ['activities', filter],
    async () => {
      const response = await api.get(`/activities?filter=${filter}&limit=10`);
      return response.data;
    },
    {
      refetchInterval: 30000, // Auto-refresh every 30 seconds
      retry: 1
    }
  );

  const getModuleBadge = (module) => {
    const badges = {
      accounting: { label: 'Contabilidade', color: 'badge-primary' },
      crm: { label: 'CRM', color: 'badge-info' },
      sales: { label: 'Vendas', color: 'badge-success' },
      inventory: { label: 'Inventário', color: 'badge-warning' },
      system: { label: 'Sistema', color: 'badge-secondary' }
    };
    
    const badge = badges[module] || { label: module, color: 'badge-secondary' };
    return (
      <span className={`badge ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: { label: 'Concluído', color: 'badge-success' },
      pending: { label: 'Pendente', color: 'badge-warning' },
      failed: { label: 'Falhou', color: 'badge-danger' },
      processing: { label: 'Processando', color: 'badge-info' }
    };
    
    const badge = badges[status] || { label: status, color: 'badge-secondary' };
    return (
      <span className={`badge ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `Há ${diffMins} min`;
    if (diffHours < 24) return `Há ${diffHours} h`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `Há ${diffDays} dias`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  };

  const filters = [
    { id: 'all', label: 'Todas' },
    { id: 'accounting', label: 'Contabilidade' },
    { id: 'crm', label: 'CRM' },
    { id: 'sales', label: 'Vendas' },
    { id: 'system', label: 'Sistema' }
  ];

  return (
    <div className="recent-activities">
      <div className="activities-header">
        <h3>
          <i className="fas fa-history" /> Atividades Recentes
        </h3>
        
        <div className="activities-filters">
          {filters.map((filterItem) => (
            <button
              key={filterItem.id}
              className={`filter-btn ${filter === filterItem.id ? 'active' : ''}`}
              onClick={() => setFilter(filterItem.id)}
            >
              {filterItem.label}
            </button>
          ))}
        </div>
      </div>

      <div className="activities-body">
        {isLoading ? (
          <div className="activities-loading">
            <LoadingSpinner size="medium" text="Carregando atividades..." />
          </div>
        ) : error ? (
          <div className="activities-error">
            <i className="fas fa-exclamation-triangle" />
            <p>Erro ao carregar atividades</p>
            <button 
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        ) : activities?.length === 0 ? (
          <div className="activities-empty">
            <i className="fas fa-inbox" />
            <p>Nenhuma atividade recente</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="activities-list">
              {activities?.map((activity, index) => (
                <motion.div
                  key={activity.id || index}
                  className="activity-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <div className="activity-icon">
                    {activity.type === 'create' && <i className="fas fa-plus-circle text-success" />}
                    {activity.type === 'update' && <i className="fas fa-edit text-warning" />}
                    {activity.type === 'delete' && <i className="fas fa-trash-alt text-danger" />}
                    {activity.type === 'login' && <i className="fas fa-sign-in-alt text-info" />}
                    {activity.type === 'export' && <i className="fas fa-file-export text-primary" />}
                    {!activity.type && <i className="fas fa-circle text-muted" />}
                  </div>
                  
                  <div className="activity-content">
                    <div className="activity-header">
                      <span className="activity-description">
                        {activity.description}
                      </span>
                      <span className="activity-time">
                        {formatTime(activity.timestamp)}
                      </span>
                    </div>
                    
                    <div className="activity-meta">
                      {getModuleBadge(activity.module)}
                      <span className="activity-user">
                        <i className="fas fa-user" /> {activity.user}
                      </span>
                      {getStatusBadge(activity.status)}
                    </div>
                    
                    {activity.details && (
                      <div className="activity-details">
                        <button 
                          className="details-toggle"
                          onClick={(e) => {
                            e.currentTarget.parentElement.classList.toggle('expanded');
                          }}
                        >
                          <i className="fas fa-chevron-down" />
                          <span>Ver detalhes</span>
                        </button>
                        
                        <div className="details-content">
                          <pre>{JSON.stringify(activity.details, null, 2)}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      <div className="activities-footer">
        <button 
          className="view-all-btn"
          onClick={() => window.location.href = '/system/audit'}
        >
          <i className="fas fa-list" /> Ver todas as atividades
        </button>
        
        <button 
          className="export-btn"
          onClick={() => api.post('/activities/export')}
        >
          <i className="fas fa-download" /> Exportar log
        </button>
      </div>
    </div>
  );
};

export default RecentActivities;
