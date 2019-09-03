const router = require('express').Router();
const controller = require('./conf_room.controller');

const passport = require('passport');
const passportConf = require('../common/passport');

const passportJWT = passport.authenticate('jwt', { session: false });

/* ROUTING METHOD */
//TODO: 회의실 개설
router.post('/create', passportJWT, controller.create);
//TODO: 현재 진행 중인 회의 목록
router.get('/proceedList', passportJWT, controller.proceedList);
//TODO: 내가 포함된 회의 목록
router.get('/includedList', passportJWT, controller.includedList);

module.exports = router;