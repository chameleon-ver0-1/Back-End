const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
    projectName : {
        type: String,
        required: true
    },
    tasks : {
    },
    columns : {}
});

const commentSchema = new Schema({

});