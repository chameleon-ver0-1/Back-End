// FIXME: DB Pool 지정된 위치에서 관리
// require('dotenv').config({path: __dirname + '\\' + '.env'});

// var generic_pool = require('generic-pool');
// var mysql = require('mysql');
// var pool = generic_pool.Pool({
//     name: 'mysql',
//     create: function(callback) {
//         var config = {
//             host     : process.env.MYSQL_HOST,
//             port     : process.env.MYSQL_PORT,
//             database : process.env.MYSQL_DB_INFO,
//             user     : process.env.MYSQL_USER_INFO,
//             password : process.env.MYSQL_PW,
//             charset  : 'utf8'
//         }
//         var client = mysql.createConnection(config);
//         client.connect(function (error){
//             if(error){
//                 console.log(error);
//             }
//             callback(error, client);
//         });
//     },
//     destroy: function(client) {
//         client.end();
//     },
//     min: 7,
//     max: 10,
//     idleTimeoutMillis : 300000,
//     log : true
// });

// process.on("exit", function() {
//     pool.drain(function () {
//         pool.destroyAllNow();
//     });
// });

// module.exports = pool;
