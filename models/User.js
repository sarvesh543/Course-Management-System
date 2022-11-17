const mongoose = require("mongoose");

/*
in this model values against typeCourse mean
4 -> free elective
3 -> discipline elective
2 -> discipline core
1 -> institute core
0 -> not offered
*/

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: String,
  rollno: String,
  semester: Number,
  branch: String,
  email: String,
  courses: [
    {
      courseCode: String,
      name: String,
      description: String,
      LTPC: String,
      credits: Number,
      typeCourse: Number,
      semester: Number,
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
