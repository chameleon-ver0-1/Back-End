const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy  = require('passport-local').Strategy;
//const GooglePlusTokenStrategy = require('passport-google-plus-token');

const model = require('../../../models');
require('dotenv').config({path: __dirname + '\\' + '.env'});

/* JSON WEB TOKENS STRATEGY */
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  try {
    // Find the user specified in token
    model.User.findOne({
                        where : {email : payload.sub}
                      })
                      
    .then((user) => {
      // If user doesn't exist
      if(!user) {
        return done(null, false);
      }

      // If user exists
      done(null, user);
    });

  } catch (error) {
    done(error, false);
  }
}));

/* GOOGLE OAUTH STRATEGY */
// passport.use('googleToken', new GooglePlusTokenStrategy({
//   clientID: keys.googleClientID,
//   clientScret: keys.googleClientSecret
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     // console.log('accessToken', accessToken);
//     // console.log('refreshToken', refreshToken);
//     // console.log('profile', profile);
//     const name = profile.name.familyName + ' ' + profile.name.givenName;

//     // Check whether this current user exists in our DB
//     const exUser = await User.findOne({ "uid": profile.id});
//     if(exUser) {
//       return done(null, exUser);
//     }

//     // If new account
//     const newUser = new User({
//         email: profile.emails[0].value,
//         userName: profile.displayName,
//         profile_image: profile.photos[0].value,
//         name: name,
//         provider: profile.provider,
//         uid: profile.id,
//     });

//     await newUser.save();
//     done(null, newUser);

//   } catch (error) {
//     done(error, false, error.message);
//   }
// }));

/* LOCAL STRATEGY */
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Find a user with Email
    model.User.findOne({
                        where : { email : email } 
                      })

    .then((user) => {
      // If user doesn't exist
      if (!user) {
        return done(null, false);
      }

      if (user.password === password) {
        done(null, user);
      } else {
        return done(null, false);
      }       
    });

    } catch (error) {
      done(error, false);
    }
}));

module.exports = {
   passportSignIn: passport.authenticate('local', {session: false }),
   passportJWT: passport.authenticate('jwt', { session: false }),
//   passportGoogle: passport.authenticate('googleToken', { session: false }),
//   passportFacebook: passport.authenticate('facebookToken', { session : false }),
}