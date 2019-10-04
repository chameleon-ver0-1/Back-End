const router = require('express').Router();
const auth = require('./auth');
const project = require('./project');
const issue = require('./issue');
const conf_room = require('./conf_room');
// const conf_log = require('./conf_log');
// const chat = require('./chat');

router.use('/auth', auth);
router.use('/project', project);
router.use('/issue', issue);
router.use('/conf_room', conf_room);
// router.use('/conf_log', conf_log);
// router.use('/chat', chat);

module.exports = router;