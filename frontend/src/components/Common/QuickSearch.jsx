import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuickSearch.css';

const QuickSearch = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Mock search results
  const mockSearch = (searchQuery) => {
    if (!searchQuery.trim()) return [];
    
    const allResults = [
      { type: 'customer', id: 1, title: 'João Silva', subtitle: 'Cliente VIP', path: '/crm/customers/1' },
      { type: 'transaction', id: 100, title: 'Transação #100', subtitle: 'Venda - R$ 1.250,00', path: '/accounting/transactions/100' },
      { type: 'product', id: 501, title: 'Produto A', subtitle: 'Código: PROD001', path: '/crm/inventory/products/501' },
      { type: 'report', id: 'balance', title: 'Balanço Patrimonial', subtitle: 'Contabilidade', path: '/accounting/reports/balance-sheet' },
    ];

    return allResults.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      const searchResults = mockSearch(query);
      setResults(searchResults);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleResultClick = (result) => {
    navigate(result.path);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="quick-search-container">
      <div className="quick-search-box">
        <div className="search-input-container">
          <i className="fas fa-search search-icon" />
          <input
            type="text"
            placeholder="Digite para buscar clientes, produtos, transações..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          {query && (
            <button 
              className="clear-search"
              onClick={() => setQuery('')}
            >
              <i className="fas fa-times" />
            </button>
          )}
        </div>

        {query && (
          <div className="search-results">
            {isLoading ? (
              <div className="search-loading">
                <i className="fas fa-spinner fa-spin" />
                <span>Buscando...</span>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="results-header">
                  <small>{results.length} resultado(s) encontrado(s)</small>
                </div>
                <div className="results-list">
                  {results.map((result, index) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      className="result-item"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="result-icon">
                        <i className={`fas fa-${
                          result.type === 'customer' ? 'user' :
                          result.type === 'transaction' ? 'exchange-alt' :
                          result.type === 'product' ? 'box' : 'chart-bar'
                        }`} />
                      </div>
                      <div className="result-content">
                        <strong>{result.title}</strong>
                        <small>{result.subtitle}</small>
                      </div>
                      <i className="fas fa-chevron-right result-arrow" />
                    </button>
                  ))}
                </div>
                <div className="results-footer">
                  <small>Pressione ESC para fechar</small>
                </div>
              </>
            ) : (
              <div className="no-results">
                <i className="fas fa-search" />
                <p>Nenhum resultado encontrado para "{query}"</p>
                <small>Tente buscar por cliente, produto ou transação</small>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickSearch;
