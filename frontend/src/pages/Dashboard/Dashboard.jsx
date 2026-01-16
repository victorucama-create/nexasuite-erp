import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import { 
  Line, 
  Bar, 
  Pie, 
  Doughnut 
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import api from '../../services/api';
import StatCard from '../../components/Dashboard/StatCard';
import RecentActivities from '../../components/Dashboard/RecentActivities';
import QuickActions from '../../components/Dashboard/QuickActions';
import AIRecommendations from '../../components/Dashboard/AIRecommendations';
import SystemStatus from '../../components/Dashboard/SystemStatus';
import './Dashboard.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data
  const { data: dashboardData, refetch } = useQuery(
    ['dashboard', timeRange],
    async () => {
      const response = await api.get(`/dashboard?range=${timeRange}`);
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false)
    }
  );

  // Refresh data
  const handleRefresh = () => {
    setIsLoading(true);
    refetch();
  };

  // Financial chart data
  const financialChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Receitas',
        data: [120000, 135000, 150000, 140000, 160000, 175000, 190000, 185000, 200000, 195000, 210000, 225000],
        borderColor: '#27ae60',
        backgroundColor: 'rgba(39, 174, 96, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Despesas',
        data: [95000, 105000, 115000, 110000, 125000, 135000, 145000, 140000, 155000, 150000, 165000, 175000],
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const financialChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(context.parsed.y);
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'R$ ' + (value / 1000).toFixed(0) + 'k';
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  // Sales by category data
  const salesByCategoryData = {
    labels: ['Eletrônicos', 'Móveis', 'Roupas', 'Alimentos', 'Serviços'],
    datasets: [
      {
        data: [35, 25, 20, 12, 8],
        backgroundColor: [
          '#3498db',
          '#2ecc71',
          '#9b59b6',
          '#f39c12',
          '#e74c3c'
        ],
        borderWidth: 1
      }
    ]
  };

  // Customer growth data
  const customerGrowthData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Novos Clientes',
        data: [45, 52, 48, 55, 62, 58],
        backgroundColor: 'rgba(52, 152, 219, 0.7)',
        borderColor: '#3498db',
        borderWidth: 2,
        borderRadius: 5
      }
    ]
  };

  // Stats data
  const stats = dashboardData?.stats || {
    totalAssets: 1250450,
    totalRevenue: 895400,
    totalCustomers: 1247,
    accountsPayable: 320150,
    pendingInvoices: 12,
    activeProjects: 8,
    stockValue: 450230,
    employeeCount: 48
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - NexaSuite ERP</title>
      </Helmet>

      <div className="dashboard">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">
              <i className="fas fa-tachometer-alt" /> Dashboard Integrado
            </h1>
            <p className="dashboard-subtitle">
              Visão geral do seu negócio em tempo real
            </p>
          </div>
          
          <div className="header-right">
            <div className="time-range-selector">
              <button 
                className={`time-range-btn ${timeRange === 'week' ? 'active' : ''}`}
                onClick={() => setTimeRange('week')}
              >
                Semana
              </button>
              <button 
                className={`time-range-btn ${timeRange === 'month' ? 'active' : ''}`}
                onClick={() => setTimeRange('month')}
              >
                Mês
              </button>
              <button 
                className={`time-range-btn ${timeRange === 'quarter' ? 'active' : ''}`}
                onClick={() => setTimeRange('quarter')}
              >
                Trimestre
              </button>
              <button 
                className={`time-range-btn ${timeRange === 'year' ? 'active' : ''}`}
                onClick={() => setTimeRange('year')}
              >
                Ano
              </button>
            </div>
            
            <button 
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <i className={`fas fa-sync-alt ${isLoading ? 'fa-spin' : ''}`} />
              {isLoading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </div>

        {/* AI Recommendations */}
        <AIRecommendations />

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            title="Ativo Total"
            value={stats.totalAssets}
            change={12.5}
            changeType="increase"
            icon="fas fa-chart-line"
            color="success"
            format="currency"
            onClick={() => window.location.href = '/accounting'}
          />
          
          <StatCard
            title="Receitas do Mês"
            value={stats.totalRevenue}
            change={8.3}
            changeType="increase"
            icon="fas fa-shopping-cart"
            color="warning"
            format="currency"
            onClick={() => window.location.href = '/crm/sales'}
          />
          
          <StatCard
            title="Total de Clientes"
            value={stats.totalCustomers}
            change={48}
            changeType="increase"
            icon="fas fa-users"
            color="info"
            format="number"
            onClick={() => window.location.href = '/crm/customers'}
          />
          
          <StatCard
            title="Contas a Pagar"
            value={stats.accountsPayable}
            change={7}
            changeType="warning"
            icon="fas fa-money-check-alt"
            color="danger"
            format="currency"
            onClick={() => window.location.href = '/accounting/payable'}
          />
          
          <StatCard
            title="Faturas Pendentes"
            value={stats.pendingInvoices}
            change={-2}
            changeType="decrease"
            icon="fas fa-file-invoice"
            color="warning"
            format="number"
            onClick={() => window.location.href = '/accounting/receivable'}
          />
          
          <StatCard
            title="Valor em Estoque"
            value={stats.stockValue}
            change={5.2}
            changeType="increase"
            icon="fas fa-warehouse"
            color="primary"
            format="currency"
            onClick={() => window.location.href = '/crm/inventory'}
          />
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          <div className="chart-card large">
            <div className="chart-header">
              <h3><i className="fas fa-chart-line" /> Receitas vs Despesas</h3>
              <select className="chart-select">
                <option>Últimos 12 meses</option>
                <option>Últimos 6 meses</option>
                <option>Este ano</option>
              </select>
            </div>
            <div className="chart-container">
              <Line data={financialChartData} options={financialChartOptions} />
            </div>
          </div>
          
          <div className="chart-card">
            <div className="chart-header">
              <h3><i className="fas fa-chart-pie" /> Vendas por Categoria</h3>
            </div>
            <div className="chart-container">
              <Doughnut data={salesByCategoryData} />
            </div>
          </div>
          
          <div className="chart-card">
            <div className="chart-header">
              <h3><i className="fas fa-user-plus" /> Crescimento de Clientes</h3>
            </div>
            <div className="chart-container">
              <Bar data={customerGrowthData} />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="dashboard-bottom">
          <div className="bottom-left">
            {/* Recent Activities */}
            <RecentActivities />
            
            {/* Quick Actions */}
            <QuickActions />
          </div>
          
          <div className="bottom-right">
            {/* System Status */}
            <SystemStatus />
            
            {/* Event Log */}
            <div className="card">
              <div className="card-header">
                <h3><i className="fas fa-list" /> Sistema de Eventos Integrados</h3>
              </div>
              <div className="card-body">
                <p>Este sistema utiliza eventos para integração entre módulos:</p>
                <ul className="event-list">
                  <li>
                    <i className="fas fa-arrow-right text-success" />
                    <strong>CRM → Contabilidade:</strong> Vendas geram lançamentos automáticos
                  </li>
                  <li>
                    <i className="fas fa-arrow-right text-info" />
                    <strong>Contabilidade → CRM:</strong> Recebimentos atualizam status do cliente
                  </li>
                  <li>
                    <i className="fas fa-sync-alt text-warning" />
                    <strong>Eventos em tempo real:</strong> Todos os módulos se comunicam via eventos
                  </li>
                </ul>
                
                <div className="integrations-section">
                  <h4>Próximas Integrações:</h4>
                  <div className="integrations-grid">
                    <div className="integration-item">
                      <i className="fas fa-user-tie" />
                      <span>Recursos Humanos</span>
                      <span className="badge badge-warning">Em Breve</span>
                    </div>
                    <div className="integration-item">
                      <i className="fas fa-industry" />
                      <span>MRP - Produção</span>
                      <span className="badge badge-warning">Em Breve</span>
                    </div>
                    <div className="integration-item">
                      <i className="fas fa-exchange-alt" />
                      <span>B2B Marketplace</span>
                      <span className="badge badge-warning">Em Breve</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
