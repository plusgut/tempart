import blocks from '../helpers/blocks';

function Class() {}

Class.prototype = {
  clean(content) {
    this._local = {};
    this._content = content;
    this.html = '';
    this._handleCleanBlock(this._template);

    return this;
  },

  dirty(content, dirties) {
    this._local = {};
    this._content = content;
    this._dirties = dirties;

    return this;
  },

  _handleCleanBlocks(blocks) {
    for (let i = 0; i < blocks.length; i++) {
      this._handleCleanBlock(blocks[i]);
    }

    return this;
  },

  _handleCleanBlock(block) {
    blocks(block.type).clean(this, block);

    return this;
  },

  _addHtml(string) {
    this.html += string;

    return this;
  },

};

export default Class;
