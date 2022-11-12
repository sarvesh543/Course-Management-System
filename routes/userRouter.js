const router = require("express").Router();
const { query, validationResult } = require("express-validator");
const User = require("../models/User");

router.route("/").get([query("userId").isString().not()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).send(errors.errors);
  } else {
    try {
      const user = await User.findOne({ _id: req.query.userId }).orFail();
      user.password = "";
      res.status(200).send(user);
    } catch (e) {
      res.status(404).send("user does not exist");
    }
  }
});

module.exports = router;