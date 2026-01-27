const { body, validationResult } = require('express-validator');

const validateTransaction = [
 body('chainFamily')
  .notEmpty().withMessage('Chain family is required')
  .isIn([
    'Ethereum',
    'Bitcoin',
    'Solana', 
    'Theta Network',
    'EVM-compatible',
    'Cosmos SDK',
    'Tron (DPoS)',
    'Near Protocol',
    'VeChainThor (non-EVM)',
    'Ontology',
    'Custom L1',
    'UTXO / BRC-20 Ordinals'
  ]).withMessage('Invalid chain family'),
  
  body('chain')
    .notEmpty().withMessage('Chain is required')
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Chain name must be 1-50 characters'),
  
  body('txHash')
    .notEmpty().withMessage('Transaction hash is required')
    .trim()
    .isLength({ min: 10 }).withMessage('Transaction hash is too short'),
  
  body('expectedDestination')
    .notEmpty().withMessage('Expected destination is required')
    .trim(),
  
  body('expectedAmount')
    .notEmpty().withMessage('Expected amount is required')
    .trim(),
  
  body('tokenAsset')
    .optional({ checkFalsy: true })
    .trim(),
  
  body('rpcEndpoint')
    .optional({ checkFalsy: true })
    .isURL().withMessage('RPC endpoint must be a valid URL'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  }
];

const validateUser = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  }
];

module.exports = { validateTransaction, validateUser };