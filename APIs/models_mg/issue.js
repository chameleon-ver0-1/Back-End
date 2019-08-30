issue_columns = (mongoose) => { return mongoose.model('issue_columns', 
    mongoose.Schema({
        status: String,
        taskIds: [mongoose.Schema.Types.ObjectId],
        projectId: mongoose.Schema.Types.ObjectId,
    })
)};

issue_tasks = (mongoose) => { return mongoose.model('issue_tasks', 
    mongoose.Schema({
        title: String,
        dDay: Date,
        content: String,
        isConfScheduled: Boolean,
        attachment: String,
        dept: String,
        comentIds: [mongoose.Schema.Types.ObjectId] 
    })
)};

issue_comments = (mongoose) => { return mongoose.model('issue_comments',
    mongoose.Schema({
        email: String,
        name: String,
        name_en: String,
        profileImg: String,
        content: String
    })
)};

module.exports = (mongoose) => {
    return issue = {
        columns: issue_columns(mongoose),
        tasks: issue_tasks(mongoose),
        comments: issue_comments(mongoose)
    }
}
