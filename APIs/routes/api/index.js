const router = require('express').Router();
const auth = require('./auth');
const project = require('./project');

router.use('/auth', auth);
router.use('/project', project);

module.exports = router;