module.exports = (mongoose) => {
    return mongoose.model('conf_room', 
    mongoose.Schema({
        title : String,
        members : [String],
        mainTopics : [String],
        startTime : Date,
        endTime : Date,
        projectId :{ type: mongoose.Schema.Types.ObjectId}
    }));
};