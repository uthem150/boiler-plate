const mongoose = require("mongoose");

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

// 모델로 schema 감쌈. (모델의 이름, 스키마)
const User = mongoose.model("User", userSchema);

module.exports = { User };
