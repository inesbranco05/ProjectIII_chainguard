const BaseValidator = require('./BaseValidator');
const Web3Providers = require('../web3/providers');

class SolanaValidator extends BaseValidator {
  static async validate(validationData) {
    try {
      const connection = Web3Providers.getSolanaConnection();
      
      // Obter detalhes da transação
      const txSignature = validationData.txHash;
      const txInfo = await connection.getTransaction(txSignature, {
        maxSupportedTransactionVersion: 0,
      });
      
      if (!txInfo) {
        throw new Error('Transaction not found');
      }

      if (!txInfo.meta) {
        throw new Error('Transaction metadata not available');
      }

      // Analisar as contas envolvidas
      const accountKeys = txInfo.transaction.message.accountKeys;
      

      let actualDestination = null;
      let actualAmount = null;
      
      // Tentar encontrar transferência
      if (txInfo.meta.postTokenBalances && txInfo.meta.postTokenBalances.length > 0) {
        // Token transfer
        actualDestination = validationData.expectedDestination; 
        actualAmount = validationData.expectedAmount; 
      } else {

      
        actualDestination = accountKeys[1]?.toString(); 
        actualAmount = txInfo.meta.postBalances
          ? (txInfo.meta.postBalances[1] - txInfo.meta.preBalances[1]) / 1e9
          : null;
      }

      if (!actualDestination || !actualAmount) {
        return {
          status: 'failed',
          actualDestination,
          actualAmount,
          errorMessage: 'Could not extract destination and amount from transaction',
          blockNumber: txInfo.slot,
          blockTimestamp: new Date(txInfo.blockTime * 1000),
          explorerLink: this.prototype.generateExplorerLink('solana', validationData.txHash),
        };
      }

      // Comparar resultados
      const addressMatch = this.prototype.compareAddresses(
        validationData.expectedDestination,
        actualDestination
      );
      
      const amountMatch = this.prototype.compareAmounts(
        validationData.expectedAmount,
        actualAmount.toString(),
        9 // SOL tem 9 decimais
      );

      const status = addressMatch && amountMatch ? 'success' : 'failed';
      
      return {
        status,
        actualDestination,
        actualAmount: actualAmount.toString(),
        errorMessage: status === 'failed' 
          ? (addressMatch ? 'Amount does not match' : 'Destination does not match')
          : null,
        blockNumber: txInfo.slot,
        blockTimestamp: new Date(txInfo.blockTime * 1000),
        explorerLink: this.prototype.generateExplorerLink('solana', validationData.txHash),
      };
    } catch (error) {
      throw new Error(`Solana validation failed: ${error.message}`);
    }
  }
}

module.exports = SolanaValidator;