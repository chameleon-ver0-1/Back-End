const router = require('express').Router();
const controller = require('./conf_log.controller');

const passport = require('passport');
const passportConf = require('../common/passport');

const passportJWT = passport.authenticate('jwt', { session: false });

/* ROUTING METHOD */
//TODO: 회의록 상세 내용 가져오기
router.get('/detail/:projectId/:detailId', passportJWT, controller.detail);
//회의록 목록 가져오기
router.get('/list/:projectId', passportJWT, controller.list);
//회의록 목록 검색
router.get('/search/:projectId', passportJWT, controller.search);
//회의록 생성
router.post('/create/:projectId/:confLogId', passportJWT, controller.create);

module.exports = router;