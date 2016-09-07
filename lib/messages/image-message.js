"use strict";

var baseMessage = require('./base-message');
var inquirer = require('inquirer');

class ImageMessage extends baseMessage.message {
  constructor(recipientId, imageUrl) {
    super(recipientId);
    this.attachment = {
      type: 'image',
      payload: {
        url: imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/3/31/Mark_Zuckerberg_at_the_37th_G8_Summit_in_Deauville_018_v1.jpg'
      }
    }
  }

  setImageUrl(url) {
    this.attachment.payload.url = url;
    return this;
  }

  clear() {
    super.clear();
    this.attachment.payload.url = null;
    return this;
  }

  toJSON() {
    return Object.assign({}, super.toJSON(), { message: { attachment: this.attachment } });
  }
}

function prompt(message) {
  return inquirer.prompt([
    {
      type: 'text',
      name: 'url',
      message: 'Enter image URL:',
      validate: input => {
        var result = input.length > 0;
        if (!result) {
          result = 'Please provide an image URL'
        }
        return result;
      }
    }
  ]).then(answers => {
    return message.setImageUrl(answers.url);
  });
}

module.exports = {
  message: ImageMessage,
  instance: (recipientId, imageUrl) => { return new ImageMessage(recipientId, imageUrl) },
  description: 'Simple image message',
  prompt: prompt
};
