const express = require('express');
const router = express.Router();
const validator = require('../../middleware/validators/person');
const controller = require('../../controllers/person');

router.post('/', validator.createPerson, controller.createPerson);
router.put('/:person_id', validator.updatePerson, controller.updatePerson);
router.delete('/:person_id', validator.deletePerson, controller.deletePerson);
router.get('/:person_id', validator.getPerson, controller.getPerson);
router.get('/', validator.listPersons, controller.listPersons);
router.post('/relationship', validator.addRelationship, controller.addRelationship);

module.exports = router;