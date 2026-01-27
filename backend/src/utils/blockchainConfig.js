const blockchainConfig = {
  // APENAS AS ESSENCIAIS
  ethereum: {
    name: 'Ethereum',
    family: 'Ethereum',
    nativeToken: 'ETH',
    decimals: 18,
    rpcUrl: 'https://eth.llamarpc.com', 
    explorer: 'https://etherscan.io',
    chainId: 1,
  },
  polygon: {
    name: 'Polygon',
    family: 'Ethereum',
    nativeToken: 'MATIC',
    decimals: 18,
    rpcUrl: 'https://polygon.llamarpc.com', 
    explorer: 'https://polygonscan.com',
    chainId: 137,
  },
  bsc: {
    name: 'Binance Smart Chain',
    family: 'Ethereum',
    nativeToken: 'BNB',
    decimals: 18,
    rpcUrl: 'https://bsc-dataseed.binance.org/', 
    explorer: 'https://bscscan.com',
    chainId: 56,
  },
  bitcoin: {
    name: 'Bitcoin',
    family: 'Bitcoin',
    nativeToken: 'BTC',
    decimals: 8,
    explorer: 'https://blockchair.com/bitcoin',
  },
  tron: {
    name: 'Tron',
    family: 'Other Chains',
    nativeToken: 'TRX',
    decimals: 6,
    explorer: 'https://tronscan.org',
  },
  celestia: {
    name: 'Celestia',
    family: 'Other Chains',
    nativeToken: 'TIA',
    decimals: 6,
    explorer: 'https://celestia.explorers.guru',
  },
  theta: {
    name: 'Theta',
    family: 'Other Chains',
    nativeToken: 'THETA',
    decimals: 18,
    explorer: 'https://explorer.thetatoken.org',
  },
};

const getChainConfig = (chainName) => {
  const key = chainName.toLowerCase();
  return blockchainConfig[key] || {
    name: chainName,
    family: 'Other Chains',
    nativeToken: 'TOKEN',
    decimals: 18,
  };
};

module.exports = { blockchainConfig, getChainConfig };