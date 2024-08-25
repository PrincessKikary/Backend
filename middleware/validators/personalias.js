const { body, param, query } = require('express-validator');
const { reporter, pagination } = require('./common');
const { PersonAlias, Person } = require('../../database/models');
const { Op } = require('sequelize');

const validateUUID = (value) => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(value);
};

const allowedAliasTypes = ['nickname', 'maiden_name', 'married_name', 'legal_name', 'other'];

const createPersonAlias = [
  body('person_id')
    .custom(validateUUID).withMessage('Invalid person ID format')
    .custom(async (value) => {
      const person = await Person.findByPk(value);
      if (!person) {
        throw new Error('Person not found');
      }
      return true;
    }),

  body('alias_name')
    .trim()
    .notEmpty().withMessage('Alias name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Alias name must be between 2 and 100 characters long')
    .custom(async (value, { req }) => {
      const existingAlias = await PersonAlias.findOne({
        where: {
          person_id: req.body.person_id,
          alias_name: value
        }
      });
      if (existingAlias) {
        throw new Error('This alias name already exists for this person');
      }
      return true;
    }),

  body('alias_type')
    .optional()
    .trim()
    .isIn(allowedAliasTypes).withMessage('Invalid alias type. Allowed types are: ' + allowedAliasTypes.join(', ')),

  reporter,
];

const updatePersonAlias = [
  param('alias_id')
    .custom(validateUUID).withMessage('Invalid alias ID format')
    .custom(async (value) => {
      const alias = await PersonAlias.findByPk(value);
      if (!alias) {
        throw new Error('Alias not found');
      }
      return true;
    }),

  body('alias_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Alias name must be between 2 and 100 characters long')
    .custom(async (value, { req }) => {
      const alias = await PersonAlias.findByPk(req.params.alias_id);
      const existingAlias = await PersonAlias.findOne({
        where: {
          person_id: alias.person_id,
          alias_name: value,
          alias_id: { [Op.ne]: req.params.alias_id }
        }
      });
      if (existingAlias) {
        throw new Error('This alias name already exists for this person');
      }
      return true;
    }),

  body('alias_type')
    .optional()
    .trim()
    .isIn(allowedAliasTypes).withMessage('Invalid alias type. Allowed types are: ' + allowedAliasTypes.join(', ')),

  reporter,
];

const deletePersonAlias = [
  param('alias_id')
    .custom(validateUUID).withMessage('Invalid alias ID format')
    .custom(async (value) => {
      const alias = await PersonAlias.findByPk(value);
      if (!alias) {
        throw new Error('Alias not found');
      }
      return true;
    }),
];

const getPersonAlias = [
  param('alias_id')
    .custom(validateUUID).withMessage('Invalid alias ID format'),
];

const listPersonAliases = [
  ...pagination,
  query('person_id')
    .optional()
    .custom(validateUUID).withMessage('Invalid person ID format'),
  query('alias_type')
    .optional()
    .isIn(allowedAliasTypes).withMessage('Invalid alias type. Allowed types are: ' + allowedAliasTypes.join(', ')),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Search term must be at least 2 characters long'),
  reporter,
];

module.exports = {
  createPersonAlias,
  updatePersonAlias,
  deletePersonAlias,
  getPersonAlias,
  listPersonAliases,
};