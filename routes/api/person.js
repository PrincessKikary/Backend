const express = require('express');
const router = express.Router();
const validator = require('../../middleware/validators/person');
const controller = require('../../controllers/person');

/**
 * @swagger
 * components:
 *   schemas:
 *     Person:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *       properties:
 *         person_id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the person
 *         first_name:
 *           type: string
 *           description: The person's first name
 *         last_name:
 *           type: string
 *           description: The person's last name
 *         birth_date:
 *           type: string
 *           format: date
 *           description: The person's birth date
 *         death_date:
 *           type: string
 *           format: date
 *           description: The person's death date (if applicable)
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: The person's gender
 *         birth_place:
 *           type: string
 *           description: The person's place of birth
 *         death_place:
 *           type: string
 *           description: The person's place of death (if applicable)
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
 *           enum: [parent, child, spouse, sibling]
 *           description: The type of relationship
 */

/**
 * @swagger
 * /person:
 *   post:
 *     summary: Create a new person
 *     tags: [Person]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Person'
 *     responses:
 *       201:
 *         description: The person was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       400:
 *         description: Invalid input
 */
router.post('/', controller.createPerson);

/**
 * @swagger
 * /person/{person_id}:
 *   put:
 *     summary: Update a person
 *     tags: [Person]
 *     parameters:
 *       - in: path
 *         name: person_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The person id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Person'
 *     responses:
 *       200:
 *         description: The person was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Person not found
 */
router.put('/:person_id', validator.updatePerson, controller.updatePerson);

/**
 * @swagger
 * /person/{person_id}:
 *   delete:
 *     summary: Delete a person
 *     tags: [Person]
 *     parameters:
 *       - in: path
 *         name: person_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The person id
 *     responses:
 *       200:
 *         description: The person was deleted
 *       404:
 *         description: Person not found
 */
router.delete('/:person_id', validator.deletePerson, controller.deletePerson);

/**
 * @swagger
 * /person/{person_id}:
 *   get:
 *     summary: Get a person by id
 *     tags: [Person]
 *     parameters:
 *       - in: path
 *         name: person_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The person id
 *     responses:
 *       200:
 *         description: The person details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       404:
 *         description: Person not found
 */
router.get('/:person_id', validator.getPerson, controller.getPerson);

/**
 * @swagger
 * /person:
 *   get:
 *     summary: List persons
 *     tags: [Person]
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
 *         description: Search persons by name
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female, other]
 *         description: Filter by gender
 *       - in: query
 *         name: birth_date_from
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter persons born from this date
 *       - in: query
 *         name: birth_date_to
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter persons born up to this date
 *     responses:
 *       200:
 *         description: The list of persons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Person'
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 total:
 *                   type: integer
 */
router.get('/', validator.listPersons, controller.listPersons);

/**
 * @swagger
 * /person/relationship:
 *   post:
 *     summary: Add a relationship between two persons
 *     tags: [Person]
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
router.post('/relationship', validator.addRelationship, controller.addRelationship);

module.exports = router;