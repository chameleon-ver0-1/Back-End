conf_logs = (mongoose) => { return mongoose.model('conf_logs', 
    mongoose.Schema({
        status: String,
        title : String,
        startTime : Date,
        endTime : Date,
        mainTopics : [String],
        totalLogFile : String,
        projectId : { type: mongoose.Schema.Types.ObjectId}, //project의 _id를 말하는건가 
        details : [{ type: mongoose.Schema.Types.ObjectId}]
    })
)};

conf_log_detail = (mongoose) => { return mongoose.model('conf_log_detail', 
    mongoose.Schema({
        keywords : [String],
        contents : [String]
    })
)};

module.exports = (mongoose) => {
    return conf_log = {
        conf_logs: conf_logs(mongoose),
        conf_log_detail: conf_log_detail(mongoose)
    };
}
