import BlockClass from './blockClass';

function Precompiler(template) {
  this._template = template;
}

Precompiler.prototype = {
  parse() {
    this._positions = this._indexOfAll();
    this._index = 0;
    let blocks = [];
    this.blocks = this._handleBlocks(blocks);

    return this.blocks;
  },

  _handleBlocks() {
    let blocks = [];
    while(this._index < this._template.length) {
      let block;
      // else-closing
        // this._setClose();
      // closing
        // this._setOpen()
        //     .incrementIndex();
        // break;
      // openening
      if(this._isOpenTag(this._index)) {
        block = new BlockClass('staticNode');
        blocks.push(block);
        this._index = this._template.indexOf(">", this._index) + 1;
        block.children = this._setOpen()._handleBlocks(block);
      } else if(this._isCloseTag(this._index)) {
        break;
      } else {
        var next = this._charsUntilNode(this._index);
        block = new BlockClass('staticText');
        block.addConstants(this._template.substring(this._index, this._index + next));
        this._index = this._index + next;
        blocks.push(block);
      }
    }

    return blocks;
  },
  _indexOfAll() {
    let occurances = [];
    let search = /<|{{/g;
    let result;
    while (result = search.exec(this._template)) {
      occurances.push(result.index);
    }
    return occurances;
  },

  _incrementIndex() {
    this._index++;

    return this;
  },

  _isOpen() {
    return this.open;
  },

  _setOpen() {
    this.open = true;

    return this;
  },

  _setClose() {
    this.open = false;

    return this;
  },

  _charsUntilNode(position) {
    for (let i = 0; i < this._positions.length; i++) {
      if (position < this._positions[i]) {
        return this._positions[i] - position;
      }
    }
    console.warn('is this calculated correct?');
    return this._template.length - position;
  },
  _isOpenTag(position) {
    let snippet = this._template.substring(position, 2);
    return snippet[0] === '<' && snippet[1] !== '/';
  },

  _isCloseTag(position) {
    let snippet = this._template.substring(position, position + 2);
    return snippet === '</';
  },

  _isOpenMustache(position) {
    let snippet = this._template.substring(position, position + 3);
    return snippet[0] === '{' && snippet[1] !== '{' && snippet[2] !== '/';
  },

  _isCloseMustache(position) {
    let snippet = this._template.substring(position, position + 3);
    return snippet[0] === '{' && snippet[1] !== '{' && snippet[2] === '/';
  },

  _isElseMustache(position) {
    let elseString = '{{#else';
    let snippet = this._template.substring(position, elseString.length);
    return snippet === elseString;
  },
};


export default function precompiler(template) {
  return new Precompiler(template).parse();
}