// deploy한 이후 production mode
// 배포 서비스에서 환경 변수 직접 추가해야 함.
module.exports = {
  mongoURI: process.env.MONGO_URI,
};
