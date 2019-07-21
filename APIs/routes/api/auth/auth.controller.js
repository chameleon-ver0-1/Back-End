var _DBPool = require('../lib/_DBPool');

/*
    GET /api/auth/duplicateEmail
        ?email={email}
 */
exports.duplicateEmail = (req, res) => {
    const email = req.query.email;
    const sql = "select * from user_info where email='" + email + "'";

    // TODO: DB Pool 위치 어디에 유지할건지
    // FIXME: pool is not definded
    pool.getConnection(function(err, conn){
        if(!err){
            console.log('MySql Connection Error!');
        }

        conn.query(sql, function(err, rows, fields) {
            console.log('sql query executing...');
            conn.release();

            if (err) {
                console.log('Error while performing Query.', err);
            }
    
            console.log('rows => ', rows);
    
            if (!rows.length)
                return res.status(200).json({message: "이메일 사용 가능", data : false});
            else
                return res.status(400).json({message: "이미 존재하는 메일주소", data : false});
        });
      });

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