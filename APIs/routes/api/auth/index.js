const router = require('express').Router();
const controller = require('./auth.controller');

const passport = require('passport');

router.post('/register', controller.register);
router.get('/duplicateEmail', controller.duplicateEmail);

// TODO: 로그인 API 구현
router.post('/signIn', controller.signIn);

module.exports = router;