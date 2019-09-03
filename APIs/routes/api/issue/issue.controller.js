const model = require('../../../models');
const model_mg = require('../../../models_mg');
require("dotenv").config({ path: __dirname + "\\" + ".env" });

//201 - 성공 / 202 - 실패같은성공

//TODO: 소영 -> 이슈 생성
/*
    post /api/issue/create
    {
        projectId,
        title,
        dDay,
        content,
        isConfScheduled,
        attachment,
        dept,
        username,
        usernameEn,
        userImg
    }
*/
exports.createIssue = async (req, res, next) => {
    var issueTask;
    var issueId;

    try {
        var projectId = req.body.projectId;
        var title = req.body.title || 'Untitled';
        var dDay = req.body.dDay || Date.now();
        var content = req.body.contnet || '';
        var isConfScheduled = req.body.isConfScheduled;
        var attachment = req.body.attachment || '';
        var dept = req.body.dept || '';
        var writerName = req.body.username;
        var writerNameEn = req.body.usernameEn;
        var writerImg = req.body.userImg;
    } catch {
        res.status(400).json({
            message: 'Please check Params',
            data: false
        });
    }

    // 이슈 카드를 생성
    await model_mg.Issue.task.create({
        title: title,
        dDay: dDay,
        content: content,
        isConfScheduled: isConfScheduled,
        attachment: attachment,
        dept: dept,
        writerName: writerName,
        writerNameEn: writerNameEn,
        writerImg: writerImg,
        comentIds: []
    }).then((task) => {
        if (!task) {
            res.status(204).send('Cannot create new Issue');
        }

        issueTask = task;
        issueId = task._id;

        console.log(issueTask);
    });

    // 이슈 컬럼에 생성된 이슈 카드를 추가
    await model_mg.Issue.column.findOneAndUpdate(
        { status: 'TODO', projectId: projectId },
        { $push: { taskIds : issueId }}
    ).then((result) => {
        console.log("here =====> " + issue)
        res.status(200).json({
            message: '이슈 생성 성공',
            data: issueTask
        });
    });
};
//TODO: 소영 - 이슈 전체 가져오기
/*
    GET /api/issue/get
    {
        projectName
    }
*/
exports.getAll = async (req, res, next) => {
    var data;
    var taskData = {};
    var columnData = {};
    var projectId;

    await model_mg.Project.findOne(
        { name: req.body.projectName }
    ).then((project) => {
        if (!project) {
            res.status(202).json({
                message: "존재하지 않는 프로젝트명",
                data: false
            });
        }

        projectId = project._id;
    });

    // 해당 프로젝트 각 칼럼 데이터 가져오기
    var status = ["TODO", "DOING", "DONE"];

    await status.forEach(status => {
        model_mg.Issue.column.findOne(
            { projectId: projectId }
        ).then((column) => {
            if (!column) {
                res.status(202).json({
                    message: "프로젝트 컬럼 생성되지 않음",
                    data: false
                });
            }

            console.log(column);

            columnData[status] = {
                _id: column._id
            };
        }).catch((err) => {
            res.status(400).json({
                message: "DB 쿼리 수행 중 에러",
                data: false
            });
        });
    });

    res.status(200).json({
        data: columnData
    });
    
};

//TODO: 소영 - 코멘트 가져오기
/*
    GET /api/issue/get/:id
*/
exports.getComments = async (req, res, next) => {
    var commentList = [];

    // TODO: TEST IN POSTMAN
    await model_mg.Issue.task.findById(req.params.id)
    .then((task) => {
        if (!task) {
            res.status(204).send('Issue not exists');
        }

        task.commentIds.forEach(commentId => {
            model_mg.Issue.comment.findById(commentId)
            .then((comment) => {
                if (!comment) {
                    res.status(204).send('Some comments not exist');
                }

                commentList.push(comment);

                console.log('commentList => ' + comment);
            });
        });
    });

    res.status(200).json({
        message: '댓글 리스트 조회 성공',
        data: commentList
    });
};
// TODO: 댓글 작성하기
/*
    POST /api/issue/comment
    {
        taskId,
        username,
        usernameEn,
        userImg,
        content
    }
*/
exports.createComment = async (req, res, next) => {
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
        username: username,
        usernameEn: usernameEn,
        userImg: userImg,
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

    await model_mg.Issue.task.findOneAndUpdate(
        { _id: taskId },
        { $push: { commentIds: commentId }}
    ).then((result) => {
        res.status(200).json({
            message: '댓글 생성 성공',
            data: commentData
        });
    });
};
