const router = require("express").Router();
const { body, query, validationResult } = require("express-validator");
const User = require("../models/User");
const Course = require("../models/Course");

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
        console.log(value);
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
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.body._id },
          {
            $pull: {
              courses: {
                courseCode: {
                  $in: req.body.todrop,
                },
              },
            },
          },
          {
            multi: true,
            new: true,
          }
        );
        user.password = "";
        res.status(200).send(user);
      } catch (err) {
        console.log(err);
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

router.route("/addCourses").post(
  [
    body("_id").custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ _id: value }).orFail();
        req.user = user;
      } catch (e) {
        console.log(value);
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
      try {
        //implement
        // course validation
        //credits exceeded

        const coursesToAdd = [];
        let creditSum = 0;
        let registeredCodes = req.user.courses.map(
          (course) => course.courseCode
        );
        for (let i = 0; i < req.body.toadd.length; i++) {
          const course = await Course.findOne({
            semester: req.user.semester,
            courseCode: req.body.toadd[i],
          }).orFail();
          if (registeredCodes.includes(req.body.toadd[i])) {
            res.status(400).send([
              {
                value: "",
                msg: "Course is already registered",
                param: "general",
                location: "body",
              },
            ]);
            return;
          }
          creditSum += course.credits;
          coursesToAdd.push({
            courseCode: course.courseCode,
            name: course.name,
            description: course.description,
            LTPC: course.LTPC,
            credits: course.credits,
            typeCourse: course[req.user.branch],
            semester: course.semester,
          });
        }
        creditSum = req.user.courses.reduce((acc, curr) => {
          return acc + curr.credits;
        }, creditSum);
        if (creditSum > 22) {
          res.status(400).send([
            {
              value: "",
              msg: "Maximum registered credits should not exceed 22",
              param: "general",
              location: "body",
            },
          ]);
          return;
        }
        // update here
        const user = await User.findOneAndUpdate(
          { _id: req.body._id },
          {
            $push: {
              courses: {
                $each: coursesToAdd,
              },
            },
          },
          { new: true }
        );
        user.password = "";
        res.status(200).send(user);
      } catch (err) {
        console.log(err);
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

router.route("/courseAvailable").get(
  [
    query("userId").custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ _id: value }).orFail();
        req.user = user;
      } catch (e) {
        return Promise.reject("user not found");
        // do nothing
      }
    }),
    // add validation for if add drop period is active
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(404).send(errors.errors);
    } else {
      try {
        const coursesTaken = req.user.courses.map(
          (course) => course.courseCode
        );

        const courses = await Course.find({
          semester: req.user.semester,
          [req.user.branch]: { $ne: 0 },
          courseCode: { $nin: coursesTaken },
        });
        res.status(200).send(courses);
      } catch (err) {
        console.log(err);
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
