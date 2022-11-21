const router = require("express").Router();
const { query, validationResult } = require("express-validator");
const AddDrop = require("../models/AddDrop");
const User = require("../models/User");

router.route("/startAddDrop").get(
  [
    query("password").custom(async (value) => {
      if (process.env.password !== value) {
        return Promise.reject("Incorrect admin password");
      }
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send(errors.errors);
    } else {
      try {
        const addDrop = await AddDrop.findOne({});
        if (
          addDrop !== null &&
          addDrop.startDate < Date.now() &&
          addDrop.endDate > Date.now()
        ) {
          return res.status(400).send([
            {
              value: "",
              msg: "course registration is already active",
              param: "general",
              location: "body",
            },
          ]);
        } else if (addDrop === null || addDrop.endDate < Date.now()) {
          await AddDrop.deleteMany({});
          // delete all previous instances
          // update users semester 
            const users = await User.find({});
            for (let i = 0; i < users.length; i++) {
              let sem = users[i].semester;
              let courses = users[i].courses.filter(
                (course) => course.semester === sem
              );
              let credits = 0;
              for (let j = 0; j < courses.length; j++) {
                credits += courses[j].credits;
              }
              
              if (credits < 14) {
                await User.updateOne(
                  { _id: users[i]._id },
                  {
                    $pull: {
                      courses: {
                        _id: {
                          $in: courses.map((course) => course._id),
                        },
                      },
                    },
                  }
                );
              } else {
                await User.updateOne(
                  { _id: users[i]._id },
                  {
                    $inc: {
                      semester: 1,
                    },
                  }
                );
              }
            }
          // done updating users semester

          await AddDrop.create({}); // create new add drop
          return res
            .status(200)
            .send(
              "Course Registration started successfully. It will close automatically in 15 minutes"
            );
        }
      } catch (e) {
        return res.status(500).send([
          {
            value: "",
            msg: "Internal Server Error! contact site owner",
            param: "general",
            location: "body",
          },
        ]);
      }
    }
  }
);

router.route("/closeAddDrop").get(
  [
    query("password").custom(async (value) => {
      if (process.env.password !== value) {
        return Promise.reject("Incorrect admin password");
      }
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send(errors.errors);
    } else {
      try {
        const addDrop = await AddDrop.findOne({});
        if (
          addDrop !== null &&
          addDrop.startDate < Date.now() &&
          addDrop.endDate > Date.now()
        ) {
          // delete all previous instances
          await AddDrop.deleteMany({});
          return res
            .status(200)
            .send("Course Registration has closed successfully!");
        } else if (addDrop === null || addDrop.endDate < Date.now()) {
          return res.status(400).send([
            {
              value: "",
              msg: "course registration is already inactive",
              param: "general",
              location: "body",
            },
          ]);
        }
      } catch (e) {
        console.log(e);
        return res.status(500).send([
          {
            value: "",
            msg: "Internal Server Error! contact site owner",
            param: "general",
            location: "body",
          },
        ]);
      }
    }
  }
);

module.exports = router;
