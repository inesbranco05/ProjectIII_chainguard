const EVMValidator = require('./validators/EVMValidator');
const BitcoinValidator = require('./validators/BitcoinValidator');
const SolanaValidator = require('./validators/SolanaValidator');
const ExplorerAPIValidator = require('./validators/ExplorerAPIValidator'); // NOVO
const logger = require('../utils/logger');

class ValidationService {
  static async validateTransaction(validationData) {
    const startTime = Date.now();
    
    try {
      let result;
      const { chainFamily, chain } = validationData;
      
      console.log(`ValidationService: Processing ${chain} (${chainFamily})`);
      
      
      if (chainFamily === 'Bitcoin' || chainFamily === 'UTXO / BRC-20 Ordinals') {
        console.log(`Using BitcoinValidator for ${chain}`);
        result = await BitcoinValidator.validate(validationData);
      }
      else if (chainFamily === 'Solana') {
        console.log(`Using SolanaValidator for ${chain}`);
        result = await SolanaValidator.validate(validationData);
      }
      else {
        // PARA TODAS AS OUTRAS CHAINS: Usar ExplorerAPIValidator
        console.log(`Using ExplorerAPIValidator for ${chain} (${chainFamily})`);
        result = await ExplorerAPIValidator.validate(validationData);
      }
      
      const validationTime = Date.now() - startTime;
      
      logger.info(`Validation completed for tx ${validationData.txHash}`, {
        chain: validationData.chain,
        status: result.status,
        time: validationTime,
      });
      
      return {
        ...result,
        validationTime,
      };
      
    } catch (error) {
      const validationTime = Date.now() - startTime;
      
      logger.error(`Validation failed for tx ${validationData.txHash}`, {
        chain: validationData.chain,
        error: error.message,
        time: validationTime,
      });
      
      console.log(`Primary validation failed, trying ExplorerAPIValidator fallback`);
      try {
        const fallbackResult = await ExplorerAPIValidator.validate(validationData);
        return {
          ...fallbackResult,
          validationTime,
        };
      } catch (fallbackError) {
        // Último recurso: mock
        console.log(`All validators failed, using mock`);
        return {
          status: 'error',
          actualDestination: validationData.expectedDestination,
          actualAmount: validationData.expectedAmount,
          errorMessage: `All validation methods failed: ${error.message}`,
          validationTime,
          blockNumber: null,
          blockTimestamp: new Date(),
          explorerLink: ExplorerAPIValidator.generateExplorerLink(validationData.chain, validationData.txHash),
        };
      }
    }
  }
  
  static async getSupportedChains() {
    return [
      {
        family: 'Ethereum',
        chains: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism', 'Avalanche'],
      },
      {
        family: 'Bitcoin',
        chains: ['Bitcoin'],
      },
      {
        family: 'Solana',
        chains: ['Solana'],
      },
      
      {
        family: 'Theta Network',
        chains: ['Theta'],
      },
      {
        family: 'EVM-compatible',
        chains: ['Bittensor', 'Solar', 'Vana', 'Wanchain'],
      },
      {
        family: 'Cosmos SDK',
        chains: ['Celestia', 'Neutron', 'Osmosis', 'Oraichain'],
      },
      {
        family: 'Tron (DPoS)',
        chains: ['Tron'],
      },
      {
        family: 'Near Protocol',
        chains: ['Near'],
      },
      {
        family: 'VeChainThor (non-EVM)',
        chains: ['VeChainThor'],
      },
      {
        family: 'Ontology',
        chains: ['Ontology'],
      },
      {
        family: 'Custom L1',
        chains: ['Nillion'],
      },
      {
        family: 'UTXO / BRC-20 Ordinals',
        chains: ['Bitcoin'],
      },
    ];
  }

  static isChainSupported(chain) {
    const supportedChains = [
      'Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism', 'Avalanche',
      'Bitcoin', 'Solana',

      'Bittensor', 'Theta', 'Solar', 'Vana', 'Wanchain',
      'Celestia', 'Neutron', 'Osmosis', 'Oraichain',
      'Tron', 'Near', 'VeChainThor', 'Ontology', 'Nillion'
    ];
    
    return supportedChains.includes(chain);
  }

  static getRecommendedValidator(chain) {
    const validatorMap = {
      'Bitcoin': 'BitcoinValidator',
      'Solana': 'SolanaValidator',
      // Todas as outras usam ExplorerAPIValidator
    };
    
    return validatorMap[chain] || 'ExplorerAPIValidator';
  }
}

module.exports = ValidationService;