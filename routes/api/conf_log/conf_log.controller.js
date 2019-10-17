const model = require('../../../models');
const model_mg = require('../../../models_mg');
require("dotenv").config({
    path: __dirname + "\\" + ".env"
});

//201 - 성공 / 202 - 실패같은성공 / 400 - 잘못된 요청

/*
    get /api/conf_log/list/:projectId?pageNo=1
    {
        
    }
*/
exports.list = async (req, res, next) => {
    var projectId;
    var pageNo = 1;
    var confLogs=[];
    var options;
    try {
        projectId = req.params.projectId;
        pageNo = req.query.pageNo;
        options = {
          page: parseInt(pageNo, 10) || 1,
          limit: 10,
          sort: {endTime : -1} //끝나는 시간을 기준으로 역순정렬
        };
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Please check Params',
            data : false
        });
    }
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

/*
    get /api/conf_log/search/:projectId?search=지후
    {
        
    }
*/
exports.search = async (req, res, next) => {
    var projectId;
    var search;
    var confLogs=[];
    var options;
    try {
        projectId = req.params.projectId;
        search = req.query.search;
        
        options = {
          page: 1,
          limit: 10,
          sort: {endTime : -1} //끝나는 시간을 기준으로 역순정렬
        };
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Please check Params',
            data : false
        });
    }
    await model_mg.Conf_log.conf_logs.paginate({
        projectId : projectId,
        title : new RegExp(search)
    },options)
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
                    message: '검색 성공',
                    data: {
                        confLogs : confLogs,
                        total : result.total,
                        limit : result.limit,
                        page : result.page,
                        pages : result.pages
                    }
                });
            }
        } else {
            res.status(202).json({
                message: '검색 실패',
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

/*
    get /api/conf_log/detail/:projectId/:detailId
    {
        
    }
*/
//TODO: conf_log의 detailId도 update해줘야함.
exports.detail = async (req, res, next) => {
    var projectId;
    var detailId;
    var title;
    var startTime;
    var endTime;
    try {
        projectId = req.params.projectId;
        detailId = req.params.detailId;
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Please check Params',
            data: false
        });
    }

    await model_mg.Conf_log.conf_logs.findOne({
        detailId : detailId
    }).then((result)=>{
        if(!result){
            res.status(202).json({
                message: '존재하지않는 회의록',
                data: false
            });
        }
        title = result.title;
        startTime = result.startTime;
        endTime = result.endTime;
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({
            message: '서버 오류',
            data: false
        });
    });

    await model_mg.Conf_log.conf_log_detail.findOne({
        _id : detailId
    }).then((result)=>{
        if(!result){
            res.status(202).json({
                message: '존재하지않는 회의록',
                data: false
            });
        }
        //TODO: title, startTime, endTime, keyword, contents
        res.status(201).json({
            message: '회의록 상세보기',
            data: {
                title : title,
                startTime : startTime,
                endTime : endTime,
                keyword : result.keywords,
                contents : result.contents
            }
        });
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({
            message: '서버 오류',
            data: false
        });
    });
};