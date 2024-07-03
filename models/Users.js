const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10; //bcrypt 해시 함수에 사용될 salt의 라운드 수를 설정

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //빈칸 없애주는 역할
    unique: 1, //동일한 email을 쓰지 못하도록
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  // 관리자와 일반 유저 구분 위함
  role: {
    type: Number,
    default: 0, //지정하지 않으면, 기본값 0
  },
  image: String,
  // 유효성 관리 위한 token
  token: {
    type: String,
  },
  //토큰 유효기간
  tokenExp: {
    type: Number,
  },
});

//DB에 저장하기 전에 할 작업 정의. 작업을 끝난 뒤에 next로 이동
userSchema.pre("save", function (next) {
  var user = this; //현재 저장하려는 사용자 문서

  //비밀번호 해시를 위한 salt 생성
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) return err;
    //비밀번호를 바꿀 때만 암호화 하도록 설정
    if (user.isModified("password")) {
      //비밀번호 해시화
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);

        // 암호화된 비밀번호로 교체
        user.password = hash;
        next();
      });
    }
  });
});

// 모델로 schema 감쌈. (모델의 이름, 스키마)
const User = mongoose.model("User", userSchema);

module.exports = { User };
