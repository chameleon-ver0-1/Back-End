// const bcrypt = require("bcrypt"); //-->crypto 모듈

const model = require('../../../models');
const model_mg = require('../../../models_mg');
require("dotenv").config({
    path: __dirname + "\\" + ".env"
});

//201 - 성공 / 202 - 실패같은성공 / 400 - 잘못된 요청

//TODO: 예지 - 프로젝트 개설할때 태그 설정시 존재하는 사용자인지 아닌지 판단
/*
    post /api/project/emailCheck
    {
        email
    }
*/
exports.participantCheck = (req, res, next) => {
    model.User.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(async (email) => {
            console.log(email);

            if (!email) {
                res.status(202).json({
                    message: "존재하지 않는 사용자",
                });
            } else {
                if (req.user.email == req.body.email) {
                    res.status(202).json({
                        message: '본인'
                    });
                } else {
                    res.status(201).json({
                        message: '존재하는 사용자'
                    });
                }
            }
        });
};
//TODO: 예지 - 프로젝트 생성
/*
    POST /api/project/create
    {
        projectName,
        projectRoles,
        projectParticipants
    }
*/
exports.create = async (req, res, next) => {
    var projectName;
    var projectRoles;
    var projectParticipants;
    try {
        projectName = req.body.projectName;
        projectRoles = req.body.projectRoles;
        projectParticipants = req.body.projectParticipants;

        var projectLeader = req.user.email;
        projectParticipants.push(projectLeader);
    } catch (err) {
        console.log(err);
        res.status(400).send('Please check Params');
    }

    // FIXME: 중복된 프로젝트명인지 확인
    // -> 나중에 다른 API로 뺄 것(프젝이름 입력 종료하면, 지후가 그 API 호출해서
    // 옆에 빨간글씨로 "*중복된 프로젝트명입니다."")
    await model.ProjectUser.findOne({
        where: {
            projectName: projectName
        }
    }).then((project) => {
        if (project) {
            res.status(202).json({
                message: '중복된 프로젝트명'
            });
        }
    }).catch((err) => {
        res.status(400).send('DB Error');
    });

    // 프로젝트 참여자 먼저 추가
    var isAdminYn;
    await projectParticipants.forEach(participant => {
        if (participant === projectLeader) {
            isAdminYn = 'Y';
        } else {
            isAdminYn = 'N';
        }

        model.ProjectUser.create({
            projectName: projectName,
            email: participant,
            isAdminYn: isAdminYn,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime()
        }).then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
    });

    var result;
    // 프로젝트 생성 후 이슈 columns 생성
    await model_mg.Project.create({
        name: projectName,
        roles: projectRoles
    }).then((project) => {
        result = project;
        var statusList = ["TODO", "DOING", "DONE"]

        statusList.forEach(status => {
            model_mg.Issue.column.create({
                status: status,
                taskIds: [],
                projectId: project.id
            }).then((column) => {
                if (!column)
                    res.status(202).send('Cannot create Issue columns');

                console.log(column);
            }).catch((err) => {
                console.log(err);
            });
        });
    }).catch((err) => {
        console.log(err);
    });

    await res.status(201).json({
        message: '프로젝트 생성 성공',
        data: result
    });
};

//TODO: 예지 - 참여중인 프로젝트 목록
/*
    GET /api/project/list
    {
    }
*/
exports.list = async (req, res, next) => {
    var project = {};
    await model.ProjectUser.findAll({
        attributes: ['projectName'],
        where: {
            email: req.user.email
        }
    }).then(async (data) => {
        var i = 0;

        data.forEach(async (data) => {
            var pName = data.dataValues.projectName;

            await model_mg.Project.findOne({
                name: pName
            }).then((result) => {
                i=i+1;
                project[result.name] = result.id;
                if(i===2){
                    if (data) {
                        res.status(201).json({
                            message: '목록 가져오기 성공',
                            data: project
                        });
                    } else {
                        res.status(202).json({
                            message: '목록 가져오기 실패',
                            data: false
                        });
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        });
    });
};

/*
    POST /api/project/list
    {
        projectId
    }
*/
exports.roleList = async (req, res, next) => {
    var projectId;
    try{
        projectId = req.body.projectId;
    }catch(err){
        console.log(err);
        res.status(400).send('Please check Params');
    }
    model_mg.Project.findOne({
        _id: projectId
    }).then((result) =>{
        console.log(result);
        
        if(result){
            res.status(201).json({
                message: '목록 가져오기 성공',
                data: result.roles
            });
        }
        else{
            res.status(202).json({
                message: '목록 가져오기 실패',
                data: false
            });
        }
    }).catch((err)=>{
        console.log(err);
    });
};

/*
    POST /api/project/firstCheck
    {
        projectId
    }
*/
exports.firstCheck = async (req, res, next) => {
    var projectId;
    try{
        projectId = req.body.projectId;
    }catch(err){
        console.log(err);
        res.status(400).send('Please check Params');
    }
    //TODO: project_users에서 projectRole이 null일 때 처음이라고 판단
    model.ProjectUser.findOne({
        attributes : ['projectRole'],
        where: {
            email : req.user.email
        }
    }).then((result)=>{
        //TODO: 처음이면 개설자, 참여자 넘겨주고 아니면 그냥 res로 반환
        console.log(result.projectRole);
        if(result.projectRole===null){
            //TODO: project에 역할이 있는지 없는지 판단할 필요 없음 (바로 프젝 이름, 개설자, 참여자, 프로젝트 역할 한번에 넘겨주기)
            var projectLeader;
            var projectParticipants;
            var projectRoles;
            var projectName;
            model_mg.Project.findOne({
                _id : projectId
            }).then((result)=>{
                if(result){
                    projectName = result.name;
                    projectRoles = result.roles;
                }
                else{
                    res.status(400).send('DB Error');
                }
            }).catch((err)=>{
                console.log(err);
            });

            // model.ProjectUser.findOne({
            //     attributes : ['projectRole'],
            //     where: {
            //         email : req.user.email
            //     }
            // }).then((result)=>{

            // }).catch((err)=>{
            //     console.log(err);
            // });
        }
        else{
            //처음이 아닌 경우 --> 이슈 페이지 이동
            res.status(201).json({
                message: '처음이 아닌 사용자',
                data: false
            });
        }
    }).catch((err)=>{
        console.log(err);
    });
};