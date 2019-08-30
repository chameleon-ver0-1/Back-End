//TODO: project 스키마 생성
module.exports = (mongoose) => {
    return mongoose.model('project', 
    mongoose.Schema({
        // _id : ObjectId, //자동생성됨
        name: {
            type: String,
            required: true,
            unique: true
        },
        roles: [String]
    }));
}
