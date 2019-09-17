const router = require('express').Router();
const controller = require('./project.controller');

const passport = require('passport');
const passportConf = require('../common/passport');

const passportJWT = passport.authenticate('jwt', { session: false });

/* ROUTING METHOD */
router.post('/create', passportJWT, controller.create);
router.post('/participantCheck', passportJWT, controller.participantCheck);
router.get('/list', passportJWT, controller.list);
router.get('/roleList/:projectId', passportJWT, controller.roleList);
router.get('/firstCheck/:projectId', passportJWT, controller.firstCheck);
router.post('/participate/:projectId', passportJWT, controller.participate);
router.get('/refuse/:projectId', passportJWT, controller.refuse);
module.exports = router;