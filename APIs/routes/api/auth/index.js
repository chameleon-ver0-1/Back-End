const router = require('express').Router();
const controller = require('./auth.controller');

router.post('/register', controller.register);
router.get('/duplicateEmail', controller.duplicateEmail);

module.exports = router;