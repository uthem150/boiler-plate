const express = require("express"); //express 모듈을 가져옴
const app = express(); //새로운 express app생성
const port = 5000;

// 루트 디렉토리에 오면, 출력할 내용
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
