const emailer = require('./emailer');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const Course = require("./models/Course");

// Must use CORS "Cross Origin Resource Sharing"
// Allows us to use our "Proxy" method of connecting to server
// through react front end
var app = express();
app.use(cors());

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connecting to cloud MongoDB
mongoose.connect('mongodb+srv://admin:root@cluster0-pmazi.mongodb.net/Capstone?retryWrites=true')
    .then(() => console.log('connection successful'))
    .catch((err) => console.error(err));


// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// THIS IS HOW YOU QUERY THE DB
app.get('/query_db', (req, res) => {

    var courses = {};
    // https://docs.mongodb.com/manual/reference/method/db.collection.find/
    // Find everything that looks like Course object in database
    Course.find({}, function (err, course) {
        course.forEach((c) => {
            courses[c._id] = c;
        });
    }).then(() => {
        res.send({express: courses});
    });

});

// Using the list of CRN's from the front end
// Run our python script to generate an html file that shows the course schedule
app.get('/export_cart', (req, res) => {
    var runExport = new Promise(function (success, nosuccess) {
        const {spawn} = require('child_process');
        const pyprog = spawn('python', ['course_generator.py', JSON.stringify(req.query.CRN)]);

        pyprog.stdout.on('data', (data) => success(data));
        pyprog.stderr.on('data', (data) => nosuccess(data));
    }).catch((error) => {
        console.log('caught', error.message);
    });

    runExport.then((data) => {
        // Send html file as text to front-end
        res.send(data.toString());
    }).catch((error) => {
        console.log('caught', error.message);
    });
});

// First run the export python function then send email to the requested email
app.get('/send_email', (req, res) => {
    let sendEmail = new Promise(function (success, nosuccess) {
        var mailOptions = {
            from: 'teamarf2019@gmail.com',
            to: JSON.stringify(req.query.Email), //this grabs the users email
            subject: 'Sending Course Information using Node.js',
            html: '<p/>'
        };

        // For future use with subscriber
        if (req.query.Subscriber === "True") {
          
            emailer.newSubscriber(mailOptions,req.query.Course);//this changes the email content
            emailer.send(emailer.transporter, mailOptions);
        } else { // Run the exporter (course_generator) then send email using generated data
            var runExport = new Promise(function (success, nosuccess) {
                const {spawn} = require('child_process');
                const pyprog = spawn('python', ['course_generator.py', JSON.stringify(req.query.CRN)]);

                pyprog.stdout.on('data', (data) => success(data));
                pyprog.stderr.on('data', (data) => nosuccess(data));
            }).catch((error) => {
                console.log('caught', error.message);
            });

            // Set up email to contain returned information from exporter
            // Then send email
            runExport.then((data) => {
                mailOptions.html = data.toString();
            }).then(() => {
                emailer.send(emailer.transporter, mailOptions);
            }).catch((error) => {
                console.log('caught', error.message);
            });
        }
    });

    sendEmail.then((data) => {
        console.log(data);
    }).catch((error) => {
        console.log('caught', error.message);
    });
});
