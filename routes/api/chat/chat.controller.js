const model = require('../../../models');
const model_mg = require('../../../models_mg');
require("dotenv").config({ path: __dirname + "\\" + ".env" });

/*
    ****< 프로젝트 멤버 조회 >****
    GET /api/chat/:projectId
*/
exports.memberList = async (req, res, next) => {
    try {
        var projectId = req.params.projectId;
        var projectName;
        var memberData = {};
    } catch {
        res.status(400).json({
            message: "Bad Request",
            data: false
        });
    }
    
    // 프로젝트 이름 검색
    await model_mg.Project.findById(projectId, (err,project) => {
        if (err) {
            res.status(404).json({
                message: '프로젝트 이름 검색 실패',
                data: false
            });
        }

        projectName = project.name;
        project.roles.forEach(role => {
            memberData['role'] = [];
        });
    });

    await model_mg.Issue.task.update(
        { _id: taskId },
        { $push: { commentIds: commentData._id }}
    ).then((result) => {
        res.status(200).json({
            message: '댓글 생성 성공',
            data: commentData
        });
    });
};