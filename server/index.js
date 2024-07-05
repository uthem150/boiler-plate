const express = require("express"); //express 모듈을 가져옴
const app = express(); //새로운 express app생성
const port = 5000; /// 서버가 사용할 포트 설정
const cookieParser = require("cookie-parser");
const config = require("./config/key");

const { User } = require("./models/Users"); //유저 모델을 가져옴
const { auth } = require("./middelware/auth");

//미들웨어 설정
app.use(express.json()); //JSON 형식 본문 파싱
app.use(express.urlencoded({ extended: true })); //URL-encoded 형식 본문 파싱
app.use(cookieParser()); //쿠키 파싱

//mongoose 모듈을 통해 MongoDB 데이터베이스와 연결
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//루트 경로에 대한 GET 요청 처리
app.get("/", (req, res) => {
  res.send("Hello World~!");
});

// 회원가입 위한 라우트
app.post("/api/users/register", async (req, res) => {
  // 클라이언트가 보낸 데이터를 받아 새로운 User 객체 생성
  const user = new User(req.body);

  //사용자 데이터 MongoDB에 저장
  try {
    await user.save();
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      err: err,
    });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    // 이메일 기반으로 사용자 DB에서 찾음
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당되는 유저가 없습니다",
      });
    }
    //유저가 DB에 있다면, 비밀번호가 일치하는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다",
        });

      //비밀번호가 맞다면 토큰 생성 (성공하면 token이 들어있는 유저가 반환됨)
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err); //토큰 생성 실패시 client에게 전달

        //쿠키에 x_auth를 변수명으로 토큰 저장하고, client에게 응답
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  } catch (err) {
    return res.status(500).json({
      loginSuccess: false,
      message: "서버 에러가 발생했습니다.",
      error: err,
    });
  }
});

//사용자가 인증되었는지 확인(auth 미들웨어를 사용하여 요청을 처리하기 전에 사용자를 인증)
app.get("/api/users/auth", auth, (req, res) => {
  //미들웨어를 통과한다면, 사용자 정보와 인증 상태를 JSON 형식으로 응답
  res.status(200).json({
    _id: req.user._id,
    //role 0 : admin , role 1 : 일반유저
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { token: "" } // 토큰을 지워줌
    );
    return res.status(200).send({
      success: true,
    });
  } catch (err) {
    return res.json({ success: false, err });
  }
});

//서버를 port 번호(5000)로 시작
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
