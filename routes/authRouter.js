const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

router.route("/signup").post(
  [
    body("username")
      .matches(/^[a-z0-9]+$/gi)
      .withMessage("Username should not contain special characters")
      .trim()
      .escape()
      .notEmpty()
      .custom(async (value) => {
        try {
          await User.findOne({ username: value }).orFail();
          return Promise.reject("username already exists");
        } catch (e) {
          // do nothing
        }
      }),
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
        const result = await User.create({
          username: req.body.username,
          password: req.body.password,
        });
        res.status(200).send({ username: result.username, userId: result._id });
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
    body("username")
      .matches(/^[a-z0-9]+$/gi)
      .withMessage("Username should not contain special characters")
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
          username: req.body.username,
          password: req.body.password,
        }).orFail();
        res.status(200).send({ userId: user._id, username: user.username });
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
