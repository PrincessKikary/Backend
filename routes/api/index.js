const express  = require('express');
const personRouters = require('./person');
const relationshipRoutes = require('./relationship');
const eventRouters = require('./event');
const documentRouters = require('./document');
const dnatestRouters = require('./dnatest');
const personaliasRoutes = require('./personalias');
const familyRouters = require('./family');


const router = express.Router();


router.use('/person', personRouters);
router.use('/relationship', relationshipRoutes);
router.use('/event', eventRouters);
router.use('/document', documentRouters);
router.use('/dnatest', dnatestRouters);
router.use('/personalias', personaliasRoutes);
router.use('/family', familyRouters);

module.exports = router;