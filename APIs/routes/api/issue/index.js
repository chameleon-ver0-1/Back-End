const router = require('express').Router();
const controller = require('./issue.controller');

const passport = require('passport');
const passportConf = require('../common/passport');

const passportJWT = passport.authenticate('jwt', { session: false });

/* ROUTING METHOD */
router.post('/create', controller.create);
// router.get('/get', passportJWT, controller.getList);
router.get('/get/:id', controller.getComments);
// router.post('/delete/:id', passportJWT, controller.delete);

module.exports = router;