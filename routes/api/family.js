const express = require('express');
const router = express.Router();
const validator = require('../../middleware/validators/family');
const controller = require('../../controllers/family');

router.post('/', validator.createFamily, controller.createFamily);
router.put('/:family_id', validator.updateFamily, controller.updateFamily);
router.delete('/:family_id', validator.deleteFamily, controller.deleteFamily);
router.get('/:family_id', validator.getFamily, controller.getFamily);
router.get('/', validator.listFamilies, controller.listFamilies);
router.post('/:family_id/members', validator.addPersonToFamily, controller.addPersonToFamily);
router.delete('/:family_id/members/:person_id', validator.removePersonFromFamily, controller.removePersonFromFamily);

module.exports = router;