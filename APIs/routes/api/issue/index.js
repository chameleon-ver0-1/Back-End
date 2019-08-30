const router = require('express').Router();
const controller = require('./project.controller');

const passport = require('passport');
const passportConf = require('../common/passport');

const passportJWT = passport.authenticate('jwt', { session: false });

/* ROUTING METHOD */
router.post('/create', passportJWT, controller.create);
router.get('/get', passportJWT, controller.getList);
router.get('/get/:id', passportJWT, controller.getOne);
router.post('/delete/:id', passportJWT, controller.delete);

module.exports = router;