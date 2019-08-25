const bcrypt = require("bcrypt");

const model = require('../../../models');
require("dotenv").config({ path: __dirname + "\\" + ".env" });

/*
    POST /api/project/create
    {
        projectName
    }
*/
exports.create = async (req, res, next) => {
    const projectName = req.body.projectName;

    model.Project.findOne({
        where : { projectName : projectName }
    })
    
    .then((project) => {
        if (project) {
            res.status(202).json({
                message: '중복된 프로젝트명',
                data: false
            });
        }
    });

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
};