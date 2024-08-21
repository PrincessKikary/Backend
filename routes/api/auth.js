const express = require('express');
const router = express.Router();
const validators = require('../../middleware/validators/auth');
const controller = require('../../controllers/auth');

router.get('/user', controller.getAuthUser);
router.post('/change-password',validators.changePassword,controller.changePassword);
router.post('/create-account', validators.createAccount, controller.createAccount);
router.post('/login', validators.login, controller.login);

module.exports = router;