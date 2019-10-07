const router = require('express').Router();
const controller = require('./chat.controller');

const passport = require('passport');
const passportConf = require('../common/passport');
const passportJWT = passport.authenticate('jwt', { session: false });


/* ROUTING METHOD */
router.get('/:projectId', passportJWT, controller.memberList);


module.exports = router;