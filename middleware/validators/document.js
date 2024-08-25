const { body, param, query } = require('express-validator');
const { reporter, pagination } = require('./common');
const { Document, Person } = require('../../database/models');
const { Op } = require('sequelize');
const path = require('path');

const validateUUID = (value) => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(value);
};

const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
const maxFileSize = 5 * 1024 * 1024; // 5 MB

const createDocument = [
  body('person_id')
    .custom(validateUUID).withMessage('Invalid person ID format')
    .custom(async (value) => {
      const person = await Person.findByPk(value);
      if (!person) {
        throw new Error('Person not found');
      }
      return true;
    }),

  body('document_type')
    .trim()
    .notEmpty().withMessage('Document type is required')
    .isLength({ max: 50 }).withMessage('Document type must not exceed 50 characters'),

  body('upload_date')
    .optional()
    .isISO8601().withMessage('Invalid upload date format. Use ISO8601 format (YYYY-MM-DD).')
    .custom((value) => {
      const uploadDate = new Date(value);
      const currentDate = new Date();
      if (uploadDate > currentDate) {
        throw new Error('Upload date cannot be in the future');
      }
      return true;
    }),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),

  body('file')
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error('File is required');
      }
      if (!allowedFileTypes.includes(req.file.mimetype)) {
        throw new Error('Invalid file type. Allowed types are JPEG, PNG, PDF, and plain text');
      }
      if (req.file.size > maxFileSize) {
        throw new Error('File size exceeds the maximum limit of 5 MB');
      }
      return true;
    }),

  reporter,
];

const updateDocument = [
  param('document_id')
    .custom(validateUUID).withMessage('Invalid document ID format')
    .custom(async (value) => {
      const document = await Document.findByPk(value);
      if (!document) {
        throw new Error('Document not found');
      }
      return true;
    }),

  body('document_type')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Document type must not exceed 50 characters'),

  body('upload_date')
    .optional()
    .isISO8601().withMessage('Invalid upload date format. Use ISO8601 format (YYYY-MM-DD).')
    .custom((value) => {
      const uploadDate = new Date(value);
      const currentDate = new Date();
      if (uploadDate > currentDate) {
        throw new Error('Upload date cannot be in the future');
      }
      return true;
    }),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),

  body('file')
    .optional()
    .custom((value, { req }) => {
      if (req.file) {
        if (!allowedFileTypes.includes(req.file.mimetype)) {
          throw new Error('Invalid file type. Allowed types are JPEG, PNG, PDF, and plain text');
        }
        if (req.file.size > maxFileSize) {
          throw new Error('File size exceeds the maximum limit of 5 MB');
        }
      }
      return true;
    }),

  reporter,
];

const deleteDocument = [
  param('document_id')
    .custom(validateUUID).withMessage('Invalid document ID format')
    .custom(async (value) => {
      const document = await Document.findByPk(value);
      if (!document) {
        throw new Error('Document not found');
      }
      return true;
    }),
];

const getDocument = [
  param('document_id')
    .custom(validateUUID).withMessage('Invalid document ID format'),
];

const listDocuments = [
  ...pagination,
  query('person_id')
    .optional()
    .custom(validateUUID).withMessage('Invalid person ID format'),
  query('document_type')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Document type must not exceed 50 characters'),
  query('upload_date_from')
    .optional()
    .isISO8601().withMessage('Invalid date format for upload_date_from'),
  query('upload_date_to')
    .optional()
    .isISO8601().withMessage('Invalid date format for upload_date_to'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Search term must be at least 2 characters long'),
  reporter,
];

module.exports = {
  createDocument,
  updateDocument,
  deleteDocument,
  getDocument,
  listDocuments,
};