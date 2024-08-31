const express = require('express');
const router = express.Router();
const validator = require('../../middleware/validators/family');
const controller = require('../../controllers/family');

/**
 * @swagger
 * components:
 *   schemas:
 *     Family:
 *       type: object
 *       required:
 *         - family_name
 *         - created_by
 *       properties:
 *         family_id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the family
 *         family_name:
 *           type: string
 *           description: The name of the family
 *         created_by:
 *           type: string
 *           format: uuid
 *           description: The id of the User who created the family
 *         description:
 *           type: string
 *           description: A description of the family
 *         founding_date:
 *           type: string
 *           format: date
 *           description: The founding date of the family
 */

/**
 * @swagger
 * /family:
 *   post:
 *     summary: Create a new family
 *     tags: [Family]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Family'
 *     responses:
 *       201:
 *         description: The family was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Family'
 *       400:
 *         description: Invalid input
 */
router.post('/', validator.createFamily, controller.createFamily);

/**
 * @swagger
 * /family/{family_id}:
 *   put:
 *     summary: Update a family
 *     tags: [Family]
 *     parameters:
 *       - in: path
 *         name: family_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The family id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Family'
 *     responses:
 *       200:
 *         description: The family was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Family'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Family not found
 */
router.put('/:family_id', validator.updateFamily, controller.updateFamily);

/**
 * @swagger
 * /family/{family_id}:
 *   delete:
 *     summary: Delete a family
 *     tags: [Family]
 *     parameters:
 *       - in: path
 *         name: family_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The family id
 *     responses:
 *       200:
 *         description: The family was deleted
 *       404:
 *         description: Family not found
 */
router.delete('/:family_id', validator.deleteFamily, controller.deleteFamily);

/**
 * @swagger
 * /family/{family_id}:
 *   get:
 *     summary: Get a family by id
 *     tags: [Family]
 *     parameters:
 *       - in: path
 *         name: family_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The family id
 *     responses:
 *       200:
 *         description: The family details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Family'
 *       404:
 *         description: Family not found
 */
router.get('/:family_id', validator.getFamily, controller.getFamily);

/**
 * @swagger
 * /family:
 *   get:
 *     summary: List families
 *     tags: [Family]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search families by name
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: The list of families
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Family'
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 total:
 *                   type: integer
 */
router.get('/', validator.listFamilies, controller.listFamilies);

/**
 * @swagger
 * /family/{family_id}/members:
 *   post:
 *     summary: Add a person to a family
 *     tags: [Family]
 *     parameters:
 *       - in: path
 *         name: family_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The family id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - person_id
 *             properties:
 *               person_id:
 *                 type: string
 *                 format: uuid
 *                 description: The id of the person to add to the family
 *     responses:
 *       200:
 *         description: The person was added to the family
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Family or person not found
 */
router.post('/:family_id/members', validator.addPersonToFamily, controller.addPersonToFamily);

/**
 * @swagger
 * /family/{family_id}/members/{person_id}:
 *   delete:
 *     summary: Remove a person from a family
 *     tags: [Family]
 *     parameters:
 *       - in: path
 *         name: family_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The family id
 *       - in: path
 *         name: person_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The person id
 *     responses:
 *       200:
 *         description: The person was removed from the family
 *       404:
 *         description: Family or person not found
 */
router.delete('/:family_id/members/:person_id', validator.removePersonFromFamily, controller.removePersonFromFamily);

module.exports = router;