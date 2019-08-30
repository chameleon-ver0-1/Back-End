'use strict';

const mongoose    = require('mongoose');
const env = process.env.NODE_ENV || 'development';
const db = {};

//TODO: 예지 - MongoDB 연결
var mongodb = mongoose.connection;

mongodb.on('error', console.error);
mongodb.once('open', function(){
    console.log("Connected to mongodb server");
});
mongoose.connect('mongodb://localhost/develop');

db.mongoose = mongoose;
db.Project = require('./project')(db.mongoose);
db.Issue = require('./issue')(db.mongoose);

module.exports = db;