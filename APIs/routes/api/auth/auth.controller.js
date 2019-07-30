//var _DBPool = require('../lib/_DBPool');
// var mysql = require('mysql');

// // FIXME: DB Pool 지정된 위치에서 관리
// var pool = mysql.createPool({
//     host     : process.env.MYSQL_HOST,
//     port     : process.env.MYSQL_PORT,
//     database : process.env.MYSQL_DB_INFO,
//     user     : process.env.MYSQL_USER_INFO,
//     password : process.env.MYSQL_PW,
//     multipleStatements : true,
//     connectionLimit: 150,
//     multipleStatements: true,
//     charset  : 'utf8'
// });

const jwt = require('jsonwebtoken');
var user = require('../../../models/UserInfo');

require('dotenv').config({path: __dirname + '\\' + '.env'});

signToken = user => {
  return jwt.sign({
    iss: 'Chameleon',
    sub: user.email,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() +1) // current time + 1 day ahead
  }, process.env.JWT_SECRET);
}

var User = require('../../../models/UserInfo');

/*
    GET /api/auth/duplicateEmail
        ?email={email}
 */
exports.duplicateEmail = (req, res) => {
    const email = req.query.email;

    User.find({"email":email});

    // const sql = "select * from user_info where email='" + email + "'";
    
    // pool.getConnection(function(err, conn){
    //     if(!err){
    //         console.log('MySql Connection Success');
    //     }

    //     conn.query(sql, function(err, rows, fields) {
    //         console.log('sql query executing...');
    //         conn.release();

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
};

/*
    POST /api/auth/register
    {
        username,
        password
    }
*/
exports.register = (req, res) => {
    res.status(200).send('this router is working');
};

/*
    POST /api/auth/signIn
    {
        email,
        password
    }
 */
exports.signIn = (req, res, next) => {
    // res.status(200).json({email:req.body.email, password:req.body.password}); // Success

    // TODO: DB에 연결해서 로그인
    // User.findOne({
    //     where: { email: req.body.email }
    // }).then(function(user) {
    //     if (user && req.body.password === user.password) {
            res.status(200).json({
                token: signToken(req.user),
                message:"signIn success"
            });
    //     } else {
    //         res.status(404).send('Failed : User not found');
    //         throw err
    //     }
    // }).catch(function(err) {
    //     res.status(500).send('Cannot connect mongoDB');
    // });
}