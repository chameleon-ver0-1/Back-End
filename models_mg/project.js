//TODO: project 스키마 생성
module.exports = (mongoose) => {
    return mongoose.model('project', 
    mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        roles: [String]
    }));
};
