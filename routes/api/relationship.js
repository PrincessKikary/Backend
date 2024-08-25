// routes/api/relationship.js
const express = require('express');
const router = express.Router();
const validator = require('../../middleware/validators/relationship');
const controller = require('../../controllers/relationship');

/**
 * @swagger
 * components:
 *   schemas:
 *     Relationship:
 *       type: object
 *       required:
 *         - person1_id
 *         - person2_id
 *         - relationship_type
 *       properties:
 *         relationship_id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the relationship
 *         person1_id:
 *           type: string
 *           format: uuid
 *           description: The id of the first person in the relationship
 *         person2_id:
 *           type: string
 *           format: uuid
 *           description: The id of the second person in the relationship
 *         relationship_type:
 *           type: string
 *           enum: [parent-child, spouse, sibling]
 *           description: The type of the relationship
 *         start_date:
 *           type: string
 *           format: date
 *           description: The start date of the relationship
 *         end_date:
 *           type: string
 *           format: date
 *           description: The end date of the relationship (if applicable)
 */

/**
 * @swagger
 * /relationship:
 *   post:
 *     summary: Create a new relationship
 *     tags: [Relationship]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Relationship'
 *     responses:
 *       201:
 *         description: The relationship was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Relationship'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: One or both persons not found
 */
router.post('/', validator.createRelationship, controller.createRelationship);

/**
 * @swagger
 * /relationship/{relationship_id}:
 *   put:
 *     summary: Update a relationship
 *     tags: [Relationship]
 *     parameters:
 *       - in: path
 *         name: relationship_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The relationship id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Relationship'
 *     responses:
 *       200:
 *         description: The relationship was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Relationship'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Relationship not found
 */
router.put('/:relationship_id', validator.updateRelationship, controller.updateRelationship);

/**
 * @swagger
 * /relationship/{relationship_id}:
 *   delete:
 *     summary: Delete a relationship
 *     tags: [Relationship]
 *     parameters:
 *       - in: path
 *         name: relationship_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The relationship id
 *     responses:
 *       200:
 *         description: The relationship was deleted
 *       404:
 *         description: Relationship not found
 */
router.delete('/:relationship_id', validator.deleteRelationship, controller.deleteRelationship);

/**
 * @swagger
 * /relationship/{relationship_id}:
 *   get:
 *     summary: Get a relationship by id
 *     tags: [Relationship]
 *     parameters:
 *       - in: path
 *         name: relationship_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The relationship id
 *     responses:
 *       200:
 *         description: The relationship details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Relationship'
 *       404:
 *         description: Relationship not found
 */
router.get('/:relationship_id', validator.getRelationship, controller.getRelationship);

/**
 * @swagger
 * /relationship:
 *   get:
 *     summary: List relationships
 *     tags: [Relationship]
 *     parameters:
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: The number of items to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: person_id
 *         schema:
 *           type: string
 *         description: Filter relationships by person id
 *       - in: query
 *         name: relationship_type
 *         schema:
 *           type: string
 *         description: Filter relationships by type
 *       - in: query
 *         name: start_date_from
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter relationships from this start date
 *       - in: query
 *         name: start_date_to
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter relationships up to this start date
 *     responses:
 *       200:
 *         description: The list of relationships
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Relationship'
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 total:
 *                   type: integer
 */
router.get('/', validator.listRelationships, controller.listRelationships);

module.exports = router;