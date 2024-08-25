const express = require('express');
const router = express.Router();

const personRouters = require('./person');
const relationshipRoutes = require('./relationship');
const eventRouters = require('./event');
const documentRouters = require('./document');
const dnatestRouters = require('./dnatest');
const personaliasRoutes = require('./personalias');
const familyRouters = require('./family');
const familyTreeRoutes = require('./familytree');
const dashboardRoutes = require('./dashboard');
const authUserRoutes = require('./authenticated');

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Dashboard operations
 *   - name: Person
 *     description: Person operations
 *   - name: Relationship
 *     description: Relationship operations
 *   - name: Event
 *     description: Event operations
 *   - name: Document
 *     description: Document operations
 *   - name: DNA Test
 *     description: DNA Test operations
 *   - name: Person Alias
 *     description: Person Alias operations
 *   - name: Family
 *     description: Family operations
 *   - name: Family Tree
 *     description: Family Tree operations
 *   - name: Authentication
 *     description: Authentication user operations
 */

router.use('/dashboard', dashboardRoutes);
router.use('/person', personRouters);
router.use('/relationship', relationshipRoutes);
router.use('/event', eventRouters);
router.use('/document', documentRouters);
router.use('/dnatest', dnatestRouters);
router.use('/personalias', personaliasRoutes);
router.use('/family', familyRouters);
router.use('/familytree', familyTreeRoutes);
router.use('/authenticated', authUserRoutes);

module.exports = router;