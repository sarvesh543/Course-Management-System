const express = require("express");
require("./db");
const path = require("path");
// routers
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");

const app = express();

// static
app.use(express.static(path.join(__dirname, "client", "build")));

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
//admin routes
app.use("/api/admin/", adminRouter);


// frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
  console.log("connecting to MongoDB...")
});
