const emailer = require('./emailer');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const Course = require("./models/Course");

var app = express();
app.use(cors());

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

app.get('/export_cart', (req, res) => {
    let runExport = new Promise(function(success, nosuccess) {
        const { spawn } = require('child_process');
        const pyprog = spawn('python', ['course_generator.py', JSON.stringify(req.query.CRN)]);

        pyprog.stdout.on('data', (data) => success(data) );
        pyprog.stderr.on('data', (data) => nosuccess(data) );
    }).catch((error) => {
        console.log('caught', error.message);
    });

    runExport.then((data) => {
        res.send(data.toString());
    }).catch((error) => {
        console.log('caught', error.message);
    });
});

app.get('/send_email', (req, res) => {
    let sendEmail = new Promise(function(success, nosuccess){
        var mailOptions = {
            from: 'teamarf2019@gmail.com',
            to: JSON.stringify(req.query.Email), //this grabs the users email
            subject: 'Sending Course Information using Node.js',
            html: '<p/>'
        };

        if(req.query.Subscriber === "True"){
            emailer.newSubscriber(mailOptions) //this changes the email content
            .then(() => {
                emailer.send(emailer.transporter, mailOptions);
            });
        } else {
            let runExport = new Promise(function(success, nosuccess) {
                const { spawn } = require('child_process');
                //console.log(req.query);
                const pyprog = spawn('python', ['course_generator.py', JSON.stringify(req.query.CRN)]);

                pyprog.stdout.on('data', (data) => success(data) );
                pyprog.stderr.on('data', (data) => nosuccess(data) );
            }).catch(error => {
                console.log('caught', error.message);
            });

            runExport.then((data) => {
                mailOptions.html = data.toString();
            }).then(() => {
                emailer.send(emailer.transporter, mailOptions);
            }).catch(error => {
                console.log('caught', error.message);
            });
        }
    });

    sendEmail.then((data)=> {
        console.log(data);
    }).catch(error => { 
        console.log('caught', error.message);
    });
});
