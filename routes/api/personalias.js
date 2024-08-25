const express = require('express');
const router = express.Router();
const validator = require('../../middleware/validators/personalias');
const controller = require('../../controllers/personalias');

/**
 * @swagger
 * components:
 *   schemas:
 *     PersonAlias:
 *       type: object
 *       required:
 *         - person_id
 *         - alias_name
 *       properties:
 *         alias_id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the person alias
 *         person_id:
 *           type: string
 *           format: uuid
 *           description: The id of the person associated with this alias
 *         alias_name:
 *           type: string
 *           description: The alias name
 *         alias_type:
 *           type: string
 *           enum: [nickname, maiden_name, married_name, other]
 *           description: The type of the alias
 */

/**
 * @swagger
 * /personalias:
 *   post:
 *     summary: Create a new person alias
 *     tags: [Person Alias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PersonAlias'
 *     responses:
 *       201:
 *         description: The person alias was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PersonAlias'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Person not found
 */
router.post('/', validator.createPersonAlias, controller.createPersonAlias);

/**
 * @swagger
 * /personalias/{alias_id}:
 *   put:
 *     summary: Update a person alias
 *     tags: [Person Alias]
 *     parameters:
 *       - in: path
 *         name: alias_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The person alias id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PersonAlias'
 *     responses:
 *       200:
 *         description: The person alias was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PersonAlias'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Person alias not found
 */
router.put('/:alias_id', validator.updatePersonAlias, controller.updatePersonAlias);

/**
 * @swagger
 * /personalias/{alias_id}:
 *   delete:
 *     summary: Delete a person alias
 *     tags: [Person Alias]
 *     parameters:
 *       - in: path
 *         name: alias_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The person alias id
 *     responses:
 *       200:
 *         description: The person alias was deleted
 *       404:
 *         description: Person alias not found
 */
router.delete('/:alias_id', validator.deletePersonAlias, controller.deletePersonAlias);

/**
 * @swagger
 * /personalias/{alias_id}:
 *   get:
 *     summary: Get a person alias by id
 *     tags: [Person Alias]
 *     parameters:
 *       - in: path
 *         name: alias_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The person alias id
 *     responses:
 *       200:
 *         description: The person alias details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PersonAlias'
 *       404:
 *         description: Person alias not found
 */
router.get('/:alias_id', validator.getPersonAlias, controller.getPersonAlias);

/**
 * @swagger
 * /personalias:
 *   get:
 *     summary: List person aliases
 *     tags: [Person Alias]
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
 *         description: Filter aliases by person id
 *       - in: query
 *         name: alias_type
 *         schema:
 *           type: string
 *         description: Filter aliases by type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search aliases by name
 *     responses:
 *       200:
 *         description: The list of person aliases
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PersonAlias'
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 total:
 *                   type: integer
 */
router.get('/', validator.listPersonAliases, controller.listPersonAliases);

module.exports = router;