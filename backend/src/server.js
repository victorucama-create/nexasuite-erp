const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// Import controllers
const authController = require('./controllers/authController');
const { authMiddleware } = require('./middleware/auth');

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://nexasuite-erp.onrender.com']
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    message: 'NexaSuite ERP API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Auth routes (public)
app.post('/api/auth/login', authController.login);
app.post('/api/auth/register', authController.register);
app.post('/api/auth/refresh', authController.refreshToken);

// Protected routes
app.get('/api/auth/profile', authMiddleware, authController.getProfile);
app.put('/api/auth/profile', authMiddleware, authController.updateProfile);
app.post('/api/auth/change-password', authMiddleware, authController.changePassword);

// Dashboard data (protected)
app.get('/api/dashboard', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: {
      financial: {
        totalAssets: 1250450.00,
        monthlySales: 89540.00,
        accountsPayable: 320150.00,
        accountsReceivable: 450230.00,
        netProfit: 245780.00,
        growth: 12.5
      },
      crm: {
        totalClients: 1247,
        newClients: 48,
        vipClients: 48,
        activePoints: 245890,
        salesGrowth: 8.3
      },
      recentActivities: [
        {
          id: 1,
          date: '2024-03-15T14:30:00',
          module: 'Contabilidade',
          description: 'Lançamento de transação - Venda Produto A',
          user: 'Super Admin',
          status: 'completed'
        },
        {
          id: 2,
          date: '2024-03-15T10:15:00',
          module: 'CRM',
          description: 'Cadastro de novo cliente - João Silva',
          user: 'Super Admin',
          status: 'completed'
        }
      ],
      systemMetrics: {
        uptime: 99.9,
        activeUsers: 1,
        storage: 75,
        performance: 95
      }
    }
  });
});

// Servir frontend em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('🚀 NexaSuite ERP Backend');
  console.log(`📡 Porta: ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`👤 Demo user: admin@nexasuite.com`);
});
