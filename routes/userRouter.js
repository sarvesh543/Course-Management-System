const router = require("express").Router();
const {body, query, validationResult } = require("express-validator");
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

router.route("/dropCourses").post(
  [
    body("_id").custom(async (value) => {
      try {
        await User.findOne({ _id: value }).orFail();
      } catch (e) {
        console.log(value)
        return Promise.reject("user not found");
        // do nothing
      }
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(404).send(errors.errors);
    } else {
      try{
        if(!Array.isArray(req.body.todrop)){
          console.log("heere")
        } 
        
        const user = await User.findOneAndUpdate(
          {_id: req.body._id},
          {
            $pull: {
              courses: {
                courseCode: {
                  $in: req.body.todrop
                },
              },
            },
          },
          {
            multi: true,
            new: true
          }
        );
        user.password=""
        res.status(200).send(user)
      }catch(err){
        console.log(err)
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

module.exports = router;
