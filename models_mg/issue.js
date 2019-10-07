issue_column = (mongoose) => { return mongoose.model('column', 
    mongoose.Schema({
        status: String,
        taskIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'task'}],
        projectId: {type: mongoose.Schema.Types.ObjectId, ref: 'project'},
    })
)};

issue_task = (mongoose) => { return mongoose.model('task', 
    mongoose.Schema({
        title: String,
        dDay: Date,
        dTime: String,
        content: String,
        isConfScheduled: Boolean,
        attachment: String,
        dept: String,
        writerName: String,
        writerNameEn: String,
        writerImg: String,
        commentIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'comment'}]
    })
)};

issue_comment = (mongoose) => { return mongoose.model('comment',
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
        column: issue_column(mongoose),
        task: issue_task(mongoose),
        comment: issue_comment(mongoose)
    }
}
