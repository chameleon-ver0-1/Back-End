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
        }).then(async (email) => {
            console.log(email);

            if (!email) {
                res.status(202).json({
                    message: "존재하지 않는 사용자",
                    data: false
                });
            } else {
                if (req.user.email == req.body.email) {
                    res.status(202).json({
                        message: '본인',
                        data: false
                    });
                } else {
                    res.status(201).json({
                        message: '존재하는 사용자',
                        data: true
                    });
                }
            }
        }).catch((err)=>{
            res.status(500).json({
                message: '서버 오류',
                data: false
            });
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
        res.status(400).json({
            message: 'Please check Params',
            data: false
        });
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
                message: '중복된 프로젝트명',
                data: false
            });
        }
    }).catch((err) => {
        console.log(err);
        
        res.status(500).json({
            message: '서버 오류',
            data: false
        });
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
            res.status(500).json({
                message: '서버 오류',
                data: false
            });
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
                    res.status(202).json({
                        message: '이슈 컬럼 생성 오류',
                        data : false
                    });

                console.log(column);
            }).catch((err) => {
                console.log(err);
                res.status(500).json({
                    message: '서버 오류',
                    data : false
                });
            });
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            message: '서버 오류',
            data : false
        });
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
    var projects = [];
    var total;
    await model.ProjectUser.findAll({
        attributes: ['projectName'],
        where: {
            email: req.user.email
        }
    }).then(async (data) => {
        var i = 0;
        total = data.length;

        data.forEach(async (data) => {
            var pName = data.dataValues.projectName;

            await model_mg.Project.findOne({
                name: pName
            }).then((result) => {
                i = i + 1;
                var project = {};
                project.name = result.name;
                project.id = result.id;
                projects.push(project);
                if (i === total) {
                    if (data) {
                        res.status(201).json({
                            message: '목록 가져오기 성공',
                            data: projects
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
                res.status(500).json({
                    message: '서버 오류',
                    data : false
                });
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
    try {
        projectId = req.body.projectId;
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Please check Params',
            data : false
        });
    }
    model_mg.Project.findOne({
        _id: projectId
    }).then((result) => {
        console.log(result);

        if (result) {
            res.status(201).json({
                message: '목록 가져오기 성공',
                data: result.roles
            });
        } else {
            res.status(202).json({
                message: '목록 가져오기 실패',
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
};

/*
    POST /api/project/firstCheck
    {
        projectId
    }
*/
exports.firstCheck = async (req, res, next) => {
    var projectId;
    var projectName;
    try {
        projectId = req.body.projectId;
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Please check Params',
            data : false
        });
    }
    //TODO: model_mg.project에서 projectRoles 배열이 null인지 확인 -> null이면 역할지정 없음(개설자가 역할 설정하지 않았으므로)
    model_mg.Project.findOne({
        _id : projectId
    }).then((result) => {
        if(result){
            projectName = result.name;
        }
        if (result.roles === null) {
            //이슈 넘김
            res.status(201).json({
                message: '부서 없는 프로젝트',
                data: false
            });
        } else {
            //창 떠야하는 시점
            //TODO: projectRoles배열이 null이 아니면, model.project_users에서 사용자의 역할이 null인지 확인
            model.ProjectUser.findOne({
                where: {
                    projectName : projectName,
                    email: req.user.email
                }
            }).then((result) => {
                var projectRole=result.projectRole;
                //TODO: 사용자의 역할이 null이면, model_mg.project에서 불러온 projectRoles 중 어떤 역할인지 선택 -> project_users role필드에 넣어줌
                if (projectRole === null) {
                    var projectLeader = {};
                    var projectParticipants = [];
                    var projectRoles;
                    var projectName;
                    model_mg.Project.findOne({
                        _id: projectId
                    }).then(async (result) => {
                        if (result) {
                            projectName = result.name; //프로젝트 이름
                            projectRoles = result.roles; //프로젝트 부서

                            await model.ProjectUser.findAll({
                                where: {
                                    projectName: projectName
                                }
                            }).then(async (result) => {
                                // console.log(result);
                                var i = 0;
                                total = result.length;

                                await result.forEach(async (data) => {
                                    await model.User.findOne({
                                        where: {
                                            email: data.email
                                        }
                                    }).then(async (result) => {
                                        i = i + 1;
                                        // console.log(result.name);

                                        if (data.isAdminYn === 'Y') {
                                            projectLeader.name = result.name;
                                            projectLeader.name_en = result.name_en;
                                            projectLeader.email = result.email;
                                        } else {
                                            var projectParticipant = {};
                                            projectParticipant.name = result.name;
                                            projectParticipant.name_en = result.name_en;
                                            projectParticipant.email = result.email;
                                            projectParticipants.push(projectParticipant);
                                        }
                                        if (i === total) {
                                            await res.status(201).json({
                                                message: '프로젝트 처음',
                                                data: {
                                                    projectName: projectName,
                                                    projectLeader: projectLeader,
                                                    projectRoles: projectRoles,
                                                    projectParticipants: projectParticipants
                                                }
                                            });
                                        }
                                    }).catch((err) => {
                                        console.log(err);
                                        res.status(500).json({
                                            message: '서버 오류',
                                            data: false
                                        });
                                    });
                                });
                            }).catch((err) => {
                                console.log(err);
                                res.status(500).json({
                                    message: '서버 오류',
                                    data: false
                                });
                            });
                        } else {
                            res.status(400).json({
                                message: 'DB Error',
                                data: false
                            });
                        }
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            message: '서버 오류',
                            data: false
                        });
                    });
                } else {
                    res.status(201).json({
                        message: '역할있는 사용자',
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
};

/*
    POST /api/project/participate
    {
        projectId,
        role
    }
*/
exports.participate = async (req, res, next) => {
    var projectId;
    var projectName;
    var role;
    try {
        projectId = req.body.projectId;
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Please check Params',
            data : false
        });
    }
    model_mg.Project.findOne({
        _id: projectId
    }).then(async (result) => {
        projectName = result.name;

        await model.ProjectUser.update({
            projectRole: req.body.role
        }, {
            where: {
                email: req.user.email,
                projectName: projectName
            }
        }).then((result) => {
            if (result) {
                res.status(201).json({
                    message: '부서 설정 완료',
                    data: req.body.role
                });
            } else {
                res.status(202).json({
                    message: '부서 설정 실패',
                    data: false
                });
            }
        }).catch((err) => {
            console.log(err);
        });

    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            message: '서버 오류',
            data : false
        });
    });
};

/*
    POST /api/project/refuse
    {
        projectId
    }
*/
exports.refuse = async (req, res, next) => {
    var projectId;
    var userEmail;
    try {
        projectId = req.body.projectId;
        userEmail = req.user.email;
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Please check Params',
            data : false
        });
    }
    model.ProjectUser.destroy({
        where: {
            email: userEmail
        }
    }).then(result => {
        if (result) {
            res.status(201).json({
                message: '참여자 삭제 성공',
                data: req.body.role
            });
        } else {
            res.status(202).json({
                message: '참여자 삭제 실패',
                data: false
            });
        }
    }).catch(err => {
        console.error(err);
        res.status(500).json({
            message: '서버 오류',
            data : false
        });
    });
}