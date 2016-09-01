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

  static setters() {
    return Object.assign({}, super.setters(), {
      text: 'Text content (max. 320 characters)'
    });
  }
}

module.exports = {
  message: TextMessage,
  instance: (recipientId) => { return new TextMessage(recipientId) },
  description: 'Simple text message'
};
