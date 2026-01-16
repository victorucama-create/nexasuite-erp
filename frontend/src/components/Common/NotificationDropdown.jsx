import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationDropdown.css';

const NotificationDropdown = ({ count = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Conta a vencer',
      message: 'Fornecedor XYZ - Vencimento em 3 dias',
      time: '2h atrás',
      action: '/accounting/payable'
    },
    {
      id: 2,
      type: 'info',
      title: 'Sistema atualizado',
      message: 'Nova versão 1.0.0 disponível',
      time: '1d atrás',
      action: '/settings/changelog'
    },
    {
      id: 3,
      type: 'success',
      title: 'Venda realizada',
      message: 'Cliente ABC - R$ 1.250,00',
      time: '2d atrás',
      action: '/crm/sales/1001'
    }
  ];

  const handleNotificationClick = (notification) => {
    if (notification.action) {
      navigate(notification.action);
    }
    setIsOpen(false);
  };

  return (
    <div className="notification-dropdown-container">
      <button 
        className="notification-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notificações"
      >
        <i className="fas fa-bell" />
        {count > 0 && (
          <span className="notification-count">{count}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h4>Notificações</h4>
            <button 
              className="mark-all-read"
              onClick={() => console.log('Mark all read')}
            >
              Marcar todas como lidas
            </button>
          </div>

          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${notification.type}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    <i className={`fas fa-${
                      notification.type === 'warning' ? 'exclamation-triangle' :
                      notification.type === 'info' ? 'info-circle' : 'check-circle'
                    }`} />
                  </div>
                  <div className="notification-content">
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    <small>{notification.time}</small>
                  </div>
                  <button 
                    className="notification-dismiss"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Dismiss', notification.id);
                    }}
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              ))
            ) : (
              <div className="no-notifications">
                <i className="fas fa-bell-slash" />
                <p>Nenhuma notificação</p>
              </div>
            )}
          </div>

          <div className="dropdown-footer">
            <button 
              className="view-all-btn"
              onClick={() => {
                navigate('/notifications');
                setIsOpen(false);
              }}
            >
              Ver todas as notificações
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
