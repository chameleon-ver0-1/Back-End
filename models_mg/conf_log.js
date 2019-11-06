const mongoosePaginate = require('mongoose-paginate');

conf_logs = (mongoose) => { 
    const schema = new mongoose.Schema({
        title : String,
        startTime : Date,
        endTime : Date,
        members : [String],
        mainTopics : [String],
        totalLogFile : String,  //정제되지 않은(전체 회의기록) txt 파일이 있는 경로
        roomId: String,
        projectId : { type: mongoose.Schema.Types.ObjectId, ref: 'project'}, 
        detailId : { type: mongoose.Schema.Types.ObjectId, ref: 'conf_log_detail'}
    });
    schema.plugin(mongoosePaginate);
    return mongoose.model('conf_log', schema );
};

conf_log_detail = (mongoose) => { return mongoose.model('conf_log_detail', 
    mongoose.Schema({
        keywords : [Object],
        contents : [Object]
    })
)};

module.exports = (mongoose) => {
    return conf_log = {
        conf_logs: conf_logs(mongoose),
        conf_log_detail: conf_log_detail(mongoose)
    };
}
