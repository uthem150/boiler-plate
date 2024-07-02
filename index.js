const express = require("express"); //express 모듈을 가져옴
const app = express(); //새로운 express app생성
const port = 5000; /// 서버가 사용할 포트 설정
const { User } = require("./models/Users"); //유저 모델을 가져옴

//미들웨어 설정
app.use(express.json()); //JSON 형식 본문 파싱
app.use(express.urlencoded({ extended: true })); //URL-encoded 형식 본문 파싱

//mongoose 모듈을 통해 MongoDB 데이터베이스와 연결
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://ynmhobby:rHFLIhbz9wNINzVh@boiler-plate.eiv3gwi.mongodb.net/?retryWrites=true&w=majority&appName=boiler-plate",
    {}
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 회원가입 위한 라우트
app.post("/register", async (req, res) => {
  // 클라이언트가 보낸 데이터를 받아 새로운 User 객체 생성
  const user = new User(req.body);

  await user
    .save()
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        success: false,
        err: err,
      });
    });
});

//서버를 port 번호(5000)로 시작
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
