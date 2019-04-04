/*Current Objectives:
1. Properly access the course information
2. Should build html to allow for links to website and to unsubscribe
3. Need to connect to Rene's export program

How it's gonna work!:
There will be a button for requesting emails in each of the courses
When they first click the button, the newbie function will be called
Their email will be added to the course database
Whenever the course is editted or deleted a notification will be sent to the user
*/
var nodemailer = require('nodemailer');
//I'm thinking that we will need to add an attribute to the courses, which is a
//a list of subscribers
//var subscribers = [];

//Created a dummy gmail for our team
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'teamarf2019@gmail.com',
    pass: 'thefoxsays1'
  }
});
//there is also the potential to send html, just swap the text: for html:
var mailOptions = {
  from: 'teamarf2019@gmail.com',
  to: 'gracefulartista@gmail.com', //using my email to test
  subject: 'Sending Course Information using Node.js',
  text: 'That was easy!'
};

/* The methods below should take the course as a parameter*/

//when the user signs up for notifications
function newSubscriber(course, email){
  var courseInfo = course.toString();
  mailOptions.to = email;
  mailOptions.subject = 'Thank you for Subscribing for Notifications';
  mailOptions.text = 'You have just signed up for notifications for the class": \n'
                     + courseInfo + "If you wish to unsubscribe, please click the link below"
}
function subscriberLeaves(course, email){
  var courseInfo = course.toString();
  mailOptions.to = email;
  mailOptions.subject = 'Unsubscribed!'';
  mailOptions.text = 'You have just unsubscribed for notifications about the class:\n'
                     + courseInfo + "If you did not mean to do this, please click this link";
}

//This will eventually work with Rene's export courses program
function exportCourses(course, email){
  mailOptions.to = email;//users email should go here
  mailOptions.subject = 'Exported List of Courses'
  mailOptions.text = 'List of Course Info :)'; //the list of course
}

//These will be on an inividual course basis
function courseUpdate(course){
  var subscribers = course.subscribers;
  var courseInfo = course.toString();
  mailOptions.subject =  'Updated Course Information!';
  mailOptions.text = 'There has been a revision to the course you have favorited.\n'
                    + courseInfo;
  for sub in subscribers{
    mailOptions.to = sub;
    send();
  }       
}
function courseDeletion(course){
  var subscribers = course.subscribers;
  var courseInfo = course.toString();
  mailOptions.subject = 'Course Deletion Notification!';
  mailOptions.text = 'The course that you have favorited has been deleted!\n'
                     + courseInfo;
  for sub in subscribers{
    mailOptions.to = sub;
    send();
  }
}


// We will need 2 methods for adding and removing subscribers from the database objects

function send(){
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}



// https://www.w3schools.com/nodejs/nodejs_email.asp
