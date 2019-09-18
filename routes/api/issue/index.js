const router = require('express').Router();
const controller = require('./issue.controller');

const passport = require('passport');
const passportConf = require('../common/passport');

const passportJWT = passport.authenticate('jwt', { session: false });

/* ROUTING METHOD */
// task
router.get('/:projectId', passportJWT, controller.getList);
router.post('/create/task', passportJWT, controller.createIssue);
router.post('/delete', passportJWT, controller.deleteTask);
router.post('/changestatus', passportJWT, controller.changeStatus);

// comment
router.get('/get/:id', passportJWT, controller.getComments);
router.post('/create/comment', passportJWT, controller.createComment);

module.exports = router;