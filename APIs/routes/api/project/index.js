const router = require('express').Router();
const controller = require('./project.controller');

const passport = require('passport');
const passportConf = require('../common/passport');

const passportJWT = passport.authenticate('jwt', { session: false });

/* ROUTING METHOD */
router.post('/create', passportJWT, controller.create);
router.post('/emailCheck', passportJWT, controller.emailCheck);
router.get('/list', passportJWT, controller.list);

module.exports = router;