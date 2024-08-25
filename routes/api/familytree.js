const express = require('express');
const router = express.Router();
const familyTreeController = require('../../controllers/familytree');

// Get a person with all their relations
router.get('/person/:person_id', familyTreeController.getPersonWithRelations);

// Get a family tree
router.get('/family/:family_id', familyTreeController.getFamilyTree);

// Get ancestors of a person
router.get('/ancestors/:person_id', familyTreeController.getAncestors);

// Get descendants of a person
router.get('/descendants/:person_id', familyTreeController.getDescendants);

module.exports = router;