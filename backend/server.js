import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock database
const mockData = {
  users: [
    {
      id: 1,
      name: 'Super Admin',
      email: 'admin@nexasuite.com',
      role: 'SUPER_ADMIN',
      permissions: ['*'],
      company: {
        id: 1,
        name: 'NexaSuite ERP',
        plan: 'Professional',
        currency: 'MZN',
        country: 'MZ'
      },
      avatar: 'SA'
    }
  ],
  
  customers: [
    {
      id: 1,
      name: 'João da Silva',
      email: 'joao@email.com',
      phone: '(11) 98765-4321',
      status: 'active',
      totalSpent: 4850.00,
      points: 1245,
      lastPurchase: '2024-03-15'
    }
  ],
  
  transactions: [
    {
      id: 1,
      date: '2024-03-15',
      description: 'Venda Produto A',
      type: 'income',
      amount: 2500.50,
      category: 'Vendas',
      status: 'completed'
    }
  ],
  
  products: [
    {
      id: 1,
      code: 'PROD001',
      name: 'Produto A',
      category: 'Eletrônicos',
      price: 125.00,
      cost: 85.00,
      stock: 150,
      minStock: 20
    }
  ]
};

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://nexasuite-erp.onrender.com', 'http://nexasuite-erp.onrender.com']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.NODE_ENV === 'production' ? 'https://nexasuite-erp.onrender.com' : 'http://localhost:*']
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from frontend
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  console.log(`📁 Servindo frontend de: ${frontendPath}`);
  app.use(express.static(frontendPath));
}

// Authentication middleware
const authMiddleware = (req, res, next) => {
  // Skip auth for public routes
  const publicRoutes = ['/api/health', '/api/auth/login', '/api/auth/refresh'];
  if (publicRoutes.includes(req.path)) {
    return next();
  }
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token de autenticação não fornecido' 
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Demo token verification
    if (token === 'demo-jwt-token-nexasuite-2025') {
      req.user = mockData.users[0];
      next();
    } else {
      throw new Error('Token inválido');
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado'
    });
  }
};

// Apply auth middleware to all API routes except public ones
app.use('/api', (req, res, next) => {
  const publicRoutes = ['/api/health', '/api/auth/login', '/api/auth/refresh'];
  if (publicRoutes.includes(req.path)) {
    return next();
  }
  authMiddleware(req, res, next);
});

// ========== HEALTH CHECK ==========
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'NexaSuite ERP API está funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    memoryUsage: process.memoryUsage()
  });
});

// ========== AUTHENTICATION ROUTES ==========
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Demo credentials
    if (email === 'admin@nexasuite.com' && password === 'Nexa@2025Master!') {
      const user = mockData.users[0];
      
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
          company: user.company,
          avatar: user.avatar
        },
        token: 'demo-jwt-token-nexasuite-2025',
        refreshToken: 'demo-refresh-token-nexasuite-2025'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Credenciais inválidas. Use: admin@nexasuite.com | Senha: Nexa@2025Master!'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  if (refreshToken === 'demo-refresh-token-nexasuite-2025') {
    res.json({
      success: true,
      token: 'demo-jwt-token-nexasuite-2025',
      refreshToken: 'demo-refresh-token-nexasuite-2025'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Refresh token inválido'
    });
  }
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    user: req.user || mockData.users[0]
  });
});

