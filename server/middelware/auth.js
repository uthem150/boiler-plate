const { User } = require("../models/Users");

let auth = (req, res, next) => {
  //client 쿠키에서 x_auth라는 변수명으로 넣었던 토큰 가져옴
  let token = req.cookies.x_auth;

  //토큰을 decoding한 후, 유저 찾음
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    //유저가 있으면, 토큰 넣어줌
    req.token = token;
    req.user = user;

    //미들웨어 끝내고 다음으로 이동
    next();
  });
};

module.exports = { auth };
