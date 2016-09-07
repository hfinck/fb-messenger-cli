'use strict';

function stringValidate(name, maxLength) {
  let validate = (name, maxLength, input) => {
    var result = input.length > 0 && input.length <= maxLength;
    if (!result) {
      result = '' + name + ' cannot be longer than ' + maxLength + ' characters.'
    }
    return result;
  }

  return input => validate(name, maxLength, input);
}

module.exports = stringValidate;
