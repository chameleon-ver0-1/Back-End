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
                    detailId : confLog.detailId
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
        var keywords = [];
        var contents = [];
        result.keywords.forEach((data)=>{
            var keyword = [];
            keyword.push(data.keyword);
            keyword.push(data.value);
            keywords.push(keyword);
        });
        // result.contents.forEach((data)=>{
        //     var content = [];
        //     content.push(data.topic);
        //     content.push(data.content);
        //     contents.push(content);
        // });

        res.status(201).json({
            message: '회의록 상세보기',
            data: {
                title : title,
                startTime : startTime,
                endTime : endTime,
                keywords : keywords,
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

// TODO: create conf_log_detail
/*
    post /api/conf_log/create/:roomId
    {
        keywords
        cotents
    }
*/
exports.create = async (req, res, next) => {
    var roomId;
    var keywords;
    var contents;

    try {
        roomId = req.params.roomId;
        keywords = req.body.keywords;
        contents = req.body.contents;
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Please check Params',
            data: false
        });
    }

    await model_mg.Conf_log.conf_log_detail.create({
        keywords : keywords,
        contents : contents
    }).then((result) => {
        if(!result){
            res.status(202).json({
                message: '회의록(상세) 생성 실패',
                data: false
            });
        }

        console.log('생성된 회의록 아이디 -#-#-> ', result._id);

        model_mg.Conf_log.conf_logs.findOneAndUpdate({
            roomId : roomId
        }, {
            $set: {
                detailId: result._id
            },
        }).then((data) => {
            if(!data){
                res.status(202).json({
                    message: 'DB 오류',
                    data: false
                });
            }
            res.status(201).json({
                message: '회의록(상세) 생성 성공',
                data: result
            });
        });
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({
            message: '서버 오류',
            data: false
        }); 
    });
};

/*
    post /api/conf_log/isCreate/:confLogId
    {
       
    }
*/
exports.isCreate = async (req, res, next) => {
    var confLogId;
    try {
        confLogId = req.params.confLogId;
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Please check Params',
            data: false
        });
    }

    // conf_log에서 detailId가 null일때 생성이 아직 안된것으로 판단
    model_mg.Conf_log.conf_logs.findOne({
        _id : confLogId
    }).then((result)=>{
        if(!result){
            res.status(202).json({
                message: '존재하지 않는 회의록',
                data: false
            });
        }
        console.log(result.detailId);
        
        if(result.detailId == undefined){
            res.status(202).json({
                message: '회의록 생성중',
                data: false
            });
        }
        else{
            res.status(202).json({
                message: '회의록 생성완료',
                data: {
                    detailId : result.detailId
                } 
            });
        }
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({
            message: '서버 오류',
            data: false
        }); 
    });
};