const express = require('express');
const router = express.Router();
const validator = require('../../middleware/validators/dnatest');
const controller = require('../../controllers/dnatest');

router.post('/', validator.createDnaTest, controller.createDnaTest);
router.put('/:dna_test_id', validator.updateDnaTest, controller.updateDnaTest);
router.delete('/:dna_test_id', validator.deleteDnaTest, controller.deleteDnaTest);
router.get('/:dna_test_id', validator.getDnaTest, controller.getDnaTest);
router.get('/', validator.listDnaTests, controller.listDnaTests);

module.exports = router;