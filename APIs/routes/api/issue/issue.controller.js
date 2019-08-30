const model = require('../../../models');
const model_mg = require('../../../models_mg');
require("dotenv").config({ path: __dirname + "\\" + ".env" });

//201 - 성공 / 202 - 실패같은성공

//TODO: 소영 -> 이슈 생성
/*
    post /api/issue/create
    {
        projectName
    }
*/
exports.create = (req,res,next) =>{
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
    GET /api/project/list
    {
    }
*/
exports.getOne = (req, res, next) => {
};
