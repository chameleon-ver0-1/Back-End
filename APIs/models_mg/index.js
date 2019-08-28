'use strict';

const mongoose    = require('mongoose');
const env = process.env.NODE_ENV || 'development';
const db = {};

//TODO: 예지 - MongoDB 연결
var mongodb = mongoose.connection;
mongodb.on('error', console.error);
mongodb.once('open', function(){
    console.log("Connected to mongod server");
});
mongoose.connect('mongodb://localhost/develop');

//TODO: 예지 - 모델 생성(의문..=db변수의 존재의이유)
db.mongoose = mongoose;
db.Project = require('./project')(mongoose);
mongoose.model('project', db.Project);

module.exports = db;