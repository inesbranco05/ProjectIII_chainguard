import React, { useState, useEffect } from 'react';
import { validationService, statsService } from './services/api';
import './App.css';

function Dashboard({ user, onLogout }) {
  const [page, setPage] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    successRate: 0,
    successful: 0,
    failed: 0
  });
  
  const [form, setForm] = useState({
    chainFamily: 'Ethereum',
    chain: 'Ethereum',
    tokenAsset: 'ETH',
    txHash: '',
    expectedDestination: '',
    expectedAmount: '',
    rpcEndpoint: '',
    notes: ''
  });


  const chainFamilies = [
    { value: 'Ethereum', label: 'Ethereum & EVM Chains' },
    { value: 'Bitcoin', label: 'Bitcoin' },
    { value: 'Solana', label: 'Solana' },
    { value: 'EVM-compatible', label: 'Other EVM Chains' },
    { value: 'Theta Network', label: 'Theta Network' },
    { value: 'Cosmos SDK', label: 'Cosmos Ecosystem' },
    { value: 'Tron (DPoS)', label: 'Tron Network' },
    { value: 'Near Protocol', label: 'Near Protocol' },
    { value: 'VeChainThor (non-EVM)', label: 'VeChainThor' },
    { value: 'Ontology', label: 'Ontology' },
    { value: 'Custom L1', label: 'Custom Blockchains' },
    { value: 'UTXO / BRC-20 Ordinals', label: 'Bitcoin' },
  ];

  // Chains por família 
  const chains = {
    'Ethereum': ['Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism', 'Avalanche'],
    'Bitcoin': ['Bitcoin'],
    'Solana': ['Solana'],
    'EVM-compatible': ['Bittensor', 'Solar', 'Vana', 'Wanchain'],
    'Theta Network': ['Theta'],
    'Cosmos SDK': ['Celestia', 'Neutron', 'Osmosis', 'Oraichain'],
    'Tron (DPoS)': ['Tron'],
    'Near Protocol': ['Near'],
    'VeChainThor (non-EVM)': ['VeChainThor'],
    'Ontology': ['Ontology'],
    'Custom L1': ['Nillion'],
    'UTXO / BRC-20 Ordinals': ['Bitcoin'],
  };


  const chainTokens = {
    // Ethereum family
    'Ethereum': 'ETH',
    'Polygon': 'MATIC',
    'BSC': 'BNB',
    'Arbitrum': 'ETH',
    'Optimism': 'ETH',
    'Avalanche': 'AVAX',
    
    // Bitcoin
    'Bitcoin': 'BTC',
    
    // Solana
    'Solana': 'SOL',
    
    // EVM-compatible
    'Bittensor': 'TAO',
    'Solar': 'SXP',
    'Vana': 'VANA',
    'Wanchain': 'WAN',
    
    // Theta
    'Theta': 'THETA',
    
    // Cosmos SDK
    'Celestia': 'TIA',
    'Neutron': 'NTRN',
    'Osmosis': 'OSMO',
    'Oraichain': 'ORAI',
    
    // Tron
    'Tron': 'TRX',
    
    // Near
    'Near': 'NEAR',
    
    // VeChainThor
    'VeChainThor': 'VET',
    
    // Ontology
    'Ontology': 'ONT',
    
    // Custom L1
    'Nillion': 'NIL',
    
    // Default fallback
    'Default': 'TOKEN'
  };

 

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Carregar validações
      const validationsResponse = await validationService.getValidations({ limit: 10 });
      
      let validations = [];
      if (validationsResponse && validationsResponse.success) {
        validations = validationsResponse.data?.validations || [];
      }
      
      setTransactions(validations);

      // Carregar estatísticas
      const statsResponse = await statsService.getOverallStats();
      
      if (statsResponse && statsResponse.success) {
        const statsData = statsResponse.data?.overall;
        if (statsData) {
          setStats({
            total: statsData.totalValidations || 0,
            successRate: statsData.successRate || 0,
            successful: statsData.successCount || 0,
            failed: statsData.failedCount || 0,
          });
        } else {
          calculateLocalStats(validations);
        }
      } else {
        calculateLocalStats(validations);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      calculateLocalStats([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateLocalStats = (validations) => {
    const total = validations.length;
    const successful = validations.filter(v => v.status === 'success').length;
    const failed = validations.filter(v => v.status === 'failed').length;
    const successRate = total > 0 ? (successful / total * 100).toFixed(1) : 0;
    
    setStats({
      total,
      successRate: parseFloat(successRate),
      successful,
      failed
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!form.txHash || !form.expectedDestination || !form.expectedAmount) {
      alert('Please fill all required fields: TX Hash, Destination, Amount');
      return;
    }

    console.log('Submitting validation:', form);
    console.log('Chain Family:', form.chainFamily);
    console.log('Chain:', form.chain);
    
    setValidating(true);

    try {
      const response = await validationService.validateTransaction(form);
      console.log('Validation response:', response);
      
      if (response.success) {
        alert(`✅ ${response.message || 'Transaction validation submitted!'}`);
        
        // Reset form mas mantém a chain selecionada
        setForm(prev => ({
          ...prev,
          txHash: '',
          expectedDestination: '',
          expectedAmount: '',
          rpcEndpoint: '',
          notes: ''
        }));
        
        // Aguardar 2 segundos e recarregar dados
        setTimeout(() => {
          loadData();
        }, 2000);
      } else {
        alert(`${response.message || 'Validation failed'}`);
      }
    } catch (error) {
      console.error('Validation error:', error);
      
      // Verificar se é erro 400 (validação)
      if (error.response?.status === 400) {
        const errors = error.response.data?.errors || [];
        const errorMessages = errors.map(e => e.msg).join(', ');
        alert(`Validation error: ${errorMessages || error.message}`);
      } else {
        alert(`Error: ${error.message || 'Please try again'}`);
      }
    } finally {
      setValidating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'chainFamily') {
      // Encontrar primeira chain desta família
      const selectedChains = chains[value];
      const selectedChain = selectedChains ? selectedChains[0] : '';
      
      // Buscar token padrão para esta chain
      const defaultToken = chainTokens[selectedChain] || chainTokens['Default'];
      
      console.log(`Changing chain family to: ${value}`);
      console.log(`Selected chain: ${selectedChain}`);
      console.log(`Token: ${defaultToken}`);
      
      setForm(prev => ({
        ...prev,
        chainFamily: value,
        chain: selectedChain,
        tokenAsset: defaultToken
      }));
    } else if (name === 'chain') {
      // Quando muda a chain específica, atualizar token também
      const tokenForChain = chainTokens[value] || chainTokens['Default'];
      
      console.log(`Changing chain to: ${value}`);
      console.log(`Token: ${tokenForChain}`);
      
      setForm(prev => ({
        ...prev,
        [name]: value,
        tokenAsset: tokenForChain
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRevalidate = async (id) => {
    if (!id || id === 'mock_1') {
      alert('Cannot revalidate mock data');
      return;
    }
    
    try {
      await validationService.revalidateTransaction(id);
      alert('Transaction revalidation started!');
      // Recarregar depois de 2 segundos
      setTimeout(() => loadData(), 2000);
    } catch (error) {
      alert('Revalidation failed: ' + (error.message || 'Unknown error'));
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString || 'N/A';
    }
  };

  const truncateText = (text, length = 20) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  if (loading && page === 'dashboard') {
    return (
      <div className="loading-screen">
        <div className="spinner large"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img 
              src="/logo.png" 
              alt="ChainGuard Logo" 
              style={{ 
                height: '60px', 
                width: 'auto',
                borderRadius: '8px'
              }}
            />
            <div>
              <h1>ChainGuard</h1>
              <span>Multi-Chain Transaction Validator</span>
            </div>
          </div>
        </div>
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="main-nav">
        <button 
          className={`nav-btn ${page === 'dashboard' ? 'active' : ''}`}
          onClick={() => setPage('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-btn ${page === 'validate' ? 'active' : ''}`}
          onClick={() => setPage('validate')}
        >
          Validate Transaction
        </button>
        <button 
          className={`nav-btn ${page === 'history' ? 'active' : ''}`}
          onClick={() => setPage('history')}
        >
          History
        </button>
      </nav>

      <main className="main-content">
        {page === 'dashboard' && (
          <div className="dashboard">
            <h2>Validation Dashboard</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Supporting {Object.values(chains).flat().length} blockchain networks
            </p>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Validations</h3>
                <div className="stat-value">{stats.total}</div>
                <p>All-time transaction validations</p>
              </div>
              <div className="stat-card">
                <h3>Success Rate</h3>
                <div className="stat-value">{stats.successRate}%</div>
                <p>Successful validations</p>
              </div>
              <div className="stat-card">
                <h3>Successful</h3>
                <div className="stat-value success">{stats.successful}</div>
                <p>Transactions validated correctly</p>
              </div>
              <div className="stat-card">
                <h3>Failed</h3>
                <div className="stat-value failed">{stats.failed}</div>
                <p>Validation mismatches</p>
              </div>
            </div>

            <div className="recent-section">
              <h3>Recently Validated Transactions</h3>
              {transactions.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Chain</th>
                      <th>TX Hash</th>
                      <th>Destination</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, index) => (
                      <tr key={tx._id || `tx-${index}`}>
                        <td>
                          <div>
                            <div style={{ fontWeight: 'bold' }}>{tx.chain}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{tx.chainFamily}</div>
                          </div>
                        </td>
                        <td>
                          <span className="tx-hash" title={tx.txHash}>
                            {truncateText(tx.txHash, 12)}
                          </span>
                        </td>
                        <td title={tx.expectedDestination}>
                          {truncateText(tx.expectedDestination, 10)}
                        </td>
                        <td>{tx.expectedAmount} {tx.tokenAsset}</td>
                        <td>
                          <span className={`status-badge ${tx.status}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td>{formatDate(tx.validatedAt || tx.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                  <p>No validations yet. Validate your first transaction!</p>
                  <button 
                    className="auth-button"
                    style={{ marginTop: '1rem' }}
                    onClick={() => setPage('validate')}
                  >
                    Validate First Transaction
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {page === 'validate' && (
          <div className="validation-page">
            <h2>Transaction Validation</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Validate transactions across {Object.values(chains).flat().length} supported blockchains
            </p>
            
            <form className="validation-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Chain Family *</label>
                  <select 
                    name="chainFamily" 
                    value={form.chainFamily}
                    onChange={handleChange}
                    required
                    disabled={validating}
                  >
                    {chainFamilies.map(family => (
                      <option key={family.value} value={family.value}>
                        {family.label}
                      </option>
                    ))}
                  </select>
                  <small style={{ fontSize: '0.8rem', color: '#666' }}>
                    Select blockchain type
                  </small>
                </div>
                
                <div className="form-group">
                  <label>Specific Chain *</label>
                  <select 
                    name="chain" 
                    value={form.chain}
                    onChange={handleChange}
                    required
                    disabled={validating}
                  >
                    <option value="">Select Chain</option>
                    {chains[form.chainFamily]?.map(chain => (
                      <option key={chain} value={chain}>{chain}</option>
                    ))}
                  </select>
                  <small style={{ fontSize: '0.8rem', color: '#666' }}>
                    {chains[form.chainFamily]?.length || 0} chain(s) available
                  </small>
                </div>

                <div className="form-group">
                  <label>Native Token</label>
                  <input
                    type="text"
                    name="tokenAsset"
                    value={form.tokenAsset}
                    onChange={handleChange}
                    disabled={validating}
                    readOnly
                    style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}
                  />
                  <small style={{ fontSize: '0.8rem', color: '#666' }}>
                    Auto-detected native token
                  </small>
                </div>

                <div className="form-group full-width">
                  <label>Transaction Hash *</label>
                  <input
                    type="text"
                    name="txHash"
                    value={form.txHash}
                    onChange={handleChange}
                    placeholder="0x... for EVM, base58 for others"
                    required
                    disabled={validating}
                  />
                  <small style={{ fontSize: '0.8rem', color: '#666' }}>
                    Find this on the blockchain explorer
                  </small>
                </div>

                <div className="form-group full-width">
                  <label>Expected Destination Address *</label>
                  <input
                    type="text"
                    name="expectedDestination"
                    value={form.expectedDestination}
                    onChange={handleChange}
                    placeholder="Receiver's address (0x..., bc1..., etc.)"
                    required
                    disabled={validating}
                  />
                  <small style={{ fontSize: '0.8rem', color: '#666' }}>
                    Who should have received the funds?
                  </small>
                </div>

                <div className="form-group">
                  <label>Expected Amount *</label>
                  <input
                    type="text"
                    name="expectedAmount"
                    value={form.expectedAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    disabled={validating}
                  />
                  <small style={{ fontSize: '0.8rem', color: '#666' }}>
                    In {form.tokenAsset} units
                  </small>
                </div>

                <div className="form-group">
                  <label>Custom RPC (Optional)</label>
                  <input
                    type="text"
                    name="rpcEndpoint"
                    value={form.rpcEndpoint}
                    onChange={handleChange}
                    placeholder="https://rpc.example.com"
                    disabled={validating}
                  />
                  <small style={{ fontSize: '0.8rem', color: '#666' }}>
                    Override default RPC endpoint
                  </small>
                </div>

                <div className="form-group full-width">
                  <label>Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Add any notes about this validation..."
                    rows="3"
                    disabled={validating}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="auth-button"
                  disabled={validating}
                >
                  {validating ? (
                    <>
                      <span className="spinner-small"></span>
                      Validating Transaction...
                    </>
                  ) : 'Validate Transaction'}
                </button>
              </div>
            </form>
          </div>
        )}

        {page === 'history' && (
          <div className="history-page">
            <h2>Validation History</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Complete history of your transaction validations
            </p>
            
            <div className="table-container">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div className="spinner"></div>
                  <p>Loading validation history...</p>
                </div>
              ) : transactions.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Chain Family</th>
                      <th>Chain</th>
                      <th>Token</th>
                      <th>TX Hash</th>
                      <th>Destination</th>
                      <th>Expected Amount</th>
                      <th>Actual Amount</th>
                      <th>Status</th>
                      <th>Validated At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, index) => (
                      <tr key={tx._id || `history-${index}`}>
                        <td>{tx.chainFamily}</td>
                        <td>{tx.chain}</td>
                        <td>{tx.tokenAsset}</td>
                        <td>
                          <span className="tx-hash" title={tx.txHash}>
                            {truncateText(tx.txHash, 10)}
                          </span>
                        </td>
                        <td title={tx.expectedDestination}>
                          {truncateText(tx.expectedDestination, 8)}
                        </td>
                        <td>{tx.expectedAmount}</td>
                        <td>{tx.actualAmount || 'N/A'}</td>
                        <td>
                          <span className={`status-badge ${tx.status}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td>{formatDate(tx.validatedAt || tx.createdAt)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              style={{ 
                                background: '#e2e8f0', 
                                border: 'none', 
                                padding: '0.25rem 0.5rem', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                              }}
                              onClick={() => handleRevalidate(tx._id)}
                              title="Revalidate"
                              disabled={!tx._id || tx._id.startsWith('mock_')}
                            >
                              🔄
                            </button>
                            {tx.explorerLink && (
                              <button 
                                style={{ 
                                  background: '#e2e8f0', 
                                  border: 'none', 
                                  padding: '0.25rem 0.5rem', 
                                  borderRadius: '4px', 
                                  cursor: 'pointer',
                                  fontSize: '0.9rem'
                                }}
                                onClick={() => window.open(tx.explorerLink, '_blank')}
                                title="View in Explorer"
                              >
                                🔍
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                  <p>No validation history yet.</p>
                  <button 
                    className="auth-button"
                    style={{ marginTop: '1rem' }}
                    onClick={() => setPage('validate')}
                  >
                    Validate First Transaction
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer style={{ 
        textAlign: 'center', 
        padding: '1rem', 
        background: '#f8fafc', 
        borderTop: '1px solid #e2e8f0', 
        marginTop: '2rem',
        fontSize: '0.9rem',
        color: '#718096'
      }}>
        <p>ChainGuard © 2026 - Multi-Chain Transaction Validation Platform</p>
        <p>User: {user?.email} | Validations: {stats.total} | Status: {transactions.length > 0 ? '✅ Active' : '🔄 Ready'}</p>
      </footer>
    </div>
  );
}

export default Dashboard;