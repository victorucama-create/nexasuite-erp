const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas de exemplo
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NexaSuite ERP API is running',
    timestamp: new Date().toISOString()
  });
});

// Autenticação
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Credenciais padrão do sistema
  if (email === 'admin@nexasuite.com' && password === 'Nexa@2025Master!') {
    res.json({
      success: true,
      token: 'demo-jwt-token-nexasuite-2025',
      user: {
        id: 1,
        name: 'Super Admin',
        email: 'admin@nexasuite.com',
        role: 'SUPER_ADMIN',
        avatar: 'SA'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciais inválidas'
    });
  }
});

// Dashboard data
app.get('/api/dashboard', (req, res) => {
  res.json({
    financial: {
      totalAssets: 1250450,
      monthlySales: 89540,
      accountsPayable: 320150,
      growth: 12.5
    },
    crm: {
      totalClients: 1247,
      newClients: 48,
      vipClients: 48,
      salesGrowth: 8.3
    },
    recentActivities: [
      {
        id: 1,
        date: '2024-03-15 14:30',
        module: 'Contabilidade',
        description: 'Lançamento de transação - Venda Produto A',
        user: 'Super Admin',
        status: 'completed'
      },
      {
        id: 2,
        date: '2024-03-15 10:15',
        module: 'CRM',
        description: 'Cadastro de novo cliente - João Silva',
        user: 'Super Admin',
        status: 'completed'
      }
    ]
  });
});

// Contabilidade
app.get('/api/accounting/transactions', (req, res) => {
  res.json([
    { id: 1, date: "2024-03-15", description: "Venda Produto A", debit: "1.1.1", credit: "4.1", value: 2500.50, status: "completed" },
    { id: 2, date: "2024-03-14", description: "Compra Matéria Prima", debit: "5.1", credit: "2.1", value: 1500.00, status: "completed" }
  ]);
});

// CRM
app.get('/api/crm/clients', (req, res) => {
  res.json([
    { id: 1, name: "João da Silva", phone: "(11) 98765-4321", email: "joao.silva@email.com", status: "active", totalSpent: 4850.00 },
    { id: 2, name: "Maria Santos", phone: "(21) 99876-5432", email: "maria.santos@email.com", status: "vip", totalSpent: 12500.00 }
  ]);
});

// Configurações
app.get('/api/config/company', (req, res) => {
  res.json({
    name: "NexaSuite ERP",
    nif: "123456789",
    currency: "BRL",
    language: "pt"
  });
});

// Servir arquivos estáticos do frontend (para produção)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../frontend/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
