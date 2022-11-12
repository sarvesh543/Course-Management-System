const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String},
    password: String,
    rollno: String,
    semester: Number,
    branch: String,
    email: String,
    courses: [{
        courseCode: String,
        name: String,
        LTPC: String,
        credits: Number,
        typeCourse: String,
        semester: Number
    }]
})

const User = mongoose.model("User", userSchema);

module.exports = User;
 