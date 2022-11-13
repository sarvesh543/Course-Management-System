const express = require("express");
require("./db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const User = require("./models/User");
// routers
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");

const app = express();

// static
app.use(express.static(path.join(__dirname, "client", "build")));

app.use(cookieParser());
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://192.168.45.52:3000",
//       "http://192.168.45.52",
//     ],
//     credentials: true,
//   })
// );
app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.status(404).send("Invalid request");
        throw Error("invalid JSON");
      }
    },
  })
);
app.use(express.urlencoded());

// routes
// auth routes
app.use("/api/auth/", authRouter);
// user routes
app.use("/api/user/", userRouter);

// frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
