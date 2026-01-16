import React from 'react';
import { motion } from 'framer-motion';
import './StatCard.css';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  color = 'primary',
  format = 'number',
  onClick,
  loading = false
}) => {
  
  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(val);
    }
    
    if (format === 'percentage') {
      return `${val}%`;
    }
    
    // Format large numbers with K/M suffix
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    }
    
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    }
    
    return val.toLocaleString('pt-BR');
  };

  const getColorClass = () => {
    const colors = {
      primary: 'stat-primary',
      secondary: 'stat-secondary',
      success: 'stat-success',
      warning: 'stat-warning',
      danger: 'stat-danger',
      info: 'stat-info'
    };
    return colors[color] || colors.primary;
  };

  const getChangeIcon = () => {
    if (changeType === 'increase') return 'fas fa-arrow-up';
    if (changeType === 'decrease') return 'fas fa-arrow-down';
    if (changeType === 'warning') return 'fas fa-exclamation-triangle';
    return 'fas fa-minus';
  };

  const getChangeColor = () => {
    if (changeType === 'increase') return 'change-positive';
    if (changeType === 'decrease') return 'change-negative';
    if (changeType === 'warning') return 'change-warning';
    return 'change-neutral';
  };

  const handleClick = () => {
    if (onClick && !loading) {
      onClick();
    }
  };

  return (
    <motion.div
      className={`stat-card ${getColorClass()} ${onClick ? 'clickable' : ''} ${loading ? 'loading' : ''}`}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {loading ? (
        <div className="stat-loading">
          <div className="loading-spinner" />
          <span>Carregando...</span>
        </div>
      ) : (
        <>
          <div className="stat-header">
            <div className="stat-title">
              <i className={icon} />
              <span>{title}</span>
            </div>
            <div className="stat-actions">
              <button className="stat-action-btn">
                <i className="fas fa-ellipsis-v" />
              </button>
            </div>
          </div>

          <div className="stat-value">
            {formatValue(value)}
          </div>

          {change !== undefined && (
            <div className="stat-change">
              <span className={`change-indicator ${getChangeColor()}`}>
                <i className={getChangeIcon()} />
                {Math.abs(change)}%
              </span>
              <span className="change-period">vs último mês</span>
            </div>
          )}

          <div className="stat-footer">
            <div className="stat-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${Math.min(Math.abs(change) || 0, 100)}%` }}
              />
            </div>
            <div className="stat-trend">
              {changeType === 'increase' ? 'Crescendo' : 
               changeType === 'decrease' ? 'Decrescendo' : 
               changeType === 'warning' ? 'Atenção' : 'Estável'}
            </div>
          </div>

          {onClick && (
            <div className="stat-hover">
              <i className="fas fa-external-link-alt" />
              <span>Ver detalhes</span>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default StatCard;
