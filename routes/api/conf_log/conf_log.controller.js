const model = require('../../../models');
const model_mg = require('../../../models_mg');
require("dotenv").config({
    path: __dirname + "\\" + ".env"
});

//201 - 성공 / 202 - 실패같은성공 / 400 - 잘못된 요청

/*
    get /api/conf_log/list/:projectId?pageNo=1&size=10
    {
        
    }
*/
exports.list = async (req, res, next) => {
    var projectId;
    var pageNo = 1;
    var size =10;
    var confLogs=[];
    var options;
    try {
        projectId = req.params.projectId;
        size = req.query.size;
        pageNo = req.query.pageNo;
        options = {
          page: parseInt(pageNo, 10) || 1,
          limit: parseInt(size, 10) || 10,
        };
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Please check Params',
            data : false
        });
    }
    //TODO: 페이징처리해야함
    await model_mg.Conf_log.conf_logs.paginate({
        projectId : projectId},options)
        .then((result) => {
        if (result) {
            result.docs.forEach((confLog) => {
                confLogs.push({
                    id: confLog._id,
                    title: confLog.title,
                    startTime : confLog.startTime,
                    endTime : confLog.endTime,
                    mainTopics : confLog.mainTopics,
                    totalLogfile : confLog.totalLogfile,
                    details : confLog.details
                });
            });
            if (confLogs.length === result.docs.length) {
                res.status(200).json({
                    message: '목록 조회 성공',
                    data: {
                        confLogs : confLogs,
                        total : result.total,
                        limit : result.limit,
                        page : result.page,
                        pages : result.pages
                    }
                });
            }
            console.log(result);
            
        } else {
            res.status(202).json({
                message: '목록 조회 실패',
                data: false
            });
        }
    }).catch((e)=>{
        console.log(e);
        res.status(500).json({
            message: '서버 오류',
            data: false
        });
    });
};