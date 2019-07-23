const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config({path: __dirname + '\\' + '.env'});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

/* mySql Connection */
var mysql = require('mysql');
// TODO: DB Pool 위치 어디에 유지할건지
var pool = mysql.createPool({
    host     : process.env.MYSQL_HOST,
    port     : process.env.MYSQL_PORT,
    database : process.env.MYSQL_DB_INFO,
    user     : process.env.MYSQL_USER_INFO,
    password : process.env.MYSQL_PW,
    multipleStatements : true,
    connectionLimit: 150,
    multipleStatements: true,
    charset  : 'utf8'
});

// configure api router
app.use('/api', require('./routes/api'));

/** PORT LISTENING */
app.listen(4000, () => {
    console.log('Express가 4000번 포트에서 리스닝 중이라네!');
});