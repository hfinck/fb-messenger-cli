#!/usr/bin/env node
"use strict";

var request = require('request');
var fs = require('fs');
var colors = require('colors');
var program = require('commander');
var server = require('./modules/server');
var inquirer = require('inquirer');

// Configure config loader to ignore missing config directory
process.env.SUPPRESS_NO_CONFIG_WARNING = true;
var config = require('config');

const API_PATH = 'https://graph.facebook.com/v2.6/me/messages';
const CONFIG_PATH = './config';
var defaults = {};

// Set defaults for making requests to Facebook
request = request.defaults({
  baseUrl: API_PATH,
  json: true
});

// Read available message types
var messageTypes = (function() {
  var files = fs.readdirSync('./messages');
  return files.map(function(file) {
    return file.replace('-message', '').replace('.js', '');
  });
})();

function hasMessageType(type) {
  return -1 < messageTypes.indexOf(type);
}

function sendMessage(type, options) {
  if (hasMessageType(type)) {
    var msg = require('./messages/' + type + '-message');
    var recipient = options.recipient || defaults.recipient;
    var instance = msg.instance(recipient);

    function send(instance, options) {
      console.log(JSON.stringify(instance.toJSON(), null, 2).cyan);
      request.post('', {
        body: instance,
        qs: {
          access_token: options.access_token || defaults.accessToken
        }
      }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log('Message sent 👍'.green);
        } else {
          console.log('Failed sending message'.red);
          console.log(error || body);
        }
      });
    }

    if (options.custom) {
      inquirer.prompt(msg.schema).then(answers => {
        instance.applyPrompt(answers);
        send(instance, options);
      });
    } else {
      send(instance, options);
    }
  } else {
    console.log('Message type %s not found'.red, [type]);
    console.log('Available types are: '.red + '%s'.green, [messageTypes])
  }
}

function loadDefaults(cb) {
  fs.exists(CONFIG_PATH + '/default.json', (hasConfig) => {
    if (hasConfig) {
      if (config.has('recipient')) {
        defaults.recipient = config.get('recipient');
      }
      if (config.has('access_token')) {
        defaults.accessToken = config.get('access_token');
      }
    }
    (cb || () => {})();
  });
}

function setDefaults(recipient, token) {
  var config = {
    default_recipient: recipient,
    default_access_token: token
  }

  fs.exists(CONFIG_PATH, function(hasFolder) {
    if (!hasFolder) {
      fs.mkdirSync(CONFIG_PATH);
    }
    fs.writeFileSync(CONFIG_PATH + '/default.json', JSON.stringify(config, null, 2));
  });
}

program
  .version('0.0.1');

program
  .command('send <type>')
  .description('Send a message of the specified type')
  .option('-r, --recipient [user_id]', 'Facebook ID of the recipient')
  .option('-t, --access_token [access_token]', 'Access token to be used for this request')
  .option('-c, --custom', 'Customize message contents')
  .action(sendMessage);

program
  .command('defaults <recipient> <access_token>')
  .description('Set a default recipient and access token')
  .action(setDefaults);

program
  .command('server <cmd>')
  .option('--verify_token [token]', 'Verify token to check with Facebook auth requests')
  .option('-p, --port [port]', 'Port to have the server listen on')
  .description('Start or stop a server to receive Facebook requests')
  .action((cmd, options) => {
    server.run(options);
  });

program.on('--help', function() {
  console.log('  Available message types:'.green);
  console.log('');
  console.log(('    ' + messageTypes).green);
});

loadDefaults(() => {
  program.parse(process.argv);

  if (!program.args.length) {
    program.outputHelp(function(text) {
      return colors.green(text);
    });
  }
});
