"use strict";

class BaseMessage {
  constructor (recipientId) {
    this.recipient = {
      id: recipientId
    }
  }

  setRecipient(recipientId) {
    this.recipient.id = recipientId;
    return this;
  }

  toJSON() {
    return Object.assign({}, { recipient: this.recipient } );
  }

  clear() {
    this.recipient.id = null;
  }
}

module.exports = {
  message: BaseMessage,
  instance: (recipientId) => { return new BaseMessage(recipientId) },
  description: 'Base message containing recipient id only'
}
