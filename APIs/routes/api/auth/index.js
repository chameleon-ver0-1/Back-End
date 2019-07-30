const router = require('express').Router();
const controller = require('./auth.controller');

const passport = require('passport');
// const passportConf = require('../../../lib/passportJWT'); // TODO: 사용되지 않음 -> 확인
const passportSignIn = passport.authenticate('local', {session: false });

router.post('/register', controller.register);
router.get('/duplicateEmail', controller.duplicateEmail);

// FIXME: 양식 통일 -> jwt 테스트
router.post('/signin', controller.signIn);

module.exports = router;