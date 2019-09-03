const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const model = require("../../../models");

require("dotenv").config({ path: __dirname + "\\" + ".env" });

signToken = (email, password) => {
  return jwt.sign(
    {
      iss: "Chameleon",
      sub: email,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    },
    // process.env.JWT_SECRET
    'chameleon_secret'
  );
};

/* join */
exports.join = async (req, res, next) => {
  // TODO: 회원가입 메소드 구현

  // const { email, password, name } = req.body;
  // try {
  //   const exUser = await User.find({ where: { email : email } });
  //   if (exUser) {
  //     res.status(202).json({ status : "이미 가입된 이메일입니다.",
  //                            });
  //   }

  //   const hash = await bcrypt.hash(password, 24);
  //   await User.create({
  //     email,
  //     nick,
  //     password: hash
  //   });
  //   return res.redirect("/");
  // } catch (error) {
  //   console.error(error);
  //   return next(error);
  // }
};

/*
    POST /api/auth/signIn
    {
        email,
        password
    }
*/
exports.signIn = (req, res, next) => {
  const email = req.user.email;

  console.log("signIn: " + new Date().getTime() + ", email => " + email);
  const token = signToken(email);
  var userInfo;

  try {

    model.User.findOne({ where: {email: email}})

    .then((user) => {
      userInfo = {
        email: user.email,
        name: user.name,
        name_en: user.name_en,
        profile_img: user.profile_img,
        certificatedYn: user.certificatedYn
      }

      res.status(201).json({
        message: "로그인 성공",
        data: {
          accessToken: {
            token: token,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + 1)
          },
          userInfo: userInfo
        }
      });
    });

  } catch (err) {
    res.status(400).json({
      message: "유저 정보 로드 중 에러 발생"
    });
  }
};


// jwt test
exports.register = (req, res) => {
  res.status(200).send("this router is working");
};
