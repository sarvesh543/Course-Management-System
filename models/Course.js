const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: String,
  courseCode: String,
  credits: Number,
  LTPC: String,
  CSE: Number,
  EE: Number,
  DSE: Number,
  BE: Number,
  ME: Number,
  CE: Number,
  EP: Number
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
