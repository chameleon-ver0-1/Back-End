const router = require('express').Router();
const controller = require('./auth.controller');

router.post('/register', controller.register);
router.post('/duplicateEmail', controller.duplicateEmail);

module.exports = router;