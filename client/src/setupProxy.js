// CORS 문제 해결을 위한 proxy 부분

const { createProxyMiddleware } = require("http-proxy-middleware"); //라이브러리에서 createProxyMiddleware 함수 가져옴

module.exports = function (app) {
  app.use(
    //api로 시작하는 경로에 대해 미들웨어 적용
    "/api",
    //프록시 미들웨어 생성
    createProxyMiddleware({
      target: "http://localhost:5000/api", //api 경로로 들어오는 요청 http://localhost:5000으로 전달
      changeOrigin: true, //원본 서버에 전달되는 요청의 Host 헤더를 대상 서버의 도메인으로 변경
    })
  );
};
