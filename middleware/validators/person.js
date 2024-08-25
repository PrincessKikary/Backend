const { body, param, query } = require('express-validator');
const { reporter, pagination } = require('./common');
const { Person, Family } = require('../../database/models');
const { Op } = require('sequelize');

const validateUUID = (value) => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(value);
};

const createPerson = [
  body('first_name')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters long'),

  body('last_name')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters long'),

  body('birth_date')
    .optional({ nullable: true })
    .isISO8601().withMessage('Invalid birth date format. Use ISO8601 format (YYYY-MM-DD).')
    .custom((value) => {
      const birthDate = new Date(value);
      const currentDate = new Date();
      if (birthDate > currentDate) {
        throw new Error('Birth date cannot be in the future');
      }
      return true;
    }),

  body('death_date')
    .optional({ nullable: true })
    .isISO8601().withMessage('Invalid death date format. Use ISO8601 format (YYYY-MM-DD).')
    .custom((value, { req }) => {
      const deathDate = new Date(value);
      const birthDate = new Date(req.body.birth_date);
      const currentDate = new Date();
      if (deathDate > currentDate) {
        throw new Error('Death date cannot be in the future');
      }
      if (birthDate && deathDate < birthDate) {
        throw new Error('Death date cannot be earlier than birth date');
      }
      return true;
    }),

  body('gender')
    .optional({ nullable: true })
    .isIn(['male', 'female', 'other']).withMessage('Invalid gender. Must be male, female, or other.'),

  body('birth_place')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Birth place must not exceed 100 characters'),

  body('death_place')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Death place must not exceed 100 characters'),

  body('family_ids')
    .optional()
    .isArray().withMessage('Family IDs must be an array')
    .custom(async (value) => {
      if (value && value.length > 0) {
        for (const id of value) {
          if (!validateUUID(id)) {
            throw new Error(`Invalid family ID format: ${id}`);
          }
          const family = await Family.findByPk(id);
          if (!family) {
            throw new Error(`Family with ID ${id} not found`);
          }
        }
      }
      return true;
    }),

  reporter,
];

const updatePerson = [
  param('person_id')
    .custom(validateUUID).withMessage('Invalid person ID format')
    .custom(async (value) => {
      const person = await Person.findByPk(value);
      if (!person) {
        throw new Error('Person not found');
      }
      return true;
    }),
  ...createPerson.filter(validator => validator.fields[0] !== 'first_name' && validator.fields[0] !== 'last_name'),
  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters long'),
  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters long'),
];

const deletePerson = [
  param('person_id')
    .custom(validateUUID).withMessage('Invalid person ID format')
    .custom(async (value) => {
      const person = await Person.findByPk(value);
      if (!person) {
        throw new Error('Person not found');
      }
      return true;
    }),
];

const getPerson = [
  param('person_id')
    .custom(validateUUID).withMessage('Invalid person ID format'),
];

const listPersons = [
  ...pagination,
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Search term must be at least 2 characters long'),
  query('sort_by')
    .optional()
    .isIn(['first_name', 'last_name', 'birth_date', 'death_date']).withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['ASC', 'DESC']).withMessage('Invalid sort order'),
  query('gender')
    .optional()
    .isIn(['male', 'female', 'other']).withMessage('Invalid gender filter'),
  query('birth_date_from')
    .optional()
    .isISO8601().withMessage('Invalid birth date format for birth_date_from'),
  query('birth_date_to')
    .optional()
    .isISO8601().withMessage('Invalid birth date format for birth_date_to'),
  reporter,
];

const addRelationship = [
  body('person1_id')
    .custom(validateUUID).withMessage('Invalid person1 ID format')
    .custom(async (value) => {
      const person = await Person.findByPk(value);
      if (!person) {
        throw new Error('Person1 not found');
      }
      return true;
    }),
  body('person2_id')
    .custom(validateUUID).withMessage('Invalid person2 ID format')
    .custom(async (value, { req }) => {
      if (value === req.body.person1_id) {
        throw new Error('A person cannot have a relationship with themselves');
      }
      const person = await Person.findByPk(value);
      if (!person) {
        throw new Error('Person2 not found');
      }
      return true;
    }),
  body('relationship_type')
    .isIn(['parent-child', 'spouse', 'sibling']).withMessage('Invalid relationship type'),
  body('start_date')
    .optional({ nullable: true })
    .isISO8601().withMessage('Invalid start date format. Use ISO8601 format (YYYY-MM-DD).'),
  body('end_date')
    .optional({ nullable: true })
    .isISO8601().withMessage('Invalid end date format. Use ISO8601 format (YYYY-MM-DD).')
    .custom((value, { req }) => {
      if (req.body.start_date && value < req.body.start_date) {
        throw new Error('End date cannot be earlier than start date');
      }
      return true;
    }),
  reporter,
];

module.exports = {
  createPerson,
  updatePerson,
  deletePerson,
  getPerson,
  listPersons,
  addRelationship,
};