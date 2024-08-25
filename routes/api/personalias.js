const express = require('express');
const router = express.Router();
const validator = require('../../middleware/validators/personalias');
const controller = require('../../controllers/personalias');

router.post('/', validator.createPersonAlias, controller.createPersonAlias);
router.put('/:alias_id', validator.updatePersonAlias, controller.updatePersonAlias);
router.delete('/:alias_id', validator.deletePersonAlias, controller.deletePersonAlias);
router.get('/:alias_id', validator.getPersonAlias, controller.getPersonAlias);
router.get('/', validator.listPersonAliases, controller.listPersonAliases);

module.exports = router;