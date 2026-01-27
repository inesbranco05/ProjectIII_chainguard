
const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};


const formatAddress = (address, chars = 6) => {
  if (!address || address.length < chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};


const formatAmount = (amount, decimals = 6) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  
  // Use maximum of specified decimals
  const fixed = num.toFixed(decimals);
  // Remove trailing zeros
  return parseFloat(fixed).toString();
};


const calculateSuccessRate = (success, total) => {
  if (total === 0) return 0;
  return Math.round((success / total) * 10000) / 100; // 2 decimal places
};


const isValidEthereumAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};


const isValidBitcoinAddress = (address) => {
  // Basic validation - in production use proper library
  return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) || 
         /^bc1[ac-hj-np-z02-9]{11,71}$/.test(address);
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const sanitizeForLog = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = { ...obj };
  const sensitiveFields = ['password', 'token', 'secret', 'privateKey', 'mnemonic'];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });
  
  return sanitized;
};

const parseErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

module.exports = {
  generateRandomString,
  formatAddress,
  formatAmount,
  calculateSuccessRate,
  isValidEthereumAddress,
  isValidBitcoinAddress,
  delay,
  sanitizeForLog,
  parseErrorMessage,
};