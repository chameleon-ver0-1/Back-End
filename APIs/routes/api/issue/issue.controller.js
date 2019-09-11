const model = require('../../../models');
const model_mg = require('../../../models_mg');
require("dotenv").config({ path: __dirname + "\\" + ".env" });


/*
    ****< 이슈 생성 >****
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

/*
    ****< 이슈 조회 >****
    GET /api/issue/get
    {
        projectId
    }
*/
exports.getAll = async (req, res, next) => {
    var projectRoles;

    try {
        var projectId = req.body.projectId;
        var columnData = {};
        var taskData = {};
    } catch (err) {
        res.status(204).json({
            message: 'Please check Params',
            data: false
        });
    }

    // 프로젝트 역할 조회
    await model_mg.Project.findById(projectId, (err, project) => {
        if (err) {
            res.status(202).json({
                message: "프로젝트 역할 조회 중 에러 발생",
                data: false
            });
        }
        console.log(project);
        
        projectRoles = project.roles;
    });

    // 해당 프로젝트 각 칼럼 데이터 가져오기
    await model_mg.Issue.column.find({
        projectId: projectId
    }).populate('taskIds').then((columns) => {
        if (!columns) {
            res.status(404).json({
                message: "칼럼 가져오기 실패",
                data: false
            });
        }

        res.status(200).json({
            message: "이슈 조회 성공",
            data: {
                deptData: projectRoles,
                issueData: columns
            }
        });
    });
};

/* 
    ****< 이슈 삭제 >****
    POST /api/issue/delete
    {
        taskId,
        statusId
    }
*/
exports.deleteTask = async (req, res, next) => {
    try {
        var taskId = req.body.taskId;
        var statusId = req.body.statusId;
    } catch (err) {
        res.status(204).json({
            message: "Please check Params",
            data: false
        });
    }

    await model_mg.Issue.column.update(
        { _id: statusId },
        { $pull : { taskIds: taskId }}
    ).then((result) => {
        if (!result) {
            res.status(200).json({
                message: '칼럼에서 이슈 삭제 실패',
                data: false
            });
        }
    });

    await model_mg.issue.task.remove({ _id: taskId }, (err, result) => {
        if (!result) {
            res.status(202).json({
                message: '이슈 데이터 삭제 실패',
                data: false
            });
        }

        if (err) {
            res.status(400).json({
                message: '이슈 데이터 삭제 중 DB 오류',
                data: false
            });
        }

        res.status(200).json({
            message: '이슈 삭제 성공',
            data: false
        });
    });
}

/* 
    ****< 이슈 상태 변경 >****
    POST /api/issue/changestatus
    {
        taskId,
        exStatusId,
        newStatusId
    }
*/
exports.changeStatus = async (req, res, next) => {
    try {
        var taskId = req.body.taskId;
        var exStatusId = req.body.exStatusId;
        var newStatusId = req.body.newStatusId;
    } catch (err) {
        res.status(204).json({
            message: "Please check Params",
            data: false
        });
    }

    // 이전 상태에서 제거
    await model_mg.Issue.column.update(
        { _id: exStatusId },
        { $pull: { taskIds: taskId }}
    ).then((result) => {
        if (!result) {
            res.status(200).json({
                message: '이슈 상태변경 실패',
                data: false
            });
        }
    });

    // 새로운 상태로 업데이트
    await model_mg.Issue.column.update(
        { _id: newStatusId },
        { $push: { taskIds: taskId }}
    ).then((result) => {
        if (!result) {
            res.status(200).json({
                message: '이슈 상태변경 실패',
                data: false
            });
        }

        res.status(200).json({
            message: '이슈 상태변경 성공',
            data: false
        });
    });
};

/*
    ****< 댓글 조회 >****
    GET /api/issue/get/:id
*/
exports.getComments = async (req, res, next) => {
    var commentList = [];

    await model_mg.Issue.task.findById(req.params.id)
    .populate('commentIds')
    .exec((err, data) => {
        if (err) {
            res.status(400).json({
                message: "DB 쿼리 수행 중 에러",
                data: false
            })
        }

        if (!data) {
            res.status(204).json({
                message: "존재하지 않는 이슈",
                data: false
            });
        }

        res.status(200).json({
            message: "댓글 조회 성공",
            data: data.commentIds
        })

        console.log(data);
    });
};

/*
    ****< 댓글 생성 >****
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

        console.log("comment_id ====> " + comment._id);
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
