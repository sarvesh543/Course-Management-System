const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

router.route("/signup").post(
  [
    body("rollno")
      .matches(/^[a-z0-9]+$/gi)
      .withMessage("Roll No should not contain special characters")
      .trim()
      .escape()
      .notEmpty()
      .custom(async (value) => {
        try {
          await User.findOne({ rollno: value }).orFail();
          return Promise.reject("rollno already exists");
        } catch (e) {
          // do nothing
        }
      }),
    body("email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value) => {
        try {
          await User.findOne({ email: value }).orFail();
          return Promise.reject("email already exists");
        } catch (e) {
          // do nothing
        }
      }),
    body("branch")
      .trim()
      .escape()
      .custom(async (value) => {
        if (["CS", "EE", "DSE", "BE", "ME", "CE", "EP"].includes(value)) {
          // do nothing
        } else return Promise.reject("branch is not valid");
      }),
    body("username")
      .matches(/^[a-z0-9]+$/gi)
      .withMessage("Username should not contain special characters")
      .trim()
      .escape()
      .notEmpty(),
    body("password")
      .trim()
      .escape()
      .isLength({ min: 8, max: 15 })
      .withMessage("password should be between 8 to 15 characters"),
    body("confirmPassword")
      .trim()
      .escape()
      .custom(async (value, { req }) => {
        if (value !== req.body?.password) {
          return Promise.reject("password and confirm password should be same");
        }
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send(errors.errors);
    } else {
      try {
        const user = await User.create({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          rollno: req.body.rollno,
          semester: 1,
          branch: req.body.branch,
          courses: [],
        });
        user.password = "";
        res.status(200).send(user);
      } catch (e) {
        res.status(400).send([
          {
            value: "",
            msg: "There was an error. Please try again later",
            param: "general",
            location: "body",
          },
        ]);
      }
    }
  }
);

router.route("/login").post(
  [
    body("rollno")
      .matches(/^[a-z0-9]+$/gi)
      .withMessage("Roll No should not contain special characters")
      .trim()
      .escape()
      .notEmpty(),
    body("password")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("password should not be empty"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send(errors.errors);
    } else {
      try {
        const user = await User.findOne({
          rollno: req.body.rollno,
          password: req.body.password,
        }).orFail();
        user.password = "";
        res.status(200).send(user);
      } catch (e) {
        res.status(400).send([
          {
            value: "",
            msg: "Wrong credentials",
            param: "general",
            location: "body",
          },
        ]);
      }
    }
  }
);

module.exports = router;
