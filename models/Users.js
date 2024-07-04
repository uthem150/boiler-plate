const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10; //bcrypt 해시 함수에 사용될 salt의 라운드 수를 설정
const jwt = require("jsonwebtoken");

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
    } else {
      //비밀번호 바꾸는게 아닐 때
      next();
    }
  });
});

//새로운 인스턴스 메서드 추가
userSchema.methods.comparePassword = function (plainPassword, cb) {
  //받은 PW를 암호화해서, DB에 저장된 암호화된 PW와 비교
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    //비밀번호가 같지 않다면 콜백 함수에 오류 전달
    if (err) return cb(err);

    //비밀번호가 같다면 - 콜백 함수에 'err: null', 'isMatch: true'전달
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = async function (cb) {
  //현재 사용자 문서 '참조'
  var user = this;

  //jsonwebtoken의 sign메소드 이용해서, token 생성
  var token = jwt.sign({ _id: user._id.toHexString() }, "secretToken"); // user._id + 'secretToken' = token

  // 생성된 토큰을 user 객체의 token 필드에 저장
  user.token = token;
  try {
    await user.save();
    cb(null, user);
  } catch (err) {
    cb(err);
  }
};

userSchema.statics.findByToken = async function (token, cb) {
  try {
    //토큰을 decode
    const decoded = jwt.verify(token, "secretToken");

    //유저 id를 이용해서 유저를 찾음
    const user = await this.findOne({ _id: decoded, token: token });
    if (!user) {
      return cb(null, null); // 유저가 없을 경우
    }

    cb(null, user);
  } catch (err) {
    cb(err);
  }
};

// 모델로 schema 감쌈. (모델의 이름, 스키마)
const User = mongoose.model("User", userSchema);

module.exports = { User };
