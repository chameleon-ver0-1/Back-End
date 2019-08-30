const model = require('../../../models');
const model_mg = require('../../../models_mg');
require("dotenv").config({ path: __dirname + "\\" + ".env" });

//201 - 성공 / 202 - 실패같은성공

//TODO: 소영 -> 이슈 생성
/*
    post /api/issue/create
    {
        projectName,
        title,
        dDay,
        content,
        isConfScheduled,
        attachment,
        dept
    }
*/
exports.create = (req, res, next) => {

    model_mg.Issue.tasks.create({
            title: req.body.title,
            dDay: Date.now(),
            content: req.body.content,
            isConfScheduled: true,
            attachment: req.body.attachment,
            dept: req.body.attachment,
            comentIds: []
        }
    ).then((result) => {
        console.log(result._id);
        res.status(201).send(result);
    });

    // console.log(task);

    // res.status(201).send(task);
};
//TODO: 소영 - 이슈 전체 가져오기
/*
    GET /api/issue/get
    {
        projectName
    }
*/
exports.getAll = (req, res, next) => {

};

//TODO: 소영 - 이슈 상세 가져오기
/*
    GET /api/issue/get/:id
*/
exports.getComments = (req, res, next) => {
    // TODO: 윤영이한테 pageNum 받아서 보낼 때는 그 갯수만큼만 -> 배열로 보내지 않음 
    var issueId = req.params.id;

    model_mg.Issue.tasks.findOne({
        _id: issueId
    }).then((result) => {
        console.log(result);
        res.status(201).send(result);
    });
};
