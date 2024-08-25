// routes/api/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/dashboard');

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardSummary:
 *       type: object
 *       properties:
 *         totalPersons:
 *           type: integer
 *         totalFamilies:
 *           type: integer
 *         totalRelationships:
 *           type: integer
 *         totalEvents:
 *           type: integer
 *         totalDocuments:
 *           type: integer
 *         totalDnaTests:
 *           type: integer
 *         genderDistribution:
 *           type: object
 *           properties:
 *             male:
 *               type: integer
 *             female:
 *               type: integer
 *             other:
 *               type: integer
 *         ageDistribution:
 *           type: object
 *           properties:
 *             '0-18':
 *               type: integer
 *             '19-30':
 *               type: integer
 *             '31-50':
 *               type: integer
 *             '51-70':
 *               type: integer
 *             '71+':
 *               type: integer
 *     GrowthRate:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *         count:
 *           type: integer
 *     EventDistribution:
 *       type: object
 *       properties:
 *         event_type:
 *           type: string
 *         count:
 *           type: integer
 *     FamilyStatistics:
 *       type: object
 *       properties:
 *         family_name:
 *           type: string
 *         memberCount:
 *           type: integer
 *         oldestMember:
 *           type: string
 *         youngestMember:
 *           type: string
 *         genderDistribution:
 *           $ref: '#/components/schemas/DashboardSummary/properties/genderDistribution'
 *         ageDistribution:
 *           $ref: '#/components/schemas/DashboardSummary/properties/ageDistribution'
 */

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get overall dashboard summary
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard summary data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardSummary'
 */
router.get('/summary', dashboardController.getDashboardSummary);

/**
 * @swagger
 * /dashboard/growth-rate:
 *   get:
 *     summary: Get person growth rate
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the growth rate calculation
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the growth rate calculation
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *         description: Interval for the growth rate calculation
 *     responses:
 *       200:
 *         description: Person growth rate data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GrowthRate'
 */
router.get('/growth-rate', dashboardController.getPersonGrowthRate);

/**
 * @swagger
 * /dashboard/event-distribution:
 *   get:
 *     summary: Get event distribution
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Event distribution data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventDistribution'
 */
router.get('/event-distribution', dashboardController.getEventDistribution);

/**
 * @swagger
 * /dashboard/family-statistics/{family_id}:
 *   get:
 *     summary: Get family statistics
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: family_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The family id
 *     responses:
 *       200:
 *         description: Family statistics data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FamilyStatistics'
 *       404:
 *         description: Family not found
 */
router.get('/family-statistics/:family_id', dashboardController.getFamilyStatistics);

module.exports = router;