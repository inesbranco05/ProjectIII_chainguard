const express = require('express');
const router = express.Router();
const ValidationController = require('../controllers/validationController');
const { authMiddleware } = require('../middleware/auth');
const { validateTransaction } = require('../middleware/validation');


router.post('/', authMiddleware, validateTransaction, ValidationController.validateTransaction);


router.get('/', authMiddleware, ValidationController.getValidationHistory);


router.get('/:id', authMiddleware, ValidationController.getValidationById);


router.post('/:id/revalidate', authMiddleware, ValidationController.revalidateTransaction);



module.exports = router;