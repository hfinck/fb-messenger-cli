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

  static setters() {
    return {
      recipient: 'Recipient Facebook ID'
    }
  }
}

module.exports = {
  message: BaseMessage,
  instance: () => { return new BaseMessage() },
  description: 'Base message containing recipient id only'
}
