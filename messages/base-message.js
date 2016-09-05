"use strict";

class BaseMessage {
  constructor (recipientId) {
    this.recipient = {
      id: recipientId
    }
  }

  setRecipient(recipientId) {
    this.recipient.id = recipientId;
  }

  toJSON() {
    return Object.assign({}, { recipient: this.recipient } );
  }

  applyPrompt(answers) {
    // nothing to do here, just offer interface to be consistent
  }

  static setters() {
    return {
      recipient: 'Recipient Facebook ID'
    }
  }
}

module.exports = {
  message: BaseMessage,
  instance: (recipientId) => { return new BaseMessage(recipientId) },
  description: 'Base message containing recipient id only',
  schema: []
}
