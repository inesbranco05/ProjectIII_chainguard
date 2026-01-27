const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/statsController');
const { authMiddleware } = require('../middleware/auth');

router.get('/overall', authMiddleware, StatsController.getOverallStats);


module.exports = router;