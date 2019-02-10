const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/node-auth').then(() => console.log('connection successful')).catch((err) => console.error(err));

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/index', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

// https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js#
app.get('/', (req, res) => {

    const { spawn } = require('child_process');
    const pyProg = spawn('python', ['./../parser.py']);

    pyProg.stdout.on('data', function(data) {

        console.log(data.toString());
        res.write(data);
        res.end('end');
    });
});
