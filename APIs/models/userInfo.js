const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

const userInfoSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    name_en: String,
    profile_img: {
        type: String,
        default: "FIXME: default img 경로"
    },
    company: ObjectId,
    dept: ObjectId
});

module.exports = mongoose.model('UserInfo', userInfoSchema);