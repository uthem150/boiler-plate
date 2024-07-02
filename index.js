const express = require("express"); //express 모듈을 가져옴
const app = express(); //새로운 express app생성
const port = 5000;

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
