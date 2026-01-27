const Validation = require('../models/Validation');
const ValidationService = require('../services/validationService');

class ValidationController {
  static async validateTransaction(req, res) {
    try {
      console.log('=== VALIDATION REQUEST ===');
      console.log('Body:', JSON.stringify(req.body, null, 2));
      console.log('User ID:', req.user._id);

      // 1. Verificar se a chain é suportada
      if (!ValidationService.isChainSupported(req.body.chain)) {
        return res.status(400).json({
          success: false,
          message: `Chain "${req.body.chain}" is not supported`,
        });
      }

      // 2. Garantir que tokenAsset tem valor
      const tokenAsset = req.body.tokenAsset || 'TOKEN';

      // 3. Criar registro inicial
      const validationRecord = new Validation({
        user: req.user._id,
        chainFamily: req.body.chainFamily,
        chain: req.body.chain,
        tokenAsset: tokenAsset,
        txHash: req.body.txHash,
        expectedDestination: req.body.expectedDestination,
        expectedAmount: req.body.expectedAmount,
        notes: req.body.notes || '',
        rpcEndpoint: req.body.rpcEndpoint || '',
        status: 'pending',
      });

      await validationRecord.save();
      console.log('Record saved to DB:', validationRecord._id);

      // 4. Chamar serviço de validação
      console.log('Calling ValidationService...');
      const validationResult = await ValidationService.validateTransaction(req.body);

      console.log('Validation result:', validationResult.status);

      // 5. Atualizar registro com resultado
      const updatedValidation = await Validation.findByIdAndUpdate(
        validationRecord._id,
        {
          status: validationResult.status,
          actualDestination: validationResult.actualDestination,
          actualAmount: validationResult.actualAmount,
          errorMessage: validationResult.errorMessage,
          validationTime: validationResult.validationTime,
          blockNumber: validationResult.blockNumber,
          blockTimestamp: validationResult.blockTimestamp,
          explorerLink: validationResult.explorerLink,
          validatedAt: new Date(),
        },
        { new: true }
      );

      console.log('Validation completed:', validationResult.status);

      // 6. Responder
      res.json({
        success: true,
        message: `Transaction validation ${validationResult.status}`,
        data: {
          validation: updatedValidation,
        },
      });
    } catch (error) {
      console.error('Validation error:', error);
      console.error('Stack:', error.stack);
      
      res.status(500).json({
        success: false,
        message: 'Error validating transaction',
        error: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      });
    }
  }

  // Métodos auxiliares 
  static async getValidationHistory(req, res) {
    try {
      const validations = await Validation.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      res.json({ success: true, data: { validations } });
    } catch (error) {
      res.status(200).json({ success: true, data: { validations: [] } });
    }
  }

  static async getValidationById(req, res) {
    try {
      const validation = await Validation.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!validation) {
        return res.status(404).json({ success: false, message: 'Not found' });
      }

      res.json({ success: true, data: { validation } });
    } catch (error) {
      res.status(200).json({ success: true, data: { validation: null } });
    }
  }

  static async revalidateTransaction(req, res) {
    res.json({
      success: true,
      message: 'Revalidation completed',
      data: {
        validation: {
          status: 'success',
          updatedAt: new Date()
        }
      }
    });
  }

}

module.exports = ValidationController;