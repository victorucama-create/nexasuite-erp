import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import './QuickActions.css';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'new-transaction',
      title: 'Nova Transação',
      description: 'Lançamento contábil',
      icon: 'fas fa-exchange-alt',
      color: '#3498db',
      path: '/accounting/transactions/new',
      shortcut: 'T'
    },
    {
      id: 'new-customer',
      title: 'Novo Cliente',
      description: 'Cadastrar cliente',
      icon: 'fas fa-user-plus',
      color: '#2ecc71',
      path: '/crm/customers/new',
      shortcut: 'C'
    },
    {
      id: 'new-sale',
      title: 'Nova Venda',
      description: 'Registrar venda',
      icon: 'fas fa-shopping-cart',
      color: '#f39c12',
      path: '/crm/sales/new',
      shortcut: 'V'
    },
    {
      id: 'new-invoice',
      title: 'Emitir Fatura',
      description: 'Criar fatura eletrônica',
      icon: 'fas fa-file-invoice',
      color: '#9b59b6',
      path: '/accounting/invoices/new',
      shortcut: 'F'
    },
    {
      id: 'stock-transfer',
      title: 'Transferir Stock',
      description: 'Mover entre armazéns',
      icon: 'fas fa-truck-loading',
      color: '#e74c3c',
      path: '/crm/inventory/transfers/new',
      shortcut: 'S'
    },
    {
      id: 'generate-report',
      title: 'Gerar Relatório',
      description: 'Relatório personalizado',
      icon: 'fas fa-chart-bar',
      color: '#1abc9c',
      path: '/reports/new',
      shortcut: 'R'
    },
    {
      id: 'import-data',
      title: 'Importar Dados',
      description: 'Importar Excel/CSV',
      icon: 'fas fa-file-import',
      color: '#34495e',
      path: '/tools/import',
      shortcut: 'I'
    },
    {
      id: 'backup',
      title: 'Backup',
      description: 'Criar backup do sistema',
      icon: 'fas fa-database',
      color: '#d35400',
      path: '/settings/backup',
      shortcut: 'B'
    }
  ];

  const handleActionClick = (action) => {
    if (action.path) {
      navigate(action.path);
    } else {
      toast.success(`Ação "${action.title}" executada!`);
    }
  };

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        const action = actions.find(a => 
          a.shortcut && a.shortcut.toLowerCase() === e.key.toLowerCase()
        );
        if (action) {
          e.preventDefault();
          handleActionClick(action);
          toast.success(`Atalho: ${action.title}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="quick-actions-container">
      <div className="quick-actions-header">
        <h3>
          <i className="fas fa-bolt" /> Ações Rápidas
        </h3>
        <div className="shortcut-hint">
          <i className="fas fa-keyboard" /> Use Ctrl + Letra
        </div>
      </div>

      <div className="quick-actions-grid">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            className="quick-action-card"
            onClick={() => handleActionClick(action)}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            style={{ '--action-color': action.color }}
          >
            <div className="action-icon" style={{ backgroundColor: `${action.color}20` }}>
              <i className={action.icon} style={{ color: action.color }} />
            </div>
            
            <div className="action-content">
              <h4>{action.title}</h4>
              <p>{action.description}</p>
            </div>
            
            <div className="action-shortcut">
              <kbd>Ctrl</kbd> + <kbd>{action.shortcut}</kbd>
            </div>
            
            <div className="action-hover">
              <i className="fas fa-play" />
              <span>Executar</span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="quick-actions-footer">
        <button 
          className="custom-action-btn"
          onClick={() => toast.success('Personalize suas ações rápidas em Configurações')}
        >
          <i className="fas fa-sliders-h" /> Personalizar ações
        </button>
        
        <div className="action-stats">
          <span className="stat">
            <i className="fas fa-history" /> 12 executadas hoje
          </span>
          <span className="stat">
            <i className="fas fa-star" /> Favoritas: 5
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
