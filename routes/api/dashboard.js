const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/dashboard');

// Get overall dashboard summary
router.get('/summary', dashboardController.getDashboardSummary);

// Get person growth rate
router.get('/growth-rate', dashboardController.getPersonGrowthRate);

// Get event distribution
router.get('/event-distribution', dashboardController.getEventDistribution);

// Get family statistics
router.get('/family-statistics/:family_id', dashboardController.getFamilyStatistics);

module.exports = router;