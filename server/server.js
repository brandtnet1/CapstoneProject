const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/node-auth').then(() => console.log('connection successful')).catch((err) => console.error(err));

// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Course = require("./models/Course");

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// THIS IS HOW YOU QUERY THE DB
app.get('/query_db', (req, res) => {
    
    var courses = {};
    // https://docs.mongodb.com/manual/reference/method/db.collection.find/
    Course.find({}, function (err, course) {
        course.forEach((c) => {
            courses[c._id] = c;
        });
    }).then(() => {
        res.send({ express : courses })
    });
    

    // Course.
    //   find().
    //   where('Course_Department').equals('CMS').
    //   where('Credits').gt(4).lt(5). // gt = greater than, lt = less than
    //   limit(5). // number of items of this type that we want
    //   sort({ Seats_Available: -1 }). // how to sort them when we display -1 = reverse highest to lowest, 1 = lowest to highest
    //   select('Status Course_Title Course_Registration_Number'). // This tells the query what data we want from the courses, if you remove this you'll get everything
    //   exec(callback); // if there is a callback function for something to do when you find the query do it now
    
});

// https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js#
let runPy = new Promise(function(success, nosuccess) {
    const { spawn } = require('child_process');
    const pyprog = spawn('python', ['parser.py']);

    pyprog.stdout.on('data', (data) => success(data) );
    pyprog.stderr.on('data', (data) => nosuccess(data) );
}).catch(error => {
    console.log('caught', error.message);
});

app.get('/fill_db', (req, res) => {

    res.send({ express : 'welcome\n' });

    runPy.then(function(data) {

        data.toString().split('\n').forEach((item) => {

            var course = JSON.parse(item);
            var add_course = new Course(course);

            // Saves the course to the DB
            add_course.save()
            .catch(() => console.log("Unable to save to database"));
        });
        
        res.end(data);
        
    }).then(() => {
        console.log("Courses saved to database");
    }).catch(function () {
     console.log("Promise Rejected");
    });
});

