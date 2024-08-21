const { body } = require('express-validator');
const { reporter } = require('./common');
const { User } = require('../../database/models');

const createAccount = [
  body('fullName')
    .notEmpty()
    .withMessage('The full name field is required')
    .trim(),
  body('email')
    .optional({ values: 'null' })
    .trim()
    .notEmpty().withMessage('Email is required')
    .if(body('email').notEmpty())
    .isEmail().withMessage('Invalid email address'),

  body('photo')
    .optional({ values: 'null' })
    .isURL()
    .withMessage('Invalid photo'),

  body('phone')
    .trim()
    .matches(/^0\d{9}$/)
    .notEmpty().withMessage('Phone is required')
    .if(body('phone').notEmpty())
    .isMobilePhone().withMessage('Invalid phone number'),

  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .custom(async (value) => {
      const user = await User.findOne({ where: { username: value } });
      if (user) {
        throw new Error('Username already exists');
      }
    }),
   body('password')
   .trim()
   .notEmpty().withMessage('The password field is required')
   .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
   ,
  reporter,
];

const login = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  reporter,
];

const changePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('The current password field is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('The new password field is required')
    .bail()
    .custom(async (value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password cannot be the same as current password');
      }
    }),
  reporter,
];


module.exports = { createAccount, login, changePassword };
