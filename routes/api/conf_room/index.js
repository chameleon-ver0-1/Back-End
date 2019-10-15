const router = require('express').Router();
const controller = require('./conf_room.controller');

const passport = require('passport');
const passportConf = require('../common/passport');

const passportJWT = passport.authenticate('jwt', { session: false });

/* ROUTING METHOD */
//회의실 개설
router.post('/create/:projectId', passportJWT, controller.create);
//회의 참여자 체크
router.post('/memberCheck/:projectId', passportJWT, controller.memberCheck);
//TODO: 현재 진행 중인 회의 목록
router.get('/proceedList/:projectId', passportJWT, controller.proceedList);
//내가 포함된 회의 목록
router.get('/includedList/:projectId', passportJWT, controller.includedList);
//회의에 들어갈 때 user의 isConfYn 변경
router.get('/enterConf/:projectId/:confId', passportJWT, controller.enterConf);
//FIXME: 3/4누를때 member목록 
router.get('/memberList/:projectId/:confId', passportJWT, controller.memberList);
//TODO: 회의완전종료 - 개설자만 가능
router.post('/endConf/:projectId/:confId', passportJWT, controller.endConf);
//TODO: 회의나갈때 - 단순 상태변경
router.post('/exitConf/:projectId/:confId', passportJWT, controller.exitConf);

module.exports = router;