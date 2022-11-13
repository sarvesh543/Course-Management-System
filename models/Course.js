const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: String,
  courseCode: String,
  description: String,
  credits: Number,
  LTPC: String,
  semester: Number,
  CS: Number,
  EE: Number,
  DSE: Number,
  BE: Number,
  ME: Number,
  CE: Number,
  EP: Number,
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
