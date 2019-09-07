const router = require('express').Router();
const controller = require('./project.controller');

const passport = require('passport');
const passportConf = require('../common/passport');

const passportJWT = passport.authenticate('jwt', { session: false });

/* ROUTING METHOD */
router.post('/create', passportJWT, controller.create);
router.post('/participantCheck', passportJWT, controller.participantCheck);
router.get('/list', passportJWT, controller.list);
router.post('/roleList', passportJWT, controller.roleList);
router.post('/firstCheck', passportJWT, controller.firstCheck);
router.post('/participate', passportJWT, controller.participate);
router.post('/refuse', passportJWT, controller.refuse);
module.exports = router;