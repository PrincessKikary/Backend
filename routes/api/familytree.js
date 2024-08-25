const express = require('express');
const router = express.Router();
const familyTreeController = require('../../controllers/familytree');

/**
 * @swagger
 * components:
 *   schemas:
 *     PersonWithRelations:
 *       type: object
 *       properties:
 *         person_id:
 *           type: string
 *           format: uuid
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         birth_date:
 *           type: string
 *           format: date
 *         relationships:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               relationship_type:
 *                 type: string
 *               related_person:
 *                 $ref: '#/components/schemas/Person'
 *     FamilyTreeNode:
 *       type: object
 *       properties:
 *         person_id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         birth_date:
 *           type: string
 *           format: date
 *         children:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FamilyTreeNode'
 *     AncestorNode:
 *       type: object
 *       properties:
 *         person_id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         birth_date:
 *           type: string
 *           format: date
 *         parents:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AncestorNode'
 *     DescendantNode:
 *       type: object
 *       properties:
 *         person_id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         birth_date:
 *           type: string
 *           format: date
 *         children:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DescendantNode'
 */

/**
 * @swagger
 * /familytree/person/{person_id}:
 *   get:
 *     summary: Get a person with all their relations
 *     tags: [Family Tree]
 *     parameters:
 *       - in: path
 *         name: person_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The person id
 *     responses:
 *       200:
 *         description: The person details with all relations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PersonWithRelations'
 *       404:
 *         description: Person not found
 */
router.get('/person/:person_id', familyTreeController.getPersonWithRelations);

/**
 * @swagger
 * /familytree/family/{family_id}:
 *   get:
 *     summary: Get a family tree
 *     tags: [Family Tree]
 *     parameters:
 *       - in: path
 *         name: family_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The family id
 *       - in: query
 *         name: depth
 *         schema:
 *           type: integer
 *         description: The depth of the family tree to retrieve (default is 3)
 *     responses:
 *       200:
 *         description: The family tree
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FamilyTreeNode'
 *       404:
 *         description: Family not found
 */
router.get('/family/:family_id', familyTreeController.getFamilyTree);

/**
 * @swagger
 * /familytree/ancestors/{person_id}:
 *   get:
 *     summary: Get ancestors of a person
 *     tags: [Family Tree]
 *     parameters:
 *       - in: path
 *         name: person_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The person id
 *       - in: query
 *         name: generations
 *         schema:
 *           type: integer
 *         description: The number of generations to retrieve (default is 3)
 *     responses:
 *       200:
 *         description: The ancestors of the person
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AncestorNode'
 *       404:
 *         description: Person not found
 */
router.get('/ancestors/:person_id', familyTreeController.getAncestors);

/**
 * @swagger
 * /familytree/descendants/{person_id}:
 *   get:
 *     summary: Get descendants of a person
 *     tags: [Family Tree]
 *     parameters:
 *       - in: path
 *         name: person_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The person id
 *       - in: query
 *         name: generations
 *         schema:
 *           type: integer
 *         description: The number of generations to retrieve (default is 3)
 *     responses:
 *       200:
 *         description: The descendants of the person
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DescendantNode'
 *       404:
 *         description: Person not found
 */
router.get('/descendants/:person_id', familyTreeController.getDescendants);

module.exports = router;