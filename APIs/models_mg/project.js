//TODO: project 스키마 생성
module.exports = (mongoose) => {
    return mongoose.Schema({
        // _id : ObjectId, //자동생성됨
        name: String,
        roles: [String]
    });
}
