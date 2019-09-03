module.exports = (mongoose) => {
    return mongoose.model('conf_room', 
    mongoose.Schema({
        title : String,
        organName : String, 
        organNameEn : String,
        members : [String],
        startTime : Date,
        mainTopics : [String],
        projectId :{ type: mongoose.Schema.Types.ObjectId}
    }));
};