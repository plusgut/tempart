function Class() {}

Class.prototype = {
  clean(content) {
    this._local = {};
    this._content = content;
    this.html = '';

    return this;
  },

  dirty(content, dirties) {
    this._local = {};
    this._content = content;
    this._dirties = dirties;

    return this;
  },
};

export default Class;
