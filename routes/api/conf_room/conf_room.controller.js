const model = require('../../../models');
const model_mg = require('../../../models_mg');
require("dotenv").config({
    path: __dirname + "\\" + ".env"
});

//201 - 성공 / 202 - 실패같은성공 / 400 - 잘못된 요청

//개설 버튼 눌렀을 때
/*
    POST /api/conf_room/create/:projectId
    {
        title
        members
        mainTopics
        startTime(날짜 +시간 )
    }
*/
exports.create = (req, res, next) => {
    //id 제외 총 7개 속성 갖고있음
    var title; //방 제목
    var members; // 참여자
    var mainTopics; //메인 토픽 
    var startTime; // 시작 시간
    var organizerEmail; //회의 개설자 이메일
    var projectId;
    try {
        projectId = req.params.projectId;
        title = req.body.title;
        mainTopics = req.body.mainTopics;
        members = req.body.members;
        startTime = req.body.startTime;
        organizerEmail = req.user.email;
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Please check Params',
            data: false
        });
    }

    model_mg.Conf_room.findOne({
        title: title,
        projectId: projectId
    }).then((result) => {
        if (result) {
            res.status(202).json({
                message: '회의 제목 중복',
                data: false
            });
        } else {
            //TODO: model_mg.Conf_room.create에 7개 데이터 insert 하기 
            model_mg.Conf_room.create({
                title: title,
                members: members,
                startTime: startTime,
                mainTopics: mainTopics,
                projectId: projectId
            }).then(async (result) => {
                if (!result) {
                    res.status(202).json({
                        message: '회의실 생성 실패',
                        data: false
                    });
                } else {
                    await members.forEach(member => {
                        model.ConftUser.create({
                            confTitle: title,
                            projectId: projectId,
                            email: member,
                            isAdminYn: "N",
                            isConfYn: "N",
                            createdAt: new Date().getTime(),
                            updatedAt: new Date().getTime()
                        }).catch((err) => {
                            console.log(err);
                            res.status(500).json({
                                message: '서버 오류',
                                data : false
                            });
                        });
                    });
                    //conf_user 테이블에 추가
                    await model.ConftUser.create({
                        confTitle: title,
                        projectId: projectId,
                        email: organizerEmail,
                        isAdminYn: "Y",
                        isConfYn: "N",
                        createdAt: new Date().getTime(),
                        updatedAt: new Date().getTime()
                    }).then((result) => {
                        if (result) {
                            res.status(201).json({
                                message: '회의실 생성 성공',
                                data: {
                                    title: title,
                                    members: members,
                                    confLeader: organizerEmail,
                                    startTime: startTime,
                                    mainTopics: mainTopics,
                                    projectId: projectId
                                }
                            });
                        } else {
                            res.status(202).json({
                                message: '회의실 생성 실패',
                                data: false
                            });
                        }
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            message: '서버 오류',
                            data : false
                        });
                    });
                }
            }).catch((err) => {
                console.log(err);
                res.status(500).json({
                    message: '서버 오류',
                    data : false
                });
            });


        }
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            message: '서버 오류',
            data : false
        });
    });

};

//TODO: 이름 누르고 엔터쳤을 때 사용자의 부서와 이메일 넘겨주기 --> 참여자 추가 확인
/*
    POST /api/conf_room/memberCheck/:projectId
    {
        userName
    }
*/
exports.memberCheck = async(req, res, next) => {
    var projectId;
    var projectName;
    var mamberName;
    var organizerEmail;
    var roleExist = true;
    //유저 
    //결과값 돌려줄 객체 배열 만들어야함
    var searchList = [];
    try {
        projectId = req.params.projectId;
        mamberName = req.body.userName; // 확인받을 회의참여자 이름
        organizerEmail = req.user.email;
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Please check Params',
            data : false 
        });
    }
    await model_mg.Project.findOne({
        _id : projectId
    }).then((result)=>{
        if(result){
            projectName = result.name;
            console.log(result.roles);
            
            if(!result.roles){
                roleExist=false;
            }
        }
        else{
            res.status(400).json({
                message: '없는 프로젝트',
                data : false 
            });
        }
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({
            message: '서버 오류',
            data : false
        });
    });
    //동명이인이 있을 수 있기 때문 findAll
    await model.User.findAll({
        where: {
            name: mamberName
        }
    }).then((result) => {
        // console.log(result.length);
        if(result){
            //프로젝트에 있고 부서 설정이 되어있는 member만 가져오기
            var total = result.length;
            var i = 0;
            // console.log(total);
            result.forEach((data) => {
                // console.log(data.email);
                if (data.email === organizerEmail) {
                    // console.log(organizerEmail);
                    i=i+1;
                } else {
                    model.ProjectUser.findOne({
                        where : {
                            projectName : projectName,
                            email : data.email
                        }
                    }).then((result)=>{
                        // console.log(result.email);
                        if(result){
                            if(result.projectRole||roleExist===false){
                                var member = {};
                                member.email = result.email;
                                member.role = result.projectRole;
                                searchList.push(member);
                                console.log(searchList);
                                i = i + 1;
                            }
                            else{
                                i = i + 1;
                            }
                        }
                        else{
                            i = i + 1;
                        }
                        if(i===total){
                            // console.log(i);
                            res.status(201).json({
                                message: '검색 결과',
                                data: {
                                    searchList
                                }
                            });
                        }
                    }).catch((err)=>{
                        console.log(err);
                        res.status(500).json({
                            message: '서버 오류',
                            data : false
                        });
                    });
                }
            });
        }
        else{
            res.status(400).json({
                message: '없는 사용자',
                data : false
            });
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            message: '서버 오류',
            data : false
        });
    });
};

/*
    GET /api/conf_room/proceedList/:projectId
    {
    }
*/
exports.proceedList = (req, res, next) => {
    //TODO: 현재시간을 기준으로 끝나는시간이 null이고 시작시간이 현재시간보다 이전인 것에 해당하는 회의실 목록만 보여주기
    console.log(new Date().getTime());
    
};

/*
    GET /api/conf_room/includedList/:projectId
    {
    }
*/
exports.includedList = (req, res, next) => {
    //TODO: conf_room에서 endTime이 없고 참여자이름중 나의 이메일이 있는 회의실 목록 가져오기
};

/*
    GET /api/conf_room/enterConf/:projectId/:confId
    {
    }
*/
//TODO: 회의실에 들어갈때 conf_user에 isConfYn 바꾸는 작업 필요(N-->Y))
exports.enterConf = (req, res, next) => {

};

/*
    GET /api/conf_room/exitConf/:projectId/:confId
    {
    }
*/
//TODO: 회의실에 나갈때 conf_user에 isConfYn 바꾸는 작업 필요(Y-->N))
exports.exitConf = (req, res, next) => {

};

/*
    GET /api/conf_room/memberList/:projectId/:confId
    {
    }
*/
//TODO: 동그라미에서 3/4 누르면 회의 참여자들 목록 보여주기
exports.memberList = (req, res, next) => {
    var confId;
    var members =[];
    try {
        confId = req.params.confId;
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Please check Params',
            data : false 
        });
    }
    
    model_mg.Conf_room.findOne({
        _id : confId
    }).then((result)=>{
        if(result){
            // console.log(result);
            result.members.forEach((member) => {
                var memberObject={};
                memberObject.member = member;
                members.push(memberObject);
            });
            res.status(201).json({
                message: '참여자 목록',
                data: members
            });
        }
        else{
            res.status(202).json({
                message: '없는 회의',
                data: false
            });
        }
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({
            message: '서버 오류',
            data : false
        });
    });
};