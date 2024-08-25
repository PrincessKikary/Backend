const express = require('express');
const router = express.Router();
const validator = require('../../middleware/validators/document');
const controller = require('../../controllers/document');

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       required:
 *         - person_id
 *         - document_type
 *         - file
 *       properties:
 *         document_id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the document
 *         person_id:
 *           type: string
 *           format: uuid
 *           description: The id of the person associated with this document
 *         document_type:
 *           type: string
 *           description: The type of the document
 *         file_path:
 *           type: string
 *           description: The path where the file is stored
 *         upload_date:
 *           type: string
 *           format: date-time
 *           description: The date and time when the document was uploaded
 *         description:
 *           type: string
 *           description: Additional description of the document
 */

/**
 * @swagger
 * /document:
 *   post:
 *     summary: Upload a new document
 *     tags: [Document]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               person_id:
 *                 type: string
 *                 format: uuid
 *               document_type:
 *                 type: string
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: The document was successfully uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       400:
 *         description: Invalid input or file upload failed
 *       404:
 *         description: Person not found
 */
router.post('/', validator.createDocument, controller.createDocument);

/**
 * @swagger
 * /document/{document_id}:
 *   put:
 *     summary: Update a document
 *     tags: [Document]
 *     parameters:
 *       - in: path
 *         name: document_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The document id
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document_type:
 *                 type: string
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The document was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       400:
 *         description: Invalid input or file upload failed
 *       404:
 *         description: Document not found
 */
router.put('/:document_id', validator.updateDocument, controller.updateDocument);

/**
 * @swagger
 * /document/{document_id}:
 *   delete:
 *     summary: Delete a document
 *     tags: [Document]
 *     parameters:
 *       - in: path
 *         name: document_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The document id
 *     responses:
 *       200:
 *         description: The document was deleted
 *       404:
 *         description: Document not found
 */
router.delete('/:document_id', validator.deleteDocument, controller.deleteDocument);

/**
 * @swagger
 * /document/{document_id}:
 *   get:
 *     summary: Get a document by id
 *     tags: [Document]
 *     parameters:
 *       - in: path
 *         name: document_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The document id
 *     responses:
 *       200:
 *         description: The document details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       404:
 *         description: Document not found
 */
router.get('/:document_id', validator.getDocument, controller.getDocument);

/**
 * @swagger
 * /document:
 *   get:
 *     summary: List documents
 *     tags: [Document]
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
 *         description: Filter documents by person id
 *       - in: query
 *         name: document_type
 *         schema:
 *           type: string
 *         description: Filter documents by type
 *       - in: query
 *         name: upload_date_from
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter documents from this upload date
 *       - in: query
 *         name: upload_date_to
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter documents up to this upload date
 *     responses:
 *       200:
 *         description: The list of documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 total:
 *                   type: integer
 */
router.get('/', validator.listDocuments, controller.listDocuments);

module.exports = router;