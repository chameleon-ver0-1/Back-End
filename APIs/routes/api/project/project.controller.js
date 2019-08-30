// const bcrypt = require("bcrypt"); //-->crypto 모듈

const model = require('../../../models');
const model_mg = require('../../../models_mg');
require("dotenv").config({
    path: __dirname + "\\" + ".env"
});

//201 - 성공 / 202 - 실패같은성공

//TODO: 예지 - 프로젝트 개설할때 태그 설정시 존재하는 사용자인지 아닌지 판단
/*
    post /api/project/emailCheck
    {
        email
    }
*/
exports.emailCheck = (req, res, next) => {
    model.User.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(async (email) => {
            if (!email) {
                res.status(202).json({
                    message: "존재하지 않는 사용자",
                });
            } else {
                if (req.user.email == req.body.email) {
                    res.status(201).json({
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
exports.create = (req, res, next) => {
    // console.log(req.user.email);
    //TODO: 예지 - 프로젝트이름, 소속부서, 참여자를 저장할 변수 선언
    const projectName = req.body.projectName;
    const projectRoles = req.body.projectRoles;
    const projectParticipants = req.body.projectParticipants;

    model.ProjectUser.findOne({
            where: {
                projectName: projectName
            }
        })
        .then(async (project) => {
            if (project) {
                res.status(202).json({
                    message: '중복된 프로젝트명'
                });
            } else {
                //TODO: 예지 - 몽고디비에있는 프로젝트에 name, roles 저장
                model_mg.Project.create({
                    name: projectName,
                    roles: projectRoles
                }).then(async (result) => {
                    //TODO: 예지 - project_user에 우선 개설자라는 표시먼저 그외의 참여자들의 계정에도 프로젝트연결
                    model.ProjectUser.create({
                        projectName: projectName,
                        email: req.user.email,
                        projectRole: null,
                        isAdminYn: 'Y',
                        createdAt: new Date().getTime(),
                        updatedAt: new Date().getTime()
                        //timestamp 넣어줘야함
                    }).then(async (result) => {
                        for (let i = 0; i < projectParticipants.length; i++) {
                            model.ProjectUser.create({
                                projectName: projectName,
                                email: projectParticipants[i],
                                projectRole: null,
                                isAdminYn: 'N',
                                createdAt: new Date().getTime(),
                                updatedAt: new Date().getTime()
                            })
                        }
                        // TODO: models_mg.issue.columns에
                        /*
                            status -> todo, doing, done
                            taskIds -> []
                            projectId -> 해당 프로젝트의 objectId 로 3개 만들어서 몽고디비에 CREATE
                        */
                        model_mg.Project.findOne({
                            name: result.projectName
                        }).then(async (result) => {
                            if(result){
                                console.log(result._id);
                                
                                model_mg.Issue.columns.create({
                                    status: "TODO",
                                    taskIds: [],
                                    projectId: result.id
                                }).then(async(data)=>{
                                    if(result){
                                        model_mg.Issue.columns.create({
                                            status: "DOING",
                                            taskIds: [],
                                            projectId: result.id
                                        }).then(async(data)=>{
                                            if(result){
                                                model_mg.Issue.columns.create({
                                                    status: "DONE",
                                                    taskIds: [],
                                                    projectId: result.id
                                                }).then(async(data)=>{
                                                    if(result){
                                                        res.status(201).json({
                                                            message: '최종 저장 완료'
                                                        });
                                                    }
                                                    else{
                                                        res.status(202).json({
                                                            message: 'done 저장 실패'
                                                        });
                                                    }
                                                });
                                            }
                                            else{
                                                res.status(202).json({
                                                    message: 'doing 저장 실패'
                                                });
                                            }
                                        });
                                    }
                                    else{
                                        res.status(202).json({
                                            message: 'todo 저장 실패'
                                        });
                                    }
                                });
                            }
                            else{
                                res.status(202).json({
                                    message: 'project id 불러오기 실패'
                                });
                            }
                        });
                    });
                });
            }
        });
};

//TODO: 예지 - 참여중인 프로젝트 목록
/*
    GET /api/project/list
    {
    }
*/
exports.list = (req, res, next) => {
    model.ProjectUser.findAll({
        attributes: ['projectName'],
        where: {
            email: req.user.email
        }
    }).then(async (data) => {
        if (data) {
            res.status(201).json({
                message: '목록 가져오기 성공',
                data: data
            });
        } else {
            res.status(202).json({
                message: '목록 가져오기 실패',
                data: false
            });
        }
    });
};
