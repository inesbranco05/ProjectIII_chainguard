const mongoose = require('mongoose');

const ValidationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // INFORMACOES BASICAS
  chainFamily: {
    type: String,
    required: true,
  },
  
  chain: {
    type: String,
    required: true,
    trim: true,
  },
  
  tokenAsset: {
    type: String,
    trim: true,
  },
  
  txHash: {
    type: String,
    required: true,
    trim: true,
  },
  
  // VALORES ESPERADOS
  expectedDestination: {
    type: String,
    required: true,
    trim: true,
  },
  
  expectedAmount: {
    type: String,
    required: true,
    trim: true,
  },
  
  // RESULTADOS
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'error'],
    default: 'pending',
  },
  
  actualDestination: {
    type: String,
    trim: true,
  },
  
  actualAmount: {
    type: String,
    trim: true,
  },
  
  errorMessage: {
    type: String,
    trim: true,
  },
  
  // METADADOS
  validationTime: Number,
  blockNumber: Number,
  blockTimestamp: Date,
  explorerLink: String,
  
  // TIMESTAMPS
  validatedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
ValidationSchema.index({ user: 1, createdAt: -1 });
ValidationSchema.index({ chain: 1, status: 1 });

module.exports = mongoose.model('Validation', ValidationSchema);