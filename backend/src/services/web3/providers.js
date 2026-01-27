const { ethers } = require('ethers');

class Web3Providers {
  static async getEVMProvider(chain = 'ethereum') {
    // RPCs QUE FUNCIONAM
    const rpcMap = {
      'ethereum': 'https://eth.llamarpc.com',
      'polygon': 'https://polygon.llamarpc.com',
      'bsc': 'https://bsc-dataseed.binance.org/',
      'arbitrum': 'https://arbitrum.llamarpc.com',
      'optimism': 'https://optimism.llamarpc.com',
    };
    
    const rpcUrl = rpcMap[chain.toLowerCase()] || rpcMap.ethereum;
    
    try {
      return new ethers.JsonRpcProvider(rpcUrl);
    } catch (error) {
      console.error(`Failed to create provider: ${error.message}`);
      throw error;
    }
  }
}

module.exports = Web3Providers;