// const bcrypt = require("bcrypt"); //-->crypto 모듈

const model = require('../../../models');
const model_mg = require('../../../models_mg');
require("dotenv").config({ path: __dirname + "\\" + ".env" });

//TODO: 예지 - 프로젝트 개설할때 태그 설정시 있는 사용자인지 판단
/*
    post /api/project/emailCheck
    {
        email
    }
*/
exports.emailCheck = (req,res,next) =>{
    model.User.findOne({
        where : { email : req.body.email }
    })
    .then(async(email) => {
        if (email) {
            res.status(201).json({
                message: '존재하는 사용자'
            });
        }
        else{
            res.status(202).json({ 
                message : "존재하지 않는 사용자",
            });
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
    console.log(req.user.email);
    //TODO: 예지 - 프로젝트이름, 소속부서, 참여자를 저장할 변수 선언
    const projectName = req.body.projectName;
    const projectRoles = req.body.projectRoles;
    const projectParticipants = req.body.projectParticipants;

    model.ProjectUser.findOne({
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
            //TODO: 예지 - 몽고디비에있는 프로젝트에 name, roles 저장
            const Project= model_mg.Project({name:projectName, roles:projectRoles});
        
            Project.save(function(error, data){
                if(error){
                    console.log(error);
                }else{
                    //TODO: 예지 - project_user에 우선 개설자라는 표시먼저 그외의 참여자들의 계정에도 프로젝트연결
                    model.ProjectUser.create({
                        projectName: projectName,
                        
                    }).then(async(result) => {

                    });
                    res.status(201).json({
                        message: '저장 완료'
                    });
                    console.log('Saved!');
                }
            });

            // try {
            //     const hash = await bcrypt.hash(projectName, 40);
        
            //     model.Project.create({
            //         projectName: projectName,
            //         projectCode: hash,
            //         createdAt: new Date().getTime(),
            //         updatedAt: new Date().getTime()
            //     })
        
            //     .then(() => {
            //         res.status(201).json({
            //             message:'프로젝트 생성 성공',
            //             data: false
            //         });
            //     });
                
            // } catch (error) {
            //     console.log('Error');
            // }
        }
    });
};