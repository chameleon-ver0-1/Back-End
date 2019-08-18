const router = require('express').Router();
const controller = require('./auth.controller');

const passport = require('passport');
const passportConf = require('../common/passport');

const passportSignIn = passport.authenticate('local', {session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

/* ROUTING METHOD */
router.post('/join', controller.join);
router.post('/signIn', passportSignIn, controller.signIn);

// test
router.post('/register', passportJWT, controller.register);



module.exports = router;