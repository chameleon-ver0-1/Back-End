const router = require('express').Router();
const auth = require('./auth');
const project = require('./project');
const issue = require('./issue');

router.use('/auth', auth);
router.use('/project', project);
router.use('/issue', issue);

module.exports = router;