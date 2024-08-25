const express = require('express');
const router = express.Router();
const validator = require('../../middleware/validators/document');
const controller = require('../../controllers/document');

router.post('/', validator.createDocument, controller.createDocument);
router.put('/:document_id', validator.updateDocument, controller.updateDocument);
router.delete('/:document_id', validator.deleteDocument, controller.deleteDocument);
router.get('/:document_id', validator.getDocument, controller.getDocument);
router.get('/', validator.listDocuments, controller.listDocuments);

module.exports = router;