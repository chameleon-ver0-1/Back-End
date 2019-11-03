const router = require('express').Router();
const controller = require('./issue.controller');

const passport = require('passport');
const passportConf = require('../common/passport');

const passportJWT = passport.authenticate('jwt', { session: false });

/* ROUTING METHOD */
// task
router.post('/:projectId', passportJWT, controller.getList);
router.post('/create/task', passportJWT, controller.createIssue);
router.post('/delete', passportJWT, controller.deleteTask);
router.post('/savestatus', passportJWT, controller.saveStatus);

// comment
router.get('/get/:id', passportJWT, controller.getComments);
router.post('/create/comment', passportJWT, controller.createComment);

// make conference room
router.get('/gettitle/:projectId', passportJWT, controller.getTitles);

module.exports = router;