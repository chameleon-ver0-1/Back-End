const mongoosePaginate = require('mongoose-paginate');

conf_logs = (mongoose) => { 
    const schema = new mongoose.Schema({
        title : String,
        startTime : Date,
        endTime : Date,
        mainTopics : [String],
        totalLogFile : String,//정제되지 않은(전체 회의기록) txt 파일이 있는 경로
        projectId : { type: mongoose.Schema.Types.ObjectId}, 
        details : [{ type: mongoose.Schema.Types.ObjectId}]
    });
    schema.plugin(mongoosePaginate);
    return mongoose.model('conf_log', schema );
};

conf_log_detail = (mongoose) => { return mongoose.model('conf_log_detail', 
    mongoose.Schema({
        keywords : [String],
        contents : [String] //주제별 요약된 회의내용
    })
)};

module.exports = (mongoose) => {
    return conf_log = {
        conf_logs: conf_logs(mongoose),
        conf_log_detail: conf_log_detail(mongoose)
    };
}
