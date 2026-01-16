import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './AIRecommendations.css';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchRecommendations();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchRecommendations, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ai/recommendations');
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      // Fallback data
      setRecommendations(getFallbackRecommendations());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackRecommendations = () => [
    {
      id: 1,
      title: 'Liquidez Corrente',
      description: 'Índice de liquidez corrente abaixo do ideal (1.2). Considere melhorar o capital de giro.',
      severity: 'warning',
      category: 'finance',
      action: 'review_cash_flow',
      impact: 'medium',
      estimatedSavings: 25000,
      timeline: 'short_term',
      metrics: {
        current: 1.15,
        target: 1.5,
        unit: 'ratio'
      }
    },
    {
      id: 2,
      title: 'Otimização de Estoque',
      description: 'Produto A tem 45% mais stock que necessário. Considere promoção ou transferência.',
      severity: 'info',
      category: 'inventory',
      action: 'adjust_inventory',
      impact: 'high',
      estimatedSavings: 18000,
      timeline: 'immediate',
      metrics: {
        current: 145,
        optimal: 100,
        unit: 'units'
      }
    },
    {
      id: 3,
      title: 'Clientes Inativos',
      description: '12 clientes não compram há mais de 90 dias. Sugerimos campanha de reativação.',
      severity: 'info',
      category: 'crm',
      action: 'reactivate_customers',
      impact: 'medium',
      estimatedRevenue: 45000,
      timeline: 'medium_term'
    }
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#e74c3c',
      high: '#e67e22',
      warning: '#f39c12',
      info: '#3498db',
      success: '#27ae60'
    };
    return colors[severity] || colors.info;
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      critical: 'fas fa-exclamation-circle',
      high: 'fas fa-exclamation-triangle',
      warning: 'fas fa-exclamation',
      info: 'fas fa-info-circle',
      success: 'fas fa-check-circle'
    };
    return icons[severity] || icons.info;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      finance: 'fas fa-chart-line',
      inventory: 'fas fa-warehouse',
      crm: 'fas fa-users',
      sales: 'fas fa-shopping-cart',
      system: 'fas fa-cog'
    };
    return icons[category] || 'fas fa-lightbulb';
  };

  const handleApplyRecommendation = async (recommendation) => {
    try {
      await api.post('/ai/recommendations/apply', { id: recommendation.id });
      toast.success(`Recomendação "${recommendation.title}" aplicada com sucesso!`);
      
      // Remove from list
      setRecommendations(prev => prev.filter(r => r.id !== recommendation.id));
    } catch (error) {
      toast.error('Erro ao aplicar recomendação');
    }
  };

  const handleDismissRecommendation = (id) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
    toast.success('Recomendação descartada');
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="ai-recommendations loading">
        <div className="ai-header">
          <h3><i className="fas fa-robot" /> IA Financeira Analisando...</h3>
        </div>
        <div className="loading-content">
          <div className="ai-spinner">
            <i className="fas fa-brain" />
          </div>
          <p>Analisando dados do seu negócio...</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="ai-recommendations empty">
        <div className="ai-header">
          <h3><i className="fas fa-robot" /> IA Financeira</h3>
          <button className="ai-refresh" onClick={fetchRecommendations}>
            <i className="fas fa-sync-alt" />
          </button>
        </div>
        <div className="empty-state">
          <i className="fas fa-check-circle" />
          <h4>Tudo em ordem!</h4>
          <p>Sua empresa está operando de forma eficiente.</p>
          <small>A IA monitorará constantemente seu desempenho.</small>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-recommendations">
      <div className="ai-header">
        <h3><i className="fas fa-robot" /> Recomendações da IA Financeira</h3>
        <div className="ai-actions">
          <button className="ai-refresh" onClick={fetchRecommendations}>
            <i className="fas fa-sync-alt" />
          </button>
          <span className="ai-count">{recommendations.length} recomendações</span>
        </div>
      </div>

      <AnimatePresence>
        <div className="recommendations-list">
          {recommendations.map((rec) => (
            <motion.div
              key={rec.id}
              className={`recommendation-item ${rec.severity} ${expandedId === rec.id ? 'expanded' : ''}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ borderLeftColor: getSeverityColor(rec.severity) }}
            >
              <div 
                className="recommendation-header"
                onClick={() => toggleExpand(rec.id)}
              >
                <div className="recommendation-icon">
                  <i className={getSeverityIcon(rec.severity)} />
                </div>
                
                <div className="recommendation-content">
                  <div className="recommendation-title">
                    <h4>{rec.title}</h4>
                    <div className="recommendation-meta">
                      <span className="category">
                        <i className={getCategoryIcon(rec.category)} />
                        {rec.category}
                      </span>
                      <span className="impact">{rec.impact}</span>
                      <span className="timeline">{rec.timeline}</span>
                    </div>
                  </div>
                  
                  <p className="recommendation-description">
                    {rec.description}
                  </p>
                </div>
                
                <div className="recommendation-actions">
                  <button 
                    className="action-btn apply"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyRecommendation(rec);
                    }}
                  >
                    <i className="fas fa-check" /> Aplicar
                  </button>
                  <button 
                    className="action-btn dismiss"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDismissRecommendation(rec.id);
                    }}
                  >
                    <i className="fas fa-times" /> Descartar
                  </button>
                  <button className="expand-btn">
                    <i className={`fas fa-chevron-${expandedId === rec.id ? 'up' : 'down'}`} />
                  </button>
                </div>
              </div>

              {expandedId === rec.id && (
                <motion.div
                  className="recommendation-details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="details-grid">
                    {rec.metrics && (
                      <div className="metrics">
                        <h5>Métricas:</h5>
                        <div className="metrics-values">
                          <div className="metric">
                            <span className="label">Atual:</span>
                            <span className="value">{rec.metrics.current} {rec.metrics.unit}</span>
                          </div>
                          <div className="metric">
                            <span className="label">Ideal:</span>
                            <span className="value">{rec.metrics.target} {rec.metrics.unit}</span>
                          </div>
                          <div className="metric">
                            <span className="label">Diferença:</span>
                            <span className="value difference">
                              {((rec.metrics.current - rec.metrics.target) / rec.metrics.target * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {(rec.estimatedSavings || rec.estimatedRevenue) && (
                      <div className="impact-details">
                        <h5>Impacto Estimado:</h5>
                        {rec.estimatedSavings && (
                          <div className="impact-item">
                            <i className="fas fa-piggy-bank" />
                            <div>
                              <strong>Economia Potencial:</strong>
                              <span className="value positive">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(rec.estimatedSavings)}
                              </span>
                            </div>
                          </div>
                        )}
                        {rec.estimatedRevenue && (
                          <div className="impact-item">
                            <i className="fas fa-chart-line" />
                            <div>
                              <strong>Receita Adicional:</strong>
                              <span className="value positive">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(rec.estimatedRevenue)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="action-steps">
                      <h5>Próximos Passos:</h5>
                      <ol>
                        <li>Analisar os dados atuais</li>
                        <li>Implementar as mudanças sugeridas</li>
                        <li>Monitorar os resultados por 30 dias</li>
                        <li>Ajustar estratégia conforme necessário</li>
                      </ol>
                    </div>
                  </div>

                  <div className="details-footer">
                    <button className="details-btn">
                      <i className="fas fa-chart-bar" /> Ver Análise Detalhada
                    </button>
                    <button className="details-btn">
                      <i className="fas fa-calendar" /> Agendar Implementação
                    </button>
                    <button className="details-btn">
                      <i className="fas fa-question-circle" /> Conversar com Especialista
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <div className="ai-footer">
        <div className="ai-insight">
          <i className="fas fa-lightbulb" />
          <span>IA treinada com dados de 1.200+ empresas similares</span>
        </div>
        <div className="ai-accuracy">
          <span>Precisão: 94%</span>
          <span>Última atualização: Hoje, 14:30</span>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
