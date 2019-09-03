const router = require('express').Router();
const controller = require('./issue.controller');

const passport = require('passport');
const passportConf = require('../common/passport');

const passportJWT = passport.authenticate('jwt', { session: false });

/* ROUTING METHOD */
router.post('/create/task', passportJWT,controller.createIssue); // FIXME:
router.post('/get', controller.getAll);
router.get('/get/:id', controller.getComments); // FIXME:
//router.post('/delete/:id', passportJWT, controller.deleteTask);

// comment
router.post('/create/comment', controller.createComment); // FIXME:

module.exports = router;