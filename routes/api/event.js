// routes/api/event.js
const express = require('express');
const router = express.Router();
const validator = require('../../middleware/validators/event');
const controller = require('../../controllers/event');

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - person_id
 *         - event_type
 *         - event_date
 *       properties:
 *         event_id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the event
 *         person_id:
 *           type: string
 *           format: uuid
 *           description: The id of the person associated with this event
 *         event_type:
 *           type: string
 *           description: The type of the event
 *         event_date:
 *           type: string
 *           format: date
 *           description: The date of the event
 *         event_place:
 *           type: string
 *           description: The place where the event occurred
 *         description:
 *           type: string
 *           description: Additional description of the event
 */

/**
 * @swagger
 * /event:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: The event was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Person not found
 */
router.post('/', validator.createEvent, controller.createEvent);

/**
 * @swagger
 * /event/{event_id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: event_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The event id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: The event was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Event not found
 */
router.put('/:event_id', validator.updateEvent, controller.updateEvent);

/**
 * @swagger
 * /event/{event_id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: event_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The event id
 *     responses:
 *       200:
 *         description: The event was deleted
 *       404:
 *         description: Event not found
 */
router.delete('/:event_id', validator.deleteEvent, controller.deleteEvent);

/**
 * @swagger
 * /event/{event_id}:
 *   get:
 *     summary: Get an event by id
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: event_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The event id
 *     responses:
 *       200:
 *         description: The event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 */
router.get('/:event_id', validator.getEvent, controller.getEvent);

/**
 * @swagger
 * /event:
 *   get:
 *     summary: List events
 *     tags: [Events]
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
 *         description: Filter events by person id
 *       - in: query
 *         name: event_type
 *         schema:
 *           type: string
 *         description: Filter events by type
 *       - in: query
 *         name: date_from
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter events from this date
 *       - in: query
 *         name: date_to
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter events up to this date
 *     responses:
 *       200:
 *         description: The list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 total:
 *                   type: integer
 */
router.get('/', validator.listEvents, controller.listEvents);

module.exports = router;