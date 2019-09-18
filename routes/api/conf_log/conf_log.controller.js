const model = require('../../../models');
const model_mg = require('../../../models_mg');
require("dotenv").config({
    path: __dirname + "\\" + ".env"
});

//201 - 성공 / 202 - 실패같은성공 / 400 - 잘못된 요청

/*
    get /api/conf_log/list
    {
        
    }
*/
exports.list = (req, res, next) => {
    model_mg.Conf_log.findAll({
        attributes: ['title','startTime','endTime','mainTopics']
    }).then(async (data) => {
        if (data) {
            res.status(201).json({
                message: '목록 가져오기 성공',
                data: data
            });
        } else {
            res.status(202).json({
                message: '목록 가져오기 실패',
                data: false
            });
        }
    });
};