// ========== DASHBOARD ROUTES ==========
app.get('/api/dashboard', (req, res) => {
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
      inventory: {
        totalProducts: 156,
        lowStock: 12,
        outOfStock: 3,
        stockValue: 125000.00
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

// ========== ACCOUNTING ROUTES ==========
app.get('/api/accounting/transactions', (req, res) => {
  const { page = 1, limit = 20, type, startDate, endDate } = req.query;
  
  let transactions = mockData.transactions;
  
  // Filter by type
  if (type) {
    transactions = transactions.filter(t => t.type === type);
  }
  
  // Filter by date range
  if (startDate && endDate) {
    transactions = transactions.filter(t => 
      t.date >= startDate && t.date <= endDate
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedTransactions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: transactions.length,
      pages: Math.ceil(transactions.length / limit)
    }
  });
});

app.post('/api/accounting/transactions', (req, res) => {
  const newTransaction = {
    id: mockData.transactions.length + 1,
    ...req.body,
    date: req.body.date || new Date().toISOString().split('T')[0],
    status: 'completed',
    createdAt: new Date().toISOString()
  };
  
  mockData.transactions.unshift(newTransaction);
  
  res.json({
    success: true,
    message: 'Transação criada com sucesso',
    data: newTransaction
  });
});

app.get('/api/accounting/accounts', (req, res) => {
  const accounts = [
    { id: 1, code: '1', name: 'Ativo', type: 'asset', balance: 1250450.00 },
    { id: 2, code: '1.1', name: 'Ativo Circulante', type: 'asset', balance: 450000.00 },
    { id: 3, code: '2', name: 'Passivo', type: 'liability', balance: 654320.00 },
    { id: 4, code: '3', name: 'Patrimônio Líquido', type: 'equity', balance: 596130.00 },
    { id: 5, code: '4', name: 'Receitas', type: 'revenue', balance: 1250000.00 },
    { id: 6, code: '5', name: 'Despesas', type: 'expense', balance: 1004220.00 }
  ];
  
  res.json({
    success: true,
    data: accounts
  });
});

// Reports
app.get('/api/accounting/reports/balance-sheet', (req, res) => {
  res.json({
    success: true,
    data: {
      assets: {
        current: 450000.00,
        nonCurrent: 800450.00,
        total: 1250450.00
      },
      liabilities: {
        current: 320150.00,
        nonCurrent: 334170.00,
        total: 654320.00
      },
      equity: {
        capital: 500000.00,
        retainedEarnings: 96130.00,
        total: 596130.00
      }
    }
  });
});

app.get('/api/accounting/reports/income-statement', (req, res) => {
  res.json({
    success: true,
    data: {
      revenue: 1250000.00,
      costOfGoodsSold: 650000.00,
      grossProfit: 600000.00,
      expenses: 354220.00,
      netIncome: 245780.00,
      period: '2024-01-01 to 2024-03-15'
    }
  });
});

// ========== CRM ROUTES ==========
app.get('/api/crm/customers', (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  
  let customers = mockData.customers;
  
  // Filter by status
  if (status) {
    customers = customers.filter(c => c.status === status);
  }
  
  // Search by name or email
  if (search) {
    const searchLower = search.toLowerCase();
    customers = customers.filter(c => 
      c.name.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower)
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedCustomers = customers.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedCustomers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: customers.length,
      pages: Math.ceil(customers.length / limit)
    }
  });
});

app.post('/api/crm/customers', (req, res) => {
  const newCustomer = {
    id: mockData.customers.length + 1,
    ...req.body,
    totalSpent: 0,
    points: 0,
    status: 'active',
    createdAt: new Date().toISOString()
  };
  
  mockData.customers.unshift(newCustomer);
  
  res.json({
    success: true,
    message: 'Cliente criado com sucesso',
    data: newCustomer
  });
});

app.get('/api/crm/sales', (req, res) => {
  const sales = [
    {
      id: 1001,
      customerId: 1,
      customerName: 'João da Silva',
      date: '2024-03-15',
      total: 250.00,
      discount: 10.00,
      paymentMethod: 'card',
      status: 'completed'
    },
    {
      id: 1002,
      customerId: 2,
      customerName: 'Maria Santos',
      date: '2024-03-14',
      total: 850.00,
      discount: 50.00,
      paymentMethod: 'cash',
      status: 'completed'
    }
  ];
  
  res.json({
    success: true,
    data: sales
  });
});

app.post('/api/crm/sales', (req, res) => {
  const newSale = {
    id: 1000 + mockData.transactions.length + 1,
    ...req.body,
    date: new Date().toISOString().split('T')[0],
    status: 'completed',
    createdAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Venda realizada com sucesso',
    data: newSale
  });
});

app.get('/api/crm/inventory/products', (req, res) => {
  const { lowStock } = req.query;
  
  let products = mockData.products;
  
  if (lowStock === 'true') {
    products = products.filter(p => p.stock <= p.minStock);
  }
  
  res.json({
    success: true,
    data: products
  });
});

// ========== SYSTEM ROUTES ==========
app.get('/api/system/users', (req, res) => {
  res.json({
    success: true,
    data: mockData.users
  });
});

