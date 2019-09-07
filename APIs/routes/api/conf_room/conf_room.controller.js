const model = require('../../../models');
const model_mg = require('../../../models_mg');
require("dotenv").config({
    path: __dirname + "\\" + ".env"
});

//201 - 성공 / 202 - 실패같은성공 / 400 - 잘못된 요청

/*
    post /api/conf_room/create
    {
        projectId
        title
        mainTopics
        startTime(날짜 +시간 )
        members
    }
*/
exports.create = (req, res, next) => {
    //id 제외 총 7개 속성 갖고있음
    var title; //방 제목
    var mainTopics; //메인 토픽 
    var members; // 참여자
    var startTime; // 시작 시간
    var organizerEmail; //회의 개설자 이메일
    var organName; // 회의 개설자 이름
    var organNameEn; // 회의 개설자 영어이름
    var projectName; //FIXME: 중간 URL로 받아온 프로젝트이름 적기
    var projectId;
    try {
        projectId = req.body.projectId;
        title = req.body.title;
        mainTopics = req.body.mainTopics;
        members = req.body.members;
        startTime = req.body.startTime;
        organizerEmail = req.user.email; 
    } catch(err) {
        console.log(err);
        res.status(400).send('Please check Params');
    }

    //TODO: model.User.findOne에서 organizerEmail을 가진 이름, 영어이름 가져오기
    model.User.findOne({
        attributes : ['name','name_en'],
        where : { 
            email : organizerEmail 
        }
    }).then((result) => {
        organName = result.name;
        organNameEn = result.name_en;

        //TODO: model_mg.Project.findOne에서 프로젝트 이름을 가진 id를 가져오기 
        model_mg.Project.findOne({
            attributes : ['id'],
            where : { 
                name : projectName 
            }
        }).then((result) => {
            projectId = result.id;
            //TODO: model_mg.Conf_room.create에 7개 데이터 insert 하기 
            model_mg.Conf_room.create({
                title : title,
                organName : organName,
                organNameEn : organNameEn,
                members : members,
                startTime : startTime,
                mainTopics : mainTopics,
                projectId : projectId
            }).then((result) =>{
                if(result){
                    res.status(202).json({
                        message: '회의실 생성 실패',
                        data: false
                    });
                }
                else{
                    res.status(201).json({
                        message: '회의실 생성 성공',
                        data: result
                    });
                }
            }).catch((err) =>{
                console.log(err);
            });
        }).catch((err)=>{
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
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