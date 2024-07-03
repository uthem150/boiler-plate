//process.env.NODE_ENV가 development모드일 때는 development라고 나오고
//deploy한 이후에는 production이라고 나옴
if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