app.get('/api/system/settings/general', (req, res) => {
  res.json({
    success: true,
    data: {
      companyName: 'NexaSuite ERP',
      nif: '123456789',
      currency: 'MZN',
      language: 'pt',
      timezone: 'Africa/Maputo',
      dateFormat: 'DD/MM/YYYY',
      emailNotifications: true,
      twoFactorAuth: false,
      darkMode: false,
      backupEnabled: true,
      backupFrequency: 'daily'
    }
  });
});

app.put('/api/system/settings/general', (req, res) => {
  res.json({
    success: true,
    message: 'Configurações atualizadas com sucesso',
    data: req.body
  });
});

// ========== FILE UPLOAD ==========
app.post('/api/upload', (req, res) => {
  // Simulate file upload
  const fileUrl = `https://api.nexasuite.com/uploads/${Date.now()}-file.pdf`;
  
  res.json({
    success: true,
    message: 'Arquivo enviado com sucesso',
    data: {
      url: fileUrl,
      filename: 'arquivo-upload.pdf',
      size: 1024 * 1024, // 1MB
      type: 'application/pdf'
    }
  });
});

// ========== MOCK ALL OTHER REQUIRED ENDPOINTS ==========
const mockEndpoints = [
  '/api/accounting/payable',
  '/api/accounting/receivable',
  '/api/accounting/reports/cash-flow',
  '/api/accounting/reports/trial-balance',
  '/api/accounting/reports/financial-ratios',
  '/api/accounting/import',
  '/api/crm/loyalty',
  '/api/crm/pos',
  '/api/crm/reports',
  '/api/crm/promotions',
  '/api/system/settings/company',
  '/api/system/settings/modules',
  '/api/system/settings/integrations',
  '/api/system/settings/backup',
  '/api/system/audit/logs',
  '/api/system/subscriptions'
];

mockEndpoints.forEach(endpoint => {
  app.get(endpoint, (req, res) => {
    res.json({
      success: true,
      data: [],
      message: 'Endpoint disponível. Dados mockados para demonstração.'
    });
  });
  
  app.post(endpoint, (req, res) => {
    res.json({
      success: true,
      message: 'Operação realizada com sucesso',
      data: req.body
    });
  });
});

// ========== HANDLE REACT ROUTING IN PRODUCTION ==========
if (process.env.NODE_ENV === 'production') {
  // All other GET requests not handled by API will return the React app
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../frontend/dist/index.html');
    console.log(`📄 Servindo index.html de: ${indexPath}`);
    res.sendFile(indexPath);
  });
} else {
  // Development route
  app.get('/', (req, res) => {
    res.json({
      message: 'NexaSuite ERP API Development Server',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth/login',
        dashboard: '/api/dashboard',
        accounting: '/api/accounting/*',
        crm: '/api/crm/*',
        system: '/api/system/*'
      },
      demoCredentials: {
        email: 'admin@nexasuite.com',
        password: 'Nexa@2025Master!'
      }
    });
  });
}

// ========== ERROR HANDLING ==========
// 404 Handler
app.use('*', (req, res) => {
  if (req.accepts('html') && process.env.NODE_ENV === 'production') {
    const indexPath = path.join(__dirname, '../frontend/dist/index.html');
    return res.sendFile(indexPath);
  }
  
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 API Error:', err.stack);
  
  const statusCode = err.status || 500;
  const message = err.message || 'Erro interno do servidor';
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('🚀 ==========================================');
  console.log('   NEXASUITE ERP BACKEND API');
  console.log('   ==========================================');
  console.log(`   📡 Porta: ${PORT}`);
  console.log(`   🌍 Host: ${HOST}`);
  console.log(`   🏭 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   📅 Data: ${new Date().toLocaleString('pt-MZ')}`);
  console.log('   ==========================================');
  console.log(`   👤 Demo Credentials:`);
  console.log(`      Email: admin@nexasuite.com`);
  console.log(`      Senha: Nexa@2025Master!`);
  console.log('   ==========================================');
  console.log(`   🔗 Health Check: http://${HOST}:${PORT}/api/health`);
  console.log(`   🔗 API Base: http://${HOST}:${PORT}/api`);
  console.log('   ==========================================');
  
  // Log all registered routes
  if (process.env.NODE_ENV === 'development') {
    console.log('\n   📋 Rotas disponíveis:');
    const routes = [];
    app._router.stack.forEach(middleware => {
      if (middleware.route) {
        routes.push(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
      }
    });
    routes.sort().forEach(route => console.log(`      ${route}`));
  }
});
