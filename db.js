const mongoose = require("mongoose");
require("dotenv").config();

//db connections
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", () => {
  console.log(
    "Database connection error please ensure you are not behind proxy"
  );
});
db.once("open", () => {
  console.log("DB is connected!");
});
