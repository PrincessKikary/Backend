const { body, param, query } = require('express-validator');
const { reporter, pagination } = require('./common');
const { DnaTest, Person } = require('../../database/models');
const { Op } = require('sequelize');

const validateUUID = (value) => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(value);
};

const allowedTestTypes = ['autosomal', 'y-dna', 'mtdna', 'x-dna'];

const createDnaTest = [
  body('person_id')
    .custom(validateUUID).withMessage('Invalid person ID format')
    .custom(async (value) => {
      const person = await Person.findByPk(value);
      if (!person) {
        throw new Error('Person not found');
      }
      return true;
    }),

  body('test_type')
    .trim()
    .notEmpty().withMessage('Test type is required')
    .isIn(allowedTestTypes).withMessage('Invalid test type. Allowed types are: ' + allowedTestTypes.join(', ')),

  body('test_date')
    .notEmpty().withMessage('Test date is required')
    .isISO8601().withMessage('Invalid test date format. Use ISO8601 format (YYYY-MM-DD).')
    .custom(async (value, { req }) => {
      const person = await Person.findByPk(req.body.person_id);
      if (person && person.birth_date) {
        const testDate = new Date(value);
        const birthDate = new Date(person.birth_date);
        if (testDate < birthDate) {
          throw new Error('Test date cannot be earlier than the person\'s birth date');
        }
      }
      const currentDate = new Date();
      if (new Date(value) > currentDate) {
        throw new Error('Test date cannot be in the future');
      }
      return true;
    }),

  body('results')
    .isObject().withMessage('Results must be a valid JSON object')
    .custom((value) => {
      // Add specific validations for the results object structure
      if (!value.haplogroup && !value.ethnicityEstimates && !value.geneticMatches) {
        throw new Error('Results must include at least one of: haplogroup, ethnicityEstimates, or geneticMatches');
      }
      return true;
    }),

  reporter,
];

const updateDnaTest = [
  param('dna_test_id')
    .custom(validateUUID).withMessage('Invalid DNA test ID format')
    .custom(async (value) => {
      const dnaTest = await DnaTest.findByPk(value);
      if (!dnaTest) {
        throw new Error('DNA test not found');
      }
      return true;
    }),

  body('test_type')
    .optional()
    .trim()
    .isIn(allowedTestTypes).withMessage('Invalid test type. Allowed types are: ' + allowedTestTypes.join(', ')),

  body('test_date')
    .optional()
    .isISO8601().withMessage('Invalid test date format. Use ISO8601 format (YYYY-MM-DD).')
    .custom(async (value, { req }) => {
      const dnaTest = await DnaTest.findByPk(req.params.dna_test_id);
      const person = await Person.findByPk(dnaTest.person_id);
      if (person && person.birth_date) {
        const testDate = new Date(value);
        const birthDate = new Date(person.birth_date);
        if (testDate < birthDate) {
          throw new Error('Test date cannot be earlier than the person\'s birth date');
        }
      }
      const currentDate = new Date();
      if (new Date(value) > currentDate) {
        throw new Error('Test date cannot be in the future');
      }
      return true;
    }),

  body('results')
    .optional()
    .isObject().withMessage('Results must be a valid JSON object')
    .custom((value) => {
      // Add specific validations for the results object structure
      if (!value.haplogroup && !value.ethnicityEstimates && !value.geneticMatches) {
        throw new Error('Results must include at least one of: haplogroup, ethnicityEstimates, or geneticMatches');
      }
      return true;
    }),

  reporter,
];

const deleteDnaTest = [
  param('dna_test_id')
    .custom(validateUUID).withMessage('Invalid DNA test ID format')
    .custom(async (value) => {
      const dnaTest = await DnaTest.findByPk(value);
      if (!dnaTest) {
        throw new Error('DNA test not found');
      }
      return true;
    }),
];

const getDnaTest = [
  param('dna_test_id')
    .custom(validateUUID).withMessage('Invalid DNA test ID format'),
];

const listDnaTests = [
  ...pagination,
  query('person_id')
    .optional()
    .custom(validateUUID).withMessage('Invalid person ID format'),
  query('test_type')
    .optional()
    .isIn(allowedTestTypes).withMessage('Invalid test type. Allowed types are: ' + allowedTestTypes.join(', ')),
  query('test_date_from')
    .optional()
    .isISO8601().withMessage('Invalid date format for test_date_from'),
  query('test_date_to')
    .optional()
    .isISO8601().withMessage('Invalid date format for test_date_to'),
  reporter,
];

module.exports = {
  createDnaTest,
  updateDnaTest,
  deleteDnaTest,
  getDnaTest,
  listDnaTests,
};