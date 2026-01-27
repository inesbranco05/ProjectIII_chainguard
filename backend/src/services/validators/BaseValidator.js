class BaseValidator {
  constructor() {
    if (new.target === BaseValidator) {
      throw new Error('BaseValidator is abstract and cannot be instantiated directly');
    }
  }

  async validate(validationData) {
    throw new Error('Method "validate" must be implemented');
  }

  normalizeAddress(address) {
    if (!address) return null;
    
    // Remove espaços e converter para lowercase
    return address.trim().toLowerCase();
  }

  compareAddresses(expected, actual) {
    if (!expected || !actual) return false;
    
    const normalizedExpected = this.normalizeAddress(expected);
    const normalizedActual = this.normalizeAddress(actual);
    
    return normalizedExpected === normalizedActual;
  }

  compareAmounts(expected, actual, decimals = 18) {
    try {
      // Converter para BigInt para comparação precisa
      const expectedBig = BigInt(Math.floor(parseFloat(expected) * (10 ** decimals)));
      const actualBig = BigInt(Math.floor(parseFloat(actual) * (10 ** decimals)));
      
      return expectedBig === actualBig;
    } catch (error) {
      // Fallback para comparação de strings
      return expected.toString() === actual.toString();
    }
  }

  generateExplorerLink(chain, txHash) {
    const explorers = {
      ethereum: `https://etherscan.io/tx/${txHash}`,
      polygon: `https://polygonscan.com/tx/${txHash}`,
      bsc: `https://bscscan.com/tx/${txHash}`,
      arbitrum: `https://arbiscan.io/tx/${txHash}`,
      optimism: `https://optimistic.etherscan.io/tx/${txHash}`,
      avalanche: `https://snowtrace.io/tx/${txHash}`,
      solana: `https://solscan.io/tx/${txHash}`,
      bitcoin: `https://blockchair.com/bitcoin/transaction/${txHash}`,
    };

    const chainKey = chain.toLowerCase();
    return explorers[chainKey] || `https://explorer.${chain}.io/tx/${txHash}`;
  }
}

module.exports = BaseValidator;