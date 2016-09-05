"use strict";

var baseMessage = require('./base-message');

class ImageMessage extends baseMessage.message {
  constructor(recipientId, imageUrl) {
    super(recipientId);
    this.attachment = {
      type: 'image',
      payload: {
        url: imageUrl
      }
    }
  }

  setImageUrl(url) {
    this.attachment.payload.url = url;
  }

  applyPrompt(answers) {
    if (answers.imageUrl) {
      this.setImageUrl(answers.imageUrl);
    }
  }

  toJSON() {
    return Object.assign({}, super.toJSON(), { message: { attachment: this.attachment } });
  }
}

module.exports = {
  message: ImageMessage,
  instance: (recipientId, imageUrl) => { return new ImageMessage(recipientId, imageUrl) },
  description: 'Simple image message',
  schema: baseMessage.schema.concat([
    {
      type: 'input',
      name: 'imageUrl',
      message: 'URL of the image:'
    }
  ])
};
