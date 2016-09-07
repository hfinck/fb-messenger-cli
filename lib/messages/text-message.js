"use strict";

var baseMessage = require('./base-message');
var stringValidate = require('../prompts/string-validate');
var inquirer = require('inquirer');

class TextMessage extends baseMessage.message {
  constructor(recipientId) {
    super(recipientId);
    this.message = {
      text: 'Default text message'
    }
  }

  setText(text) {
    this.message.text = text;
    return this;
  }

  toJSON() {
    return Object.assign({}, super.toJSON(), { message: this.message });
  }

  clear() {
    super.clear();
    this.message.text = null;
    return this;
  }
}

function prompt(message) {
  return inquirer.prompt([
    {
      type: 'text',
      name: 'text',
      message: 'Enter message text:',
      validate: stringValidate('Text', 320)
    }
  ]).then(answers => {
    return message.setText(answers.text);
  });
}

module.exports = {
  message: TextMessage,
  instance: (recipientId) => { return new TextMessage(recipientId) },
  description: 'Simple text message',
  prompt: prompt
};
