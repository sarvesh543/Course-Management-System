const router = require("express").Router();
const { body, query, validationResult } = require("express-validator");
const User = require("../models/User");
const Course = require("../models/Course");
const AddDrop = require("../models/AddDrop");

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
    body("_id").custom(async (value, {req}) => {
      try {
        const user = await User.findOne({ _id: value }).orFail();
        req.user = user;
      } catch (e) {
        return Promise.reject("user not found");
        // do nothing
      }
    }),
    body("registration").custom(async (value) => {
      try {
        const registration = await AddDrop.findOne().orFail();
        if (
          registration.startDate > Date.now() ||
          registration.endDate < Date.now()
        ) {
          await AddDrop.deleteMany({});
          throw Error("outside registration window");
        }
      } catch {
        return Promise.reject("Course registration is closed");
      }
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send(errors.errors);
    } else {
      try {
        // TODO: Add validation to not allow dropping if credits are going below 13

        const coursesToDrop = [];
        let creditSum = 0;
        let registeredCodes = req.user.courses
          .filter((value) => {
            return req.user.semester === value.semester;
          })
          .map((course) => course.courseCode);

        for (let i = 0; i < req.body.todrop.length; i++) {
          const course = await Course.findOne({
            semester: req.user.semester,
            courseCode: req.body.todrop[i],
          }).orFail();

          if (!registeredCodes.includes(req.body.todrop[i])) {
            res.status(400).send([
              {
                value: "",
                msg: "Course is not registered",
                param: "registered",
                location: "body",
              },
            ]);
            return;
          }
          creditSum -= course.credits;
        }

        creditSum = req.user.courses
          .filter((value) => req.user.semester == value.semester)
          .reduce((acc, curr) => {
            return acc + curr.credits;
          }, creditSum);

        // error if credits is dropping below 13
        if (creditSum < 13) {
          res.status(400).send([
            {
              value: "",
              msg: "Minimum registered credits should be atleast 13",
              param: "registered",
              location: "body",
            },
          ]);
          return;
        }

        // all validation passed
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
            param: "registered",
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
        return Promise.reject("user not found");
        // do nothing
      }
    }),
    body("registration").custom(async (value) => {
      try {
        const registration = await AddDrop.findOne().orFail();
        if (
          registration.startDate > Date.now() ||
          registration.endDate < Date.now()
        ) {
          await AddDrop.deleteMany({});
          throw Error("outside registration window");
        }
      } catch {
        return Promise.reject("Course registration is closed");
      }
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send(errors.errors);
    } else {
      try {
        //implement
        // course validation
        //credits exceeded

        const coursesToAdd = [];
        let creditSum = 0;
        let registeredCodes = req.user.courses
          .filter((value) => {
            return req.user.semester === value.semester;
          })
          .map((course) => course.courseCode);

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

        creditSum = req.user.courses
          .filter((value) => req.user.semester == value.semester)
          .reduce((acc, curr) => {
            return acc + curr.credits;
          }, creditSum);

        if (creditSum > 22) {
          res.status(400).send([
            {
              value: "",
              msg: "Maximum registered credits should not exceed 22",
              param: "selected",
              location: "body",
            },
          ]);
          return;
        }
        // TODO: for minimum registered credits to be atleast 14
        if (creditSum < 13) {
          res.status(400).send([
            {
              value: "",
              msg: "Minimum registered credits should be 13",
              param: "selected",
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
            param: "selected",
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
    query("registration").custom(async (value)=>{
      try{
        const registration = await AddDrop.findOne().orFail();
        if(registration.startDate > Date.now() || registration.endDate < Date.now()){
          await AddDrop.deleteMany({});
          throw Error("outside registration window")
        }
      }catch{
        return Promise.reject("Course registration is closed");
      }
    })
    // add validation for if add drop period is active
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send(errors.errors);
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
            param: "selected",
            location: "body",
          },
        ]);
      }
    }
  }
);

module.exports = router;
