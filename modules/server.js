var express = require('express');
var bodyParser = require('body-parser');
var colors = require('colors');
var server = null;
var verifyToken = null;

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  if (req.query['hub.verify_token'] === verifyToken) {
    console.log('Receiving auth request', req.query);
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(200);
  }
});

// Catch any message that is sent by Facebook and display it
app.post('/', (req, res) => {
  res.sendStatus(200);
  if (req.body) {
    console.log(JSON.stringify(req.body, null, 2).cyan);
  }
});

function run(options) {
  if (options.verify_token) {
    verifyToken = options.verify_token;
    var port = process.env.PORT || options.port || 8080;
    server = app.listen(port, function () {
      console.log(('Facebook Messaging Server listening on port ' + port + '.').green);
    });
  } else {
    console.log('Verify token is missing');
  }
}

function stop() {
  if (server) {
    server.close();
  }
}

module.exports = {
  run: run,
  stop: stop
};
