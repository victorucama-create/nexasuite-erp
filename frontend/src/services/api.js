import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    // Add token to headers if exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add company ID if exists
    const companyId = localStorage.getItem('currentCompanyId');
    if (companyId) {
      config.headers['X-Company-Id'] = companyId;
    }
    
    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId();
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }
    
    return config;
  },
  (error) => {
    console.error('🚨 Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.url}`, response.data);
    }
    
    // Show success toast for POST/PUT/DELETE if message exists
    if (['post', 'put', 'delete'].includes(response.config.method) && response.data.message) {
      toast.success(response.data.message, {
        duration: 3000,
        position: 'top-right'
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error
    console.error('🚨 API Error:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Handle 401 Unauthorized (Token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken }
        );
        
        const { token, refreshToken: newRefreshToken } = response.data;
        
        // Save new tokens
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Update authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('auth-storage');
        
        // Redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?session=expired';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    const errorMessage = getErrorMessage(error);
    
    // Show error toast
    if (!originalRequest._skipErrorToast) {
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-right'
      });
    }
    
    return Promise.reject(error);
  }
);

// Helper function to generate request ID
function generateRequestId() {
  return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Helper function to extract error message
function getErrorMessage(error) {
  if (error.response) {
    // Server responded with error
    const { data, status } = error.response;
    
    if (data?.message) {
      return data.message;
    }
    
    if (data?.error) {
      return data.error;
    }
    
    switch (status) {
      case 400:
        return 'Requisição inválida. Verifique os dados enviados.';
      case 401:
        return 'Sessão expirada. Por favor, faça login novamente.';
      case 403:
        return 'Você não tem permissão para realizar esta ação.';
      case 404:
        return 'Recurso não encontrado.';
      case 422:
        return 'Dados inválidos. Verifique os campos do formulário.';
      case 429:
        return 'Muitas requisições. Tente novamente mais tarde.';
      case 500:
        return 'Erro interno do servidor. Tente novamente mais tarde.';
      case 502:
        return 'Serviço temporariamente indisponível.';
      case 503:
        return 'Serviço em manutenção. Tente novamente mais tarde.';
      default:
        return `Erro ${status}: Ocorreu um erro inesperado.`;
    }
  }
  
  if (error.request) {
    // Request was made but no response
    return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
  }
  
  // Something happened in setting up the request
  return error.message || 'Erro desconhecido. Tente novamente.';
}

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    profile: '/auth/profile',
    changePassword: '/auth/change-password',
    resetPassword: '/auth/reset-password',
  },
  
  // Companies
  companies: {
    list: '/companies',
    create: '/companies',
    get: (id) => `/companies/${id}`,
    update: (id) => `/companies/${id}`,
    delete: (id) => `/companies/${id}`,
    users: (id) => `/companies/${id}/users`,
    settings: (id) => `/companies/${id}/settings`,
  },
  
  // Accounting
  accounting: {
    transactions: {
      list: '/accounting/transactions',
      create: '/accounting/transactions',
      get: (id) => `/accounting/transactions/${id}`,
      update: (id) => `/accounting/transactions/${id}`,
      delete: (id) => `/accounting/transactions/${id}`,
      import: '/accounting/transactions/import',
      export: '/accounting/transactions/export',
    },
    accounts: {
      list: '/accounting/accounts',
      create: '/accounting/accounts',
      get: (id) => `/accounting/accounts/${id}`,
      update: (id) => `/accounting/accounts/${id}`,
      delete: (id) => `/accounting/accounts/${id}`,
      tree: '/accounting/accounts/tree',
    },
    payable: {
      list: '/accounting/payable',
      create: '/accounting/payable',
      get: (id) => `/accounting/payable/${id}`,
      update: (id) => `/accounting/payable/${id}`,
      delete: (id) => `/accounting/payable/${id}`,
      pay: (id) => `/accounting/payable/${id}/pay`,
    },
    receivable: {
      list: '/accounting/receivable',
      create: '/accounting/receivable',
      get: (id) => `/accounting/receivable/${id}`,
      update: (id) => `/accounting/receivable/${id}`,
      delete: (id) => `/accounting/receivable/${id}`,
      receive: (id) => `/accounting/receivable/${id}/receive`,
    },
    reports: {
      balanceSheet: '/accounting/reports/balance-sheet',
      incomeStatement: '/accounting/reports/income-statement',
      cashFlow: '/accounting/reports/cash-flow',
      trialBalance: '/accounting/reports/trial-balance',
      financialRatios: '/accounting/reports/financial-ratios',
    },
  },
  
  // CRM
  crm: {
    customers: {
      list: '/crm/customers',
      create: '/crm/customers',
      get: (id) => `/crm/customers/${id}`,
      update: (id) => `/crm/customers/${id}`,
      delete: (id) => `/crm/customers/${id}`,
      search: '/crm/customers/search',
      export: '/crm/customers/export',
    },
    sales: {
      list: '/crm/sales',
      create: '/crm/sales',
      get: (id) => `/crm/sales/${id}`,
      update: (id) => `/crm/sales/${id}`,
      delete: (id) => `/crm/sales/${id}`,
      pos: '/crm/sales/pos',
      invoice: (id) => `/crm/sales/${id}/invoice`,
    },
    inventory: {
      products: {
        list: '/crm/inventory/products',
        create: '/crm/inventory/products',
        get: (id) => `/crm/inventory/products/${id}`,
        update: (id) => `/crm/inventory/products/${id}`,
        delete: (id) => `/crm/inventory/products/${id}`,
      },
      warehouses: {
        list: '/crm/inventory/warehouses',
        create: '/crm/inventory/warehouses',
        get: (id) => `/crm/inventory/warehouses/${id}`,
        update: (id) => `/crm/inventory/warehouses/${id}`,
        delete: (id) => `/crm/inventory/warehouses/${id}`,
      },
      transfers: {
        list: '/crm/inventory/transfers',
        create: '/crm/inventory/transfers',
        get: (id) => `/crm/inventory/transfers/${id}`,
        update: (id) => `/crm/inventory/transfers/${id}`,
        delete: (id) => `/crm/inventory/transfers/${id}`,
      },
    },
    loyalty: {
      points: '/crm/loyalty/points',
      rewards: '/crm/loyalty/rewards',
      redeem: '/crm/loyalty/redeem',
    },
    reports: {
      sales: '/crm/reports/sales',
      customers: '/crm/reports/customers',
      inventory: '/crm/reports/inventory',
      revenue: '/crm/reports/revenue',
    },
  },
  
  // System
  system: {
    users: {
      list: '/system/users',
      create: '/system/users',
      get: (id) => `/system/users/${id}`,
      update: (id) => `/system/users/${id}`,
      delete: (id) => `/system/users/${id}`,
      roles: '/system/users/roles',
      permissions: '/system/users/permissions',
    },
    settings: {
      general: '/system/settings/general',
      company: '/system/settings/company',
      modules: '/system/settings/modules',
      integrations: '/system/settings/integrations',
      backups: '/system/settings/backups',
    },
    audit: {
      logs: '/system/audit/logs',
      export: '/system/audit/export',
    },
    health: '/system/health',
    metrics: '/system/metrics',
  },
};

// Export configured axios instance and endpoints
export default api;
