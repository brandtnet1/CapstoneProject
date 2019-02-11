const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/node-auth').then(() => console.log('connection successful')).catch((err) => console.error(err));

// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// const Course = require("/../models/Course.js");

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
// app.get('/index', (req, res) => {
//   res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
// });

// https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js#
let runPy = new Promise(function(success, nosuccess) {
    const { spawn } = require('child_process');
    const pyprog = spawn('python', ['parser.py']);

    pyprog.stdout.on('data', (data) => success(data) );
    pyprog.stderr.on('data', (data) => nosuccess(data) );
}).catch(error => {
    console.log('caught', err.message);
});

app.get('/index', (req, res) => {

    res.send({ express : 'welcome\n' });

    runPy.then(function(data) {
        data.toString().split('\n').forEach((item) => {
            // console.log(item);
            var course = JSON.parse(item);
            // var add_course = new Course(course)
        });
        res.end(data);
    }).catch(function () {
     console.log("Promise Rejected");
    });
});

