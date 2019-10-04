const model = require('../../../models');
const model_mg = require('../../../models_mg');
require("dotenv").config({ path: __dirname + "\\" + ".env" });

/*
    ****< 프로젝트 멤버 조회 >****
    GET /api/chat/:projectId
*/
exports.memberList = async (req, res, next) => {
    var commentData;

    try {
        var taskId = req.body.taskId;
        var username = req.body.username;
        var usernameEn = req.body.usernameEn;
        var userImg = req.body.userImg;
        var content = req.body.content;
    } catch {
        res.status(400).json({
            message: "Please check Params",
            data: false
        });
    }
    
    // 댓글 생성
    await model_mg.Issue.comment.create({
        email: req.user.email,
        name: username,
        name_en: usernameEn,
        profileImg: userImg,
        content: content
    })
    .then((comment) => {
        if (!comment) {
            res.status(204).json({
                message: '댓글 생성 실패'
            });
        }

        commentData = comment;
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