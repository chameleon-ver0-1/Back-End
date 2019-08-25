const router = require('express').Router();
const controller = require('./project.controller');

const passport = require('passport');
const passportConf = require('../common/passport');

const passportSignIn = passport.authenticate('local', {session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

/* ROUTING METHOD */
router.post('/create', passportJWT, controller.create);

module.exports = router;