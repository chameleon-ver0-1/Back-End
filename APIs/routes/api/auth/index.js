const router = require('express').Router();
const controller = require('./auth.controller');
const auth = require('./auth');

// const passport = require('passport');

router.post('/signIn', controller.signIn);

router.post('/register', auth.isAuthenticated(), controller.register);

module.exports = router;