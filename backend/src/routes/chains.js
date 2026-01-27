const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { blockchainConfig } = require('../utils/blockchainConfig');

router.get('/', authMiddleware, (req, res) => {
  try {
    // Lista simples de chains
    const families = {
      'Ethereum': ['Ethereum', 'Polygon', 'BSC'],
      'Bitcoin': ['Bitcoin'],
      'Other Chains': ['Tron', 'Celestia', 'Theta', 'Near', 'VeChainThor', 'Ontology'],
    };
    
    res.json({
      success: true,
      data: {
        families: families,
        allChains: ['Ethereum', 'Polygon', 'BSC', 'Bitcoin', 'Tron', 'Celestia', 'Theta', 'Near', 'VeChainThor', 'Ontology'],
      }
    });
  } catch (error) {
    res.json({
      success: true,
      data: {
        families: { 'Demo': ['Ethereum', 'Bitcoin', 'Tron'] },
        allChains: ['Ethereum', 'Bitcoin', 'Tron'],
      }
    });
  }
});

module.exports = router;