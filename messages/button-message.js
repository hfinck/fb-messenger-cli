"use strict";

var baseMessage = require('./base-message');

class ButtonMessage extends baseMessage.message {
  constructor(recipientId, text) {
    super(recipientId);
    this.attachment = {
      type: 'template',
      payload: {
        template_type: 'button',
        text: text || 'This is a button message',
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

  toJSON() {
    return Object.assign({}, super.toJSON(), { message: { attachment: this.attachment } });
  }

  applyPrompt(answers) {
    super.applyPrompt(answers);
  }
}

module.exports = {
  message: ButtonMessage,
  instance: (recipientId, text) => new ButtonMessage(recipientId, text),
  schema: baseMessage.schema.concat([])
}
