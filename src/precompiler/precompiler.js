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
    let blocks;
    while(this._index < this._positions.length) {
      // else-closing
        this._setClose();
      // closing
        this._setOpen()
            .incrementIndex();
        // break;
      // openening
        this._setOpen();
        let lastBlock = blocks[blocks.length - 1];
        lastBlock.children = [];
        this._incrementIndex();
        lastBlock.children = this._handleBlocks(lastBlock.children);

    }

    return blocks;
  },
  _nodePosition(fromIndex) {
    return this._template.indexOf(/<|{{/g, fromIndex); // @TODO add until > or }}
  },

  _indexOfAll() {
    let occurances = [];
    let fromIndex = 0;
    let occurance;
    do {
      occurance = this._nodePosition(fromIndex);
      if(occurance !== -1) {
        occurances.push(occurance);
      }
    } while(occurance !== -1);

    return occurances;
  },

  _incrementIndex() {
    this.index++;

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

  isOpenTag(position) {
    var snippet = this._template.substring(position, 2);
    return snippet[0] === '<' && snippet[1] !== '/';
  },

  isCloseTag(position) {
    var snippet = this._template.substring(position, 2);
    return snippet === '</';
  },

  isOpenMustache(position) {
    var snippet = this._template.substring(position, 3);
    return snippet[0] === '{' && snippet[1] !== '{' && snippet[2] !== '/';
  },

  isCloseMustache(position) {
    var snippet = this._template.substring(position, 3);
    return snippet[0] === '{' && snippet[1] !== '{' && snippet[2] === '/';
  },

  isElseMustache(position) {
    var elseString = '{{#else';
    var snippet = this._template.substring(position, elseString.length);
    return snippet === elseString;
  },
};


export default function precompiler(template) {
  return new Precompiler(template).parse();
}