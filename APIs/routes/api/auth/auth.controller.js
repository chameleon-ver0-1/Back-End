const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcrypt');
var { User } = require('../../../models');

require('dotenv').config({path: __dirname + '\\' + '.env'});

signToken = (email, password) => {
  return jwt.sign({
    iss: 'Chameleon',
    sub: email,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() +1) // current time + 1 day ahead
  }, process.env.JWT_SECRET);
};

/* login */
exports.signIn = (req, res, next) => {
    console.log("email => " + req.body.email);

    // const token = signToken(req.body.email, req.body.password);
    // res.status(200).json({token: token});

    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }

        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }

            return res.redirect('/');
        });
    });
};

/*
    GET /api/auth/duplicateEmail
        ?email={email}
 */
exports.duplicateEmail = (req, res) => {
    const email = req.query.email;

    User.find({"email":email});
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