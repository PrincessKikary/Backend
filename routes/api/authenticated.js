const express = require('express');
const router = express.Router();
const { getAuthenticatedUser } = require('../../controllers/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthenticatedUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         fullName:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *         status:
 *           type: string
 */

/**
 * @swagger
 * /authenticated/user:
 *   get:
 *     summary: Get authenticated user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved authenticated user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   $ref: '#/components/schemas/AuthenticatedUser'
 *       401:
 *         description: Unauthorized - User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
router.get('/user', getAuthenticatedUser);

module.exports = router;