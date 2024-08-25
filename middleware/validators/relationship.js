const { body, param, query } = require('express-validator');
const { reporter, pagination } = require('./common');
const { Relationship, Person } = require('../../database/models');
const { Op } = require('sequelize');

const validateUUID = (value) => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(value);
};

const createRelationship = [
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
    .isISO8601().withMessage('Invalid start date format. Use ISO8601 format (YYYY-MM-DD).')
    .custom(async (value, { req }) => {
      if (req.body.relationship_type === 'parent-child') {
        const child = await Person.findByPk(req.body.person2_id);
        if (child && child.birth_date && new Date(value) > new Date(child.birth_date)) {
          throw new Error('Parent-child relationship start date cannot be after child\'s birth date');
        }
      }
      return true;
    }),

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

const updateRelationship = [
  param('relationship_id')
    .custom(validateUUID).withMessage('Invalid relationship ID format')
    .custom(async (value) => {
      const relationship = await Relationship.findByPk(value);
      if (!relationship) {
        throw new Error('Relationship not found');
      }
      return true;
    }),

  body('relationship_type')
    .optional()
    .isIn(['parent-child', 'spouse', 'sibling']).withMessage('Invalid relationship type'),

  body('start_date')
    .optional({ nullable: true })
    .isISO8601().withMessage('Invalid start date format. Use ISO8601 format (YYYY-MM-DD).')
    .custom(async (value, { req }) => {
      const relationship = await Relationship.findByPk(req.params.relationship_id);
      if (req.body.relationship_type === 'parent-child' || relationship.relationship_type === 'parent-child') {
        const child = await Person.findByPk(relationship.person2_id);
        if (child && child.birth_date && new Date(value) > new Date(child.birth_date)) {
          throw new Error('Parent-child relationship start date cannot be after child\'s birth date');
        }
      }
      return true;
    }),

  body('end_date')
    .optional({ nullable: true })
    .isISO8601().withMessage('Invalid end date format. Use ISO8601 format (YYYY-MM-DD).')
    .custom(async (value, { req }) => {
      const relationship = await Relationship.findByPk(req.params.relationship_id);
      if (relationship.start_date && value < relationship.start_date) {
        throw new Error('End date cannot be earlier than start date');
      }
      return true;
    }),

  reporter,
];

const deleteRelationship = [
  param('relationship_id')
    .custom(validateUUID).withMessage('Invalid relationship ID format')
    .custom(async (value) => {
      const relationship = await Relationship.findByPk(value);
      if (!relationship) {
        throw new Error('Relationship not found');
      }
      return true;
    }),
];

const getRelationship = [
  param('relationship_id')
    .custom(validateUUID).withMessage('Invalid relationship ID format'),
];

const listRelationships = [
  ...pagination,
  query('person_id')
    .optional()
    .custom(validateUUID).withMessage('Invalid person ID format'),
  query('relationship_type')
    .optional()
    .isIn(['parent-child', 'spouse', 'sibling']).withMessage('Invalid relationship type'),
  query('start_date_from')
    .optional()
    .isISO8601().withMessage('Invalid start date format for start_date_from'),
  query('start_date_to')
    .optional()
    .isISO8601().withMessage('Invalid start date format for start_date_to'),
  query('end_date_from')
    .optional()
    .isISO8601().withMessage('Invalid end date format for end_date_from'),
  query('end_date_to')
    .optional()
    .isISO8601().withMessage('Invalid end date format for end_date_to'),
  reporter,
];

module.exports = {
  createRelationship,
  updateRelationship,
  deleteRelationship,
  getRelationship,
  listRelationships,
};