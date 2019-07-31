const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy  = require('passport-local').Strategy;

const { User } = require('../../../models');
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  User.find({ where: { email }})
    .then(user => done(null, user))
    .catch(err => done(err));
});

// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: keys.JWT_SECRET
}, async (payload, done) => {
  try {
    // Find the user specified in token
    const user = await User.findById(payload.sub);

    // if user doesn't exists, handle it
    if(!user) {
      return done(null, false);
    }

    // Otherwise, return the user
    done(null, user);
  } catch (error) {
    done(error, false);
  }
}));

// FIXME: KEY 변경 
// FACEBOOK OAUTH STRATEGY
// passport.use('facebookToken', new FacebookTokenStrategy({
//   clientID: keys.facebookClientID,
//   clientSecret: keys.facebookClientSecret
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     // console.log('profile', profile);
//     // console.log('accessToken', accessToken);
//     // console.log('refreshToken', refreshToken);
//     const name = profile.name.familyName + ' ' + profile.name.givenName;

//     const existingUser = await User.findOne({ "uid": profile.id });
//     if(existingUser) {
//       return done(null, existingUser);
//     }

//     const newUser = new User({
//         email: profile.emails[0].value,
//         userName: profile.displayName,
//         name: name,
//         profile_image: profile.photos[0].value,
//         provider: profile.provider,
//         uid: profile.id,
//     });

//     await newUser.save();
//     done(null, newUser);
//   } catch(error) {
//     done(error, false, error.message);
//   }
// }));

// FIXME: KEY 변경 
// GOOGLE OAUTH STRATEGY
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
//     const existingUser = await User.findOne({ "uid": profile.id});
//     if(existingUser) {
//       return done(null, existingUser);
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

// LOCAL STRATEGY
passport.use(new LocalStrategy({
usernameField: 'email',
passwordField: 'password'
}, async (email, password, done) => {
        try {
            const user = await User.find({ where: { email } });

            if (user) {
              const result = await bcrypt.compare(password, user.password);
              if (resuilt) {
                done(null, user);
              } else {
                done(null, false, { message:'비밀번호가 일치하지 않습니다.' });
              }
            } else {
              done(null, false, { message:'가입되지 않은 회원입니다.'});
            }

          } catch (error) {
            console.error(error);
            done(error);
          }
    }
));

module.exports = {
   passportSignIn: passport.authenticate('local', {session: false }),
   passportJWT: passport.authenticate('jwt', { session: false })
  }