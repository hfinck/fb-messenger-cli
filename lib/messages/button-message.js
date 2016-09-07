"use strict";

var baseMessage = require('./base-message');
var inquirer = require('inquirer');
var stringValidate = require('../prompts/string-validate');
var buttonPrompt = require('../prompts/button-prompt');

class ButtonMessage extends baseMessage.message {
  constructor(recipientId) {
    super(recipientId);
    this.attachment = {
      type: 'template',
      payload: {
        template_type: 'button',
        text: 'This is a button message',
        buttons: [
          {
            type: 'web_url',
            url: 'https://developers.facebook.com/docs/messenger-platform/send-api-reference/button-template',
            title: 'Documentation'
          },
          {
            type: 'postback',
            title: 'Postback',
            payload: 'USER_DEFINED_PAYLOAD'
          }
        ]
      }
    }
  }

  addUrlButton(title, url) {
    this.attachment.payload.buttons.push(
      {
        type: 'web_url',
        url: url,
        title: title
      }
    );
    return this;
  }

  addPostbackButton(title, data) {
    this.attachment.payload.buttons.push(
      {
        type: 'postback',
        payload: data,
        title: title
      }
    );
    return this;
  }

  setText(text) {
    this.attachment.payload.text = '' + text;
    return this;
  }

  hasText() {
    return typeof this.attachment.payload.text === 'string'
      && this.attachment.payload.text.length > 1;
  }

  buttonCount() {
    return this.attachment.payload.buttons.length;
  }

  clear() {
    super.clear();
    this.attachment.payload.text = null;
    this.attachment.payload.buttons = [];
    return this;
  }

  toJSON() {
    return Object.assign({}, super.toJSON(), { message: { attachment: this.attachment } });
  }
}

function textPrompt() {
  var options = [{
    type: 'input',
    name: 'text',
    message: 'Enter message text:',
    validate: stringValidate('Text', 320)
  }];

  return inquirer.prompt(options);
}

function main(message) {
  var mainOptions = {
    type: 'list',
    name: 'action',
    message: 'What do you want to do?',
    choices: [
      { name: 'Set message text', value: 'setText' }
    ]
  }

  if (message.buttonCount() < 1 ) {
    mainOptions.choices.push({ name: 'Add a button', value: 'addButton' });
  }

  if (message.buttonCount() > 0 && message.hasText()) {
    mainOptions.choices.push({ name: 'Send message', value: 'sendMessage' });
  }

  return inquirer.prompt(mainOptions).then(answers => {
    var result;
    if (answers.action === 'setText') {
      result = textPrompt(message).then(answers => {
        if (answers.text) {
          message.setText(answers.text);
        }
        return main(message);
      });
    }

    if (answers.action === 'addButton') {
      result = buttonPrompt(message).then(answers => {
        if (answers.postback) {
          message.addPostbackButton(answers.title, answers.postback);
        }
        if (answers.url) {
          message.setUrl(answers.title, answers.postback);
        }
        return main(message);
      });
    }

    if (answers.action === 'sendMessage') {
      result = message;
    }
    return result;
  });
}

function prompt(message, parentPrompt) {
  message.clear();
  return main(message);
}

module.exports = {
  message: ButtonMessage,
  instance: (recipientId) => new ButtonMessage(recipientId),
  prompt: prompt
}
