const BaseValidator = require('./BaseValidator');
const { ethers } = require('ethers');
const Web3Providers = require('../web3/providers');

class EVMValidator extends BaseValidator {
  static async validate(validationData) {
    try {
      const provider = Web3Providers.getEVMProvider(validationData.chain);
      
      // Obter transação
      const tx = await provider.getTransaction(validationData.txHash);
      
      if (!tx) {
        throw new Error('Transaction not found');
      }

      // Obter receipt para verificar se foi confirmada
      const receipt = await provider.getTransactionReceipt(validationData.txHash);
      
      if (!receipt) {
        throw new Error('Transaction receipt not found (may be pending)');
      }

      // Obter bloco para timestamp
      const block = await provider.getBlock(receipt.blockNumber);
      
      // Para tokens ERC-20, precisamos analisar os logs
      let actualDestination = tx.to;
      let actualAmount = ethers.formatEther(tx.value);
      
      if (validationData.tokenAsset && validationData.tokenAsset !== 'ETH') {
        // Procurar por transferência de token nos logs
        const transferEvent = receipt.logs.find(log => {
          try {
            // Tópico 0 da transferência ERC-20
            const transferTopic = ethers.id('Transfer(address,address,uint256)');
            return log.topics[0] === transferTopic;
          } catch (error) {
            return false;
          }
        });
        
        if (transferEvent) {
          actualDestination = ethers.getAddress('0x' + transferEvent.topics[2].slice(26));
          
        
          const amount = ethers.toBigInt(transferEvent.data);
          // Assumir 18 decimais para tokens padrão
          actualAmount = ethers.formatUnits(amount, 18);
        }
      }

      // Comparar resultados
      const addressMatch = this.prototype.compareAddresses(
        validationData.expectedDestination,
        actualDestination
      );
      
      const amountMatch = this.prototype.compareAmounts(
        validationData.expectedAmount,
        actualAmount
      );

      const status = addressMatch && amountMatch ? 'success' : 'failed';
      
      const explorerLink = this.prototype.generateExplorerLink(
        validationData.chain,
        validationData.txHash
      );

      return {
        status,
        actualDestination,
        actualAmount,
        errorMessage: status === 'failed' 
          ? this.getErrorMessage(addressMatch, amountMatch)
          : null,
        blockNumber: receipt.blockNumber,
        blockTimestamp: new Date(block.timestamp * 1000),
        explorerLink,
      };
    } catch (error) {
      throw new Error(`EVM validation failed: ${error.message}`);
    }
  }

  static getErrorMessage(addressMatch, amountMatch) {
    if (!addressMatch && !amountMatch) {
      return 'Destination address and amount do not match';
    } else if (!addressMatch) {
      return 'Destination address does not match';
    } else if (!amountMatch) {
      return 'Amount does not match';
    }
    return null;
  }
}

module.exports = EVMValidator;