const mongoose = require("mongoose");
require("dotenv").config()

//db connections
mongoose.connect("mongodb://localhost:27017/ADP", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB is connected!");
});
