const bcrypt = require("bcrypt"); //-->crypto 모듈

const model = require('../../../models');
require("dotenv").config({ path: __dirname + "\\" + ".env" });

//TODO: 프로젝트 개설할때 태그 설정시 있는 사용자인지 판단하는 메소드 추가

/*
    POST /api/project/create
    {
        projectName
    }
*/
exports.create = (req, res, next) => {
    console.log(req.user.email);
    // TODO: 예지 - 프로젝트이름, 소속부서, URL, 참여자를 저장할 변수 선언
    const projectName = req.body.projectName;
    // const projectRoles = req.body.projectRoles;
    // const projectURL = req.body.projectURL;
    // const projectParticipants = req.body.projectParticipants;

    model.Project.findOne({
        where : { projectName : projectName }
    })
    
    .then(async(project) => {
        if (project) {
            res.status(202).json({
                message: '중복된 프로젝트명',
                data: false
            });
        }
        else{
            try {
                const hash = await bcrypt.hash(projectName, 40);
        
                model.Project.create({
                    projectName: projectName,
                    projectCode: hash,
                    createdAt: new Date().getTime(),
                    updatedAt: new Date().getTime()
                })
        
                .then(() => {
                    res.status(201).json({
                        message:'프로젝트 생성 성공',
                        data: false
                    });
                });
                
            } catch (error) {
                console.log('Error');
            }
        }
    });
};