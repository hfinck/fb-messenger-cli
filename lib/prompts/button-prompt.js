'use strict';

var inquirer = require('inquirer');
var stringValidate = require('./string-validate');

function urlPrompt(message) {
  var options = [
    {
      type: 'input',
      name: 'title',
      message: 'Enter button title:',
      validate: stringValidate('Title', 20)
    },
    {
      type: 'input',
      name: 'url',
      message: 'Enter button URL:'
    }
  ];

  return inquirer.prompt(options);
}

function postbackPrompt() {
  var options = [
    {
      type: 'input',
      name: 'title',
      message: 'Enter button title:',
      validate: stringValidate('Title', 20)
    },
    {
      type: 'input',
      name: 'postback',
      message: 'Enter postback data:',
      validate: stringValidate('Postback data', 1000)
    }
  ];

  return inquirer.prompt(options);
}

function buttonPrompt() {
  var options = [
    {
      type: 'list',
      name: 'button',
      message: 'Which button type do you want?',
      choices: ['URL', 'Postback']
    }
  ];

  return inquirer.prompt(options).then(answers => {
    var result;

    if (answers.button === 'URL') {
      result = urlPrompt();
    } else if (answers.button === 'Postback') {
      result = postbackPrompt();
    }

    return result;
  });
}

module.exports = buttonPrompt;
