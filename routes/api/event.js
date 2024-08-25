const express = require('express');
const router = express.Router();
const validator = require('../../middleware/validators/event');
const controller = require('../../controllers/event');

router.post('/', validator.createEvent, controller.createEvent);
router.put('/:event_id', validator.updateEvent, controller.updateEvent);
router.delete('/:event_id', validator.deleteEvent, controller.deleteEvent);
router.get('/:event_id', validator.getEvent, controller.getEvent);
router.get('/', validator.listEvents, controller.listEvents);

module.exports = router;