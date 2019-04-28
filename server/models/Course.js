var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
    Status: String,
    Seats_Available: Number,
    Course_Registration_Number: Number,
    Course_Department: String,
    Course_Level: Number,
    Course_Section: String,
    Course_Title: String,
    Course_Credits: Number,
    Times: [String],
    Days: [String],
    Location: String,
    Instructor: String,
    Competency: String,
    Comments: String
});

module.exports = mongoose.model('Course', CourseSchema);