const Validation = require('../models/Validation');

class StatsController {
  static async getOverallStats(req, res) {
    try {
      const userId = req.user._id;

      // Total de validações
      const totalValidations = await Validation.countDocuments({ user: userId });

      // Validações por status
      const successCount = await Validation.countDocuments({
        user: userId,
        status: 'success',
      });
      
      const failedCount = await Validation.countDocuments({
        user: userId,
        status: 'failed',
      });

      // Success rate
      const successRate = totalValidations > 0 
        ? (successCount / totalValidations * 100).toFixed(1)
        : 0;

      res.json({
        success: true,
        data: {
          overall: {
            totalValidations,
            successCount,
            failedCount,
            successRate: parseFloat(successRate),
          },
        },
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching statistics',
        error: error.message,
      });
    }
  }
  

}

module.exports = StatsController;