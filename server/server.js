const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;

var app = express();
app.use(cors());

const Course = require("./models/Course");

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost/capstone')
mongoose.connect('mongodb+srv://admin:root@cluster0-pmazi.mongodb.net/Capstone?retryWrites=true')
.then(() => console.log('connection successful'))
.catch((err) => console.error(err));


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

});

app.get('/query_db_filters', (req, res) => {
    // https://stackoverflow.com/questions/17007997/how-to-access-the-get-parameters-after-in-express
    // TO FIND THE VALUES AFTER ? IN LINK

    var courses = {};
    var s = '{ ';

    // Object.keys(req.query) should be all fields
    // req.query."key"
    Object.keys(req.query).forEach((key) => {
        s = s.concat(key + ' : ' + req.query.key + ', ');
    });

    s = s.slice(0, len(s) - 2);
    s = s.concat('}');

    // https://docs.mongodb.com/manual/reference/method/db.collection.find/
    // { field1: <value>, field2: <value> ... }

    Course.find( s, function (err, course) {
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


  app.get('/export_cart', (req, res) => {
      //res.send({ exported : true });
      let runExport = new Promise(function(success, nosuccess) {
          const { spawn } = require('child_process');
          console.log(req.query);
          const pyprog = spawn('python', ['course_generator.py', JSON.stringify(req.query)]);

          pyprog.stdout.on('data', (data) => success(data) );
          pyprog.stderr.on('data', (data) => nosuccess(data) );
      }).catch(error => {
          console.log('caught', error.message);
      });

    runExport.then((data) => {
          
          res.send(data.toString());

    }).catch(error => {
        console.log('caught', error.message);
    });
});



// https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js#
// let runPy = new Promise(function(success, nosuccess) {
//     const { spawn } = require('child_process');
//     const pyprog = spawn('python', ['parser.py']);

//     pyprog.stdout.on('data', (data) => success(data) );
//     pyprog.stderr.on('data', (data) => nosuccess(data) );
// }).catch(error => {
//     console.log('caught', error.message);
// });

// app.get('/fill_db', (req, res) => {
//     res.send({ express : 'welcome\n' });

//     runPy.then(() => {
//         console.log("Courses saved to database");
//     }).catch(function () {
//      console.log("Promise Rejected");
//     });
// });
