export default {
  get: function (handler, keyParts) {
    if (keyParts.length === 0) {
      throw new Error('You have to give me an key, else it won\'t work');
    }

    if (keyParts.length === 1 && handler._local.hasOwnProperty(keyParts[0])) {
      return handler._local[keyParts[0]];
    }

    let result = handler._content;
    for (let i = 0; i < keyParts.length; i++) {
      // if (!result) {
      //   // @TODO add meaningful error
      //   throw new Error('Content-key error without a great message');
      // }

      // If this throws errors, your key tries to get an value of an not existent parent
      result = result[keyParts[i]];
    }

    return result;
  },

  set: function (handler, key, value) {
    handler._local[key] = value;
  },
};
