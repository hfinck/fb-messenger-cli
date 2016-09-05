"use strict";

var baseMessage = require('./base-message');

class TextMessage extends baseMessage.message {
  constructor(recipientId) {
    super(recipientId);
    this.message = {
      text: 'Default text message'
    }
  }

  setText(text) {
    this.message.text = text;
  }

  toJSON() {
    return Object.assign({}, super.toJSON(), { message: this.message });
  }

  applyPrompt(answers) {
    super.applyPrompt(answers);
    if (answers.text) {
      this.setText(answers.text);
    }
  }

  static setters() {
    return Object.assign({}, super.setters(), {
      text: 'Text content (max. 320 characters)'
    });
  }
}

module.exports = {
  message: TextMessage,
  instance: (recipientId) => { return new TextMessage(recipientId) },
  description: 'Simple text message',
  schema: baseMessage.schema.concat([
    {
      type: 'input',
      name: 'text',
      message: 'Text to be sent:',
      validate: (input) => {
        var result = input.length > 0  && input.length <= 320;
        if (!result) {
          result = 'Text must be set, but cannot be longer than 320 characters';
        }
        return result;
      }
    }
  ])
};
