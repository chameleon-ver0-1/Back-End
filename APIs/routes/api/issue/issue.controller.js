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
exports.createIssue = (req, res, next) => {
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
        res.status(400).send('Please check Params');
    }

    // 이슈 카드를 생성
    model_mg.Issue.task.create({
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

        console.log(task);
    });

    // 이슈 컬럼에 생성된 이슈 카드를 추가
    model_mg.Issue.column.findOneAndUpdate(
        { status: 'TODO', projectId: projectId },
        { $push: { taskIds : issueId }}
    ).then((result) => {
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
exports.getAll = (req, res, next) => {
    //model_mg.Issue.column.findAll({projectId: projectId});
};

//TODO: 소영 - 코멘트 가져오기
/*
    GET /api/issue/get/:id
*/
exports.getComments = (req, res, next) => {
    var issueId = req.params.id;
    var commentList = [];

    // TODO: TEST IN POSTMAN
    model_mg.Issue.task.findOne({
        _id: issueId
    })
    .then((task) => {
        if (!task) {
            res.status(204).send('Issue not exists');
        }

        task.commentIds.forEach(commentId => {
            model_mg.Issue.comment.findOne({
                _id: commentId
            })
            .then((comment) => {
                if (!comment) {
                    res.status(204).send('Some comments not exist')
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
exports.createComment = (req, res, next) => {
    var commentId;

    try {
        var taskId = req.body.taskId;
        var username = req.body.username;
        var usernameEn = req.body.usernameEn;
        var userImg = req.body.userImg;
        var content = req.body.content;
    } catch {
        res.status(400).send('Please check Params');
    }
    
    // 댓글 생성
    model_mg.Issue.comment.create({
        username: username,
        usernameEn: usernameEn,
        userImg: userImg,
        content: content
    })
    .then((comment) => {
        if (!comment) {
            res.status(204).send('Cannot create new Comment');
        }

        commentId = comment._id;
    });

    model_mg.Issue.task.findOneAndUpdate(
        { _id: taskId },
        { $push: { commentIds: commentId }}
    ).then((result) => {
        res.status(200).json({
            message: '댓글 생성 성공',
            data: commentId
        });
    });
};
