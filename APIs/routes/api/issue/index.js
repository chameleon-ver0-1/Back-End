const router = require('express').Router();
const controller = require('./issue.controller');

const passport = require('passport');
const passportConf = require('../common/passport');

const passportJWT = passport.authenticate('jwt', { session: false });

/* ROUTING METHOD */
router.post('/create/task', passportJWT,controller.createIssue); // FIXME:
//router.get('/get', controller.getList);
router.get('/get/:id',passportJWT, controller.getComments); // FIXME:
//router.post('/delete/:id', passportJWT, controller.deleteTask);

// comment
router.post('/create/comment',passportJWT, controller.createComment); // FIXME:

module.exports = router;