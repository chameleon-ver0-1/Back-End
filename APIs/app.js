const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

/* mySql Connection */
var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '262908',
  port     : 3306,
  database : 'userInfo'
});

conn.connect();



let users = [
    {
        id: 1,
        name: 'onisley'
    },
    {
        id: 2,
        name: 'kwon'
    },
    {
        id: 3,
        name: 'kidel'
    }
];

/** API MOTHOD */
app.post('/users', (req, res) => {  // CREATE USER
    const email = req.body.email || '';
    const passwd = req.body.passwd || '';
    const name_ko = req.body.name_ko || '';
    const name_en = req.body.name_en || '';
    const company = req.body.company || '';
    const dept = req.body.dept || '';

    if (!email.length || !passwd.length || !name_ko.length) {
        return res.status(400).json({error : 'Incorrect data'});
    }

    const isEmailExists = "select EXISTS (select * from user_info where email='" + email + "') as success";
    conn.query(isEmailExists, function(err, rows, fields) {
        if (!err) {
            if (rows[0].success === 1)
                return res.status(400).json({error : 'Email already exists'});
        } else {
            console.log('Error while performing Query.', err);
        }
    });

    const sql = "INSERT INTO user_info ('email', 'passwd', 'name_ko', 'name_en', 'company', 'dept') VALUES ('"+email+"', '"+passwd+"', '"+name_ko+"', '"+name_en+"', '"+company+"', '"+dept+"')";
    conn.query(sql, function(err, rows, fields) {
        if (!err) 
            return res.status(201).json({success : 'user created'});
        else
            console.log('Error while performing Query.', err);
    });
});

/** PORT LISTENING */
app.listen(3000, () => {
    console.log('Express가 3000번 포트에서 리스닝 중이라네!');
});