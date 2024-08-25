const { body, param, query } = require('express-validator');
const { reporter, pagination } = require('./common');
const { Event, Person } = require('../../database/models');
const { Op } = require('sequelize');

const validateUUID = (value) => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(value);
};

const createEvent = [
  body('person_id')
    .custom(validateUUID).withMessage('Invalid person ID format')
    .custom(async (value) => {
      const person = await Person.findByPk(value);
      if (!person) {
        throw new Error('Person not found');
      }
      return true;
    }),

  body('event_type')
    .trim()
    .notEmpty().withMessage('Event type is required')
    .isLength({ max: 50 }).withMessage('Event type must not exceed 50 characters'),

  body('event_date')
    .notEmpty().withMessage('Event date is required')
    .isISO8601().withMessage('Invalid event date format. Use ISO8601 format (YYYY-MM-DD).')
    .custom(async (value, { req }) => {
      const person = await Person.findByPk(req.body.person_id);
      if (person) {
        if (person.birth_date && new Date(value) < new Date(person.birth_date)) {
          throw new Error('Event date cannot be earlier than the person\'s birth date');
        }
        if (person.death_date && new Date(value) > new Date(person.death_date)) {
          throw new Error('Event date cannot be later than the person\'s death date');
        }
      }
      return true;
    }),

  body('event_place')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Event place must not exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),

  reporter,
];

const updateEvent = [
  param('event_id')
    .custom(validateUUID).withMessage('Invalid event ID format')
    .custom(async (value) => {
      const event = await Event.findByPk(value);
      if (!event) {
        throw new Error('Event not found');
      }
      return true;
    }),

  body('event_type')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Event type must not exceed 50 characters'),

  body('event_date')
    .optional()
    .isISO8601().withMessage('Invalid event date format. Use ISO8601 format (YYYY-MM-DD).')
    .custom(async (value, { req }) => {
      const event = await Event.findByPk(req.params.event_id);
      const person = await Person.findByPk(event.person_id);
      if (person) {
        if (person.birth_date && new Date(value) < new Date(person.birth_date)) {
          throw new Error('Event date cannot be earlier than the person\'s birth date');
        }
        if (person.death_date && new Date(value) > new Date(person.death_date)) {
          throw new Error('Event date cannot be later than the person\'s death date');
        }
      }
      return true;
    }),

  body('event_place')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Event place must not exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),

  reporter,
];

const deleteEvent = [
  param('event_id')
    .custom(validateUUID).withMessage('Invalid event ID format')
    .custom(async (value) => {
      const event = await Event.findByPk(value);
      if (!event) {
        throw new Error('Event not found');
      }
      return true;
    }),
];

const getEvent = [
  param('event_id')
    .custom(validateUUID).withMessage('Invalid event ID format'),
];

const listEvents = [
  ...pagination,
  query('person_id')
    .optional()
    .custom(validateUUID).withMessage('Invalid person ID format'),
  query('event_type')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Event type must not exceed 50 characters'),
  query('date_from')
    .optional()
    .isISO8601().withMessage('Invalid date format for date_from'),
  query('date_to')
    .optional()
    .isISO8601().withMessage('Invalid date format for date_to'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Search term must be at least 2 characters long'),
  reporter,
];

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvent,
  listEvents,
};