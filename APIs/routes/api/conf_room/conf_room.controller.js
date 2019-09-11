const model = require('../../../models');
const model_mg = require('../../../models_mg');
require("dotenv").config({
    path: __dirname + "\\" + ".env"
});

//201 - 성공 / 202 - 실패같은성공 / 400 - 잘못된 요청

//개설 버튼 눌렀을 때
/*
    post /api/conf_room/create
    {
        title
        members
        mainTopics
        startTime(날짜 +시간 )
        projectId
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
        projectId = req.body.projectId;
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
    post /api/conf_room/memberCheck
    {
        projectId
        userName
    }
*/
exports.memberCheck = (req, res, next) => {
    var projectId;
    var userName;
    var organizerEmail;
    //유저 
    //결과값 돌려줄 객체 배열 만들어야함
    var searchList = [];
    var user = {};
    try {
        projectId = req.body.projectId;
        userName = req.body.userName; // 확인받을 회의참여자 이름
        organizerEmail = req.user.email;
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Please check Params',
            data : false 
        });
    }

    model.User.findAll({
        where: {
            name: userName
        }
    }).then((result) => {
        // console.log(result.length);
        var total = result.length;
        var i = 0;
        result.forEach((data) => {
            // console.log(data);
            
            if (data.email === organizerEmail) {
                //그냥 빈게 정상임
            } else {
                user.email = data.email;
                model.Project_user.findOne({
                    where : {
                        email : data.email
                    }
                }).then((result)=>{
                    console.log(result);
                    
                    i = i + 1;
                    if(result){
                        user.role = result.projectRole;
                        searchList.push(user);
                    }
                    else{
                        res.status(202).json({
                            message: '검색 결과 불러오기 실패',
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
            }
        });
        // console.log(i);
        
        if(i===total){
            res.status(201).json({
                message: '검색 결과',
                data: {
                    email : searchList.email,
                    role : searchList.role
                }
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
    get /api/conf_room/proceedList
    {
    }
*/
exports.proceedList = (req, res, next) => {
    //TODO: 현재시간을 기준으로 끝나는시간이 null이고 시작시간이 현재시간보다 이전인 것에 해당하는 회의실 목록만 보여주기

    //TODO: title, startTime, organName, organNameEn, 참여중인 사람(이건 회의중인지 아닌지를 구별해야함 --> 이건 나중에), 
};

/*
    get /api/conf_room/includedList
    {
    }
*/
exports.includedList = (req, res, next) => {
    //TODO: conf_room에서 endTime이 없고 참여자이름중 나의 이메일이 있는 회의실 목록 가져오기
};

//TODO: 화상회의 참여자 판단 - 프로젝트안에있는 user인지 아닌지 판단