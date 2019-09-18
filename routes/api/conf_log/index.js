const router = require('express').Router();
const controller = require('./conf_log.controller');

const passport = require('passport');
const passportConf = require('../common/passport');

const passportJWT = passport.authenticate('jwt', { session: false });

/* ROUTING METHOD */
//TODO: 회의록 상세 내용 가져오기
router.post('/detail', passportJWT, controller.detail);
//TODO: 회의록 목록 가져오기
router.get('/list', passportJWT, controller.list);

module.exports = router;