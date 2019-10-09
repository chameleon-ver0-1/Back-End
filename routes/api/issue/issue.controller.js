const model = require('../../../models');
const model_mg = require('../../../models_mg');
require("dotenv").config({ path: __dirname + "\\" + ".env" });

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

/*
    ****< 이슈 생성 >****
    post /api/issue/create
    {
        projectId,
        title,
        dDay,
        dTime,
        content,
        isConfScheduled,
        attachment,
        // dept,
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
        var dDay = req.body.dDay || null;
        var dTime = req.body.dTime || null;
        var content = req.body.content || '';
        var isConfScheduled = req.body.isConfScheduled;
        var attachment = req.body.attachment || '';
        var dept;
        var writerName = req.body.username;
        var writerNameEn = req.body.usernameEn;
        var writerImg = req.body.userImg;

        var projectName;
    } catch {
        res.status(400).json({
            message: 'Please check Params',
            data: false
        });
    }

    // FIXME: join 가능하게 고치고 한번만 쿼리
    // FIXME: ProjectUser 테이블에 ProjectId 필드 추가
    // 유저 정보, 속한 부서 가져오기(일단 부서만 구현)
    await model_mg.Project.findById(projectId, (err, project) => {
        if (err) {
            res.status(202).json({
                message: "프로젝트 이름 조회 중 에러 발생",
                data: false
            });
        }

        console.log('projectName -*-*-> '+project.name);
        projectName = project.name;
    });

    await model.ProjectUser.findOne({
        where: {email: req.user.email, projectName: projectName}
    }).then((project) => {
        if (!project) {
            res.status(202).json({
                message: '부서 가져오기 실패',
                data: false
            });
        }

        dept = project.dataValues.projectRole;

        console.log('projectRole -*-*-> '+dept);
    });

    // 이슈 카드를 생성
    await model_mg.Issue.task.create({
        title: title,
        dDay: dDay,
        dTime: dTime,
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
    });

    // 이슈 컬럼에 생성된 이슈 카드를 추가
    await model_mg.Issue.column.findOneAndUpdate(
        { status: 'TODO', projectId: projectId },
        { $push: { taskIds : issueId }}
    ).then((result) => {

        res.status(200).json({
            message: '이슈 생성 성공',
            data: issueTask
        });
    });
};

/*
    ****< 이슈 조회 >****
    GET /api/issue/:projectId
*/
exports.getList = async (req, res, next) => {
    try {
        var projectId = req.params.projectId;
        var roleData = new Array();
        var taskData = [];
        var columnData = {};
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
                message: "역할 조회 중 에러 발생",
                data: false
            });
        }

        project.roles.forEach(role => {
            roleData.push({ 'role': role });
        });
    });

    // 해당 프로젝트 각 task 데이터 가져오기
    await model_mg.Issue.column.find(
        { projectId: projectId }
    ).populate('taskIds').then((columns) => {
        if (!columns) {
            res.status(404).json({
                message: "task 정보 가져오기 실패",
                data: false
            });
        }

        columns.forEach(column => {
            column.taskIds.forEach(task => {
                taskData.push(task);
            });
        });
    });

    // 해당 프로젝트 각 column 테이터 가져오기
    await model_mg.Issue.column.find(
        { projectId: projectId }
    ).then((columns) => {
        if (!columns) {
            res.status(404).json({
                message: "칼럼 가져오기 실패",
                data: false
            });
        }

        if (columns.length != 3) {
            res.status(404).json({
                message: "칼럼 일부를 찾을 수 없음",
                data: false
            });
        }
        
        // 상태 순서대로 정렬
        var statusList = ['TODO', 'DOING', 'DONE'];

        statusList.forEach(status => {
            columns.forEach(column => {
                console.log(column.status);
                if (column.status === status) {
                    columnData[column.status] = column;
                }
            });
        });

        res.status(200).json({
            message: "이슈 조회 성공",
            data: {
                roleData: roleData,
                taskData: taskData,
                columnData: columnData
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
    ****< 이슈 순서, 상태 저장 >****
    POST /api/issue/savestatus
    {
        columnData
    }
*/
exports.saveStatus = async (req, res, next) => {
    try {
        var columnData = req.body.columnData;
    } catch (err) {
        res.status(400).json({
            message: "Bad Request",
            data: false
        });
    }

    console.log(columnData);

    var statusList = ['TODO', 'DOING', 'DONE'];
    var successList = [];

    await asyncForEach(statusList, async (status) => {
        var columnId = columnData[status]._id;
        var taskIds = columnData[status].taskIds;

        await model_mg.Issue.column.update(
            { _id: columnId },
            { $set: { taskIds: taskIds }}
        ).then((result) => {
            if (!result) {
                res.status(204).json({
                    message: '이슈 상태 반영 실패',
                    data: false
                });
            }

            console.dir('status =#=#=> '+status); //
            successList.push(status);
        }).catch((err) => {
            console.log(err);
        });
    });

    if (successList.length === 3) {
        res.status(200).json({
            message: '이슈 상태 반영 성공',
            data: columnData
        });
    } else {
        res.status(204).json({
            message: '이슈 상태 반영에 성공한 게 맞을까 아닐까 사실 나도 잘 몰라ㅎㅎ',
            data: false
        });
    }
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