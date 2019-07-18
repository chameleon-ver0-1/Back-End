const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config({path: __dirname + '\\' + '.env'});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

/* mySql Connection */
var mysql = require('mysql');
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

conn.connect();

// configure api router
app.use('/api', require('./routes/api'));



// /** API METHOD */
// app.get('/api/signup/duplicateEmail', (req, res) => { // 이메일 중복 체크
//     const email = req.query.email || '';
//     console.log("email is => " + email);
//     const sql = "select * from user_info where email='" + email + "'";
//     conn.query(sql, function(err, rows, fields) {
//         if (err) {
//             console.log('Error while performing Query.', err);
//         }

//         console.log('rows => ', rows);

//         if (!rows.length)
//             return res.status(200).json({message: "이메일 사용 가능", data : false});
//         else
//             return res.status(400).json({message: "이미 존재하는 메일주소", data : false});
//     });
// });
// app.get('/api/users', (req, res) => {
//     const sql = "SELECT * FROM user_info";
//     conn.query(sql, function(err, rows, fields) {
//         if (!err) {
//             return res.json(rows);
//         } else {
//             return res.status(400).json(rows);
//         }
//     });
// });
// app.get('/api/users/:email', (req, res) => {
//     const email = parseInt(req.params.email);
//     const sql = "SELECT * FROM ";
// });
// app.post('/api/users', (req, res) => {  // CREATE USER
//     const email = req.body.email || '';
//     const passwd = req.body.passwd || '';
//     const name_ko = req.body.name_ko || '';
//     const name_en = req.body.name_en || '';
//     const company = req.body.company || '';
//     const dept = req.body.dept || '';

//     if (!email.length || !passwd.length || !name_ko.length) {
//         return res.status(400).json({});
//     }

//     const isEmailExists = "select EXISTS (select * from user_info where email='" + email + "') as success";
//     conn.query(isEmailExists, function(err, rows, fields) {
//         if (!err) {
//             if (rows[0].success === 1)
//                 return res.status(400).json({error : 'Email already exists'});
//         } else {
//             console.log('Error while performing Query.', err);
//         }
//     });

//     const sql = "INSERT INTO user_info ('email', 'passwd', 'name_ko', 'name_en', 'company', 'dept') VALUES ('"+email+"', '"+passwd+"', '"+name_ko+"', '"+name_en+"', '"+company+"', '"+dept+"')";
//     conn.query(sql, function(err, rows, fields) {
//         if (!err) 
//             return res.status(201).json({success : 'user created'});
//         else
//             console.log('Error while performing Query.', err);
//     });
// });

/** PORT LISTENING */
app.listen(4000, () => {
    console.log('Express가 4000번 포트에서 리스닝 중이라네!');
});