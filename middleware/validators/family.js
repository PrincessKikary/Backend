const { body, param, query } = require('express-validator');
const { reporter, pagination } = require('./common');
const { Family, Person, User } = require('../../database/models');
const { Op } = require('sequelize');

const validateUUID = (value) => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(value);
};

const createFamily = [
  body('family_name')
    .trim()
    .notEmpty().withMessage('Family name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Family name must be between 2 and 100 characters long')
    .custom(async (value) => {
      const existingFamily = await Family.findOne({ where: { family_name: value } });
      if (existingFamily) {
        throw new Error('This family name already exists');
      }
      return true;
    }),

  body('created_by')
    .notEmpty().withMessage('User ID is required')
    .custom(validateUUID).withMessage('Invalid User ID format')
    .custom(async (value) => {
      const user = await User.findByPk(value);
      if (!user) {
        throw new Error('User not found');
      }
      return true;
    }),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

  body('founding_date')
    .optional()
    .isISO8601().withMessage('Invalid founding date format. Use ISO8601 format (YYYY-MM-DD).')
    .custom((value) => {
      const foundingDate = new Date(value);
      const currentDate = new Date();
      if (foundingDate > currentDate) {
        throw new Error('Founding date cannot be in the future');
      }
      return true;
    }),

  body('person_ids')
    .optional()
    .isArray().withMessage('Person IDs must be an array')
    .custom(async (value) => {
      if (value && value.length > 0) {
        for (const id of value) {
          if (!validateUUID(id)) {
            throw new Error(`Invalid person ID format: ${id}`);
          }
          const person = await Person.findByPk(id);
          if (!person) {
            throw new Error(`Person with ID ${id} not found`);
          }
        }
      }
      return true;
    }),

  reporter,
];

const getUserFamilies = [
  param('user_id')
    .notEmpty().withMessage('User ID is required')
    .custom(validateUUID).withMessage('Invalid user ID format')
    .custom(async (value) => {
      const user = await User.findByPk(value);
      if (!user) {
        throw new Error('User not found');
      }
      return true;
    }),
];

const updateFamily = [
  param('family_id')
    .custom(validateUUID).withMessage('Invalid family ID format')
    .custom(async (value) => {
      const family = await Family.findByPk(value);
      if (!family) {
        throw new Error('Family not found');
      }
      return true;
    }),

  body('family_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Family name must be between 2 and 100 characters long')
    .custom(async (value, { req }) => {
      const existingFamily = await Family.findOne({
        where: {
          family_name: value,
          family_id: { [Op.ne]: req.params.family_id }
        }
      });
      if (existingFamily) {
        throw new Error('This family name already exists');
      }
      return true;
    }),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

  body('founding_date')
    .optional()
    .isISO8601().withMessage('Invalid founding date format. Use ISO8601 format (YYYY-MM-DD).')
    .custom((value) => {
      const foundingDate = new Date(value);
      const currentDate = new Date();
      if (foundingDate > currentDate) {
        throw new Error('Founding date cannot be in the future');
      }
      return true;
    }),

  body('person_ids')
    .optional()
    .isArray().withMessage('Person IDs must be an array')
    .custom(async (value) => {
      if (value && value.length > 0) {
        for (const id of value) {
          if (!validateUUID(id)) {
            throw new Error(`Invalid person ID format: ${id}`);
          }
          const person = await Person.findByPk(id);
          if (!person) {
            throw new Error(`Person with ID ${id} not found`);
          }
        }
      }
      return true;
    }),

  reporter,
];

const deleteFamily = [
  param('family_id')
    .custom(validateUUID).withMessage('Invalid family ID format')
    .custom(async (value) => {
      const family = await Family.findByPk(value);
      if (!family) {
        throw new Error('Family not found');
      }
      return true;
    }),
];

const getFamily = [
  param('family_id')
    .custom(validateUUID).withMessage('Invalid family ID format'),
];

const listFamilies = [
  ...pagination,
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Search term must be at least 2 characters long'),
  query('sort_by')
    .optional()
    .isIn(['family_name', 'founding_date']).withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['ASC', 'DESC']).withMessage('Invalid sort order'),
  query('founding_date_from')
    .optional()
    .isISO8601().withMessage('Invalid date format for founding_date_from'),
  query('founding_date_to')
    .optional()
    .isISO8601().withMessage('Invalid date format for founding_date_to'),
  reporter,
];

const addPersonToFamily = [
  param('family_id')
    .custom(validateUUID).withMessage('Invalid family ID format')
    .custom(async (value) => {
      const family = await Family.findByPk(value);
      if (!family) {
        throw new Error('Family not found');
      }
      return true;
    }),

  body('person_id')
    .custom(validateUUID).withMessage('Invalid person ID format')
    .custom(async (value, { req }) => {
      const person = await Person.findByPk(value);
      if (!person) {
        throw new Error('Person not found');
      }
      const family = await Family.findByPk(req.params.family_id);
      const isAlreadyMember = await family.hasPerson(person);
      if (isAlreadyMember) {
        throw new Error('This person is already a member of the family');
      }
      return true;
    }),

  reporter,
];

const removePersonFromFamily = [
  param('family_id')
    .custom(validateUUID).withMessage('Invalid family ID format')
    .custom(async (value) => {
      const family = await Family.findByPk(value);
      if (!family) {
        throw new Error('Family not found');
      }
      return true;
    }),

  param('person_id')
    .custom(validateUUID).withMessage('Invalid person ID format')
    .custom(async (value, { req }) => {
      const person = await Person.findByPk(value);
      if (!person) {
        throw new Error('Person not found');
      }
      const family = await Family.findByPk(req.params.family_id);
      const isMember = await family.hasPerson(person);
      if (!isMember) {
        throw new Error('This person is not a member of the family');
      }
      return true;
    }),

  reporter,
];

module.exports = {
  createFamily,
  getUserFamilies,
  updateFamily,
  deleteFamily,
  getFamily,
  listFamilies,
  addPersonToFamily,
  removePersonFromFamily,
};