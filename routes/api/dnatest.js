const express = require('express');
const router = express.Router();
const validator = require('../../middleware/validators/dnatest');
const controller = require('../../controllers/dnatest');

/**
 * @swagger
 * components:
 *   schemas:
 *     DnaTest:
 *       type: object
 *       required:
 *         - person_id
 *         - test_type
 *         - test_date
 *       properties:
 *         dna_test_id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the DNA test
 *         person_id:
 *           type: string
 *           format: uuid
 *           description: The id of the person associated with this DNA test
 *         test_type:
 *           type: string
 *           enum: [autosomal, y-dna, mtdna, x-dna]
 *           description: The type of DNA test
 *         test_date:
 *           type: string
 *           format: date
 *           description: The date when the DNA test was conducted
 *         results:
 *           type: object
 *           description: The results of the DNA test (structure may vary based on test type)
 */

/**
 * @swagger
 * /dnatest:
 *   post:
 *     summary: Create a new DNA test
 *     tags: [DNA Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DnaTest'
 *     responses:
 *       201:
 *         description: The DNA test was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DnaTest'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Person not found
 */
router.post('/', validator.createDnaTest, controller.createDnaTest);

/**
 * @swagger
 * /dnatest/{dna_test_id}:
 *   put:
 *     summary: Update a DNA test
 *     tags: [DNA Test]
 *     parameters:
 *       - in: path
 *         name: dna_test_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The DNA test id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DnaTest'
 *     responses:
 *       200:
 *         description: The DNA test was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DnaTest'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: DNA test not found
 */
router.put('/:dna_test_id', validator.updateDnaTest, controller.updateDnaTest);

/**
 * @swagger
 * /dnatest/{dna_test_id}:
 *   delete:
 *     summary: Delete a DNA test
 *     tags: [DNA Test]
 *     parameters:
 *       - in: path
 *         name: dna_test_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The DNA test id
 *     responses:
 *       200:
 *         description: The DNA test was deleted
 *       404:
 *         description: DNA test not found
 */
router.delete('/:dna_test_id', validator.deleteDnaTest, controller.deleteDnaTest);

/**
 * @swagger
 * /dnatest/{dna_test_id}:
 *   get:
 *     summary: Get a DNA test by id
 *     tags: [DNA Test]
 *     parameters:
 *       - in: path
 *         name: dna_test_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The DNA test id
 *     responses:
 *       200:
 *         description: The DNA test details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DnaTest'
 *       404:
 *         description: DNA test not found
 */
router.get('/:dna_test_id', validator.getDnaTest, controller.getDnaTest);

/**
 * @swagger
 * /dnatest:
 *   get:
 *     summary: List DNA tests
 *     tags: [DNA Test]
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
 *         description: Filter DNA tests by person id
 *       - in: query
 *         name: test_type
 *         schema:
 *           type: string
 *         description: Filter DNA tests by type
 *       - in: query
 *         name: test_date_from
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter DNA tests from this test date
 *       - in: query
 *         name: test_date_to
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter DNA tests up to this test date
 *     responses:
 *       200:
 *         description: The list of DNA tests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DnaTest'
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 total:
 *                   type: integer
 */
router.get('/', validator.listDnaTests, controller.listDnaTests);

module.exports = router;