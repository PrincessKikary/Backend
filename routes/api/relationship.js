const express = require('express');
const router = express.Router();
const validator = require('../../middleware/validators/relationship');
const controller = require('../../controllers/relationship');

router.post('/', validator.createRelationship, controller.createRelationship);
router.put('/:relationship_id', validator.updateRelationship, controller.updateRelationship);
router.delete('/:relationship_id', validator.deleteRelationship, controller.deleteRelationship);
router.get('/:relationship_id', validator.getRelationship, controller.getRelationship);
router.get('/', validator.listRelationships, controller.listRelationships);

module.exports = router;