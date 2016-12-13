import BlockClass from './blockClass';

function Precompiler(template) {
  this._template = template;
}

Precompiler.prototype = {
  parse() {
    this._positions = this._indexOfAll();
    this._index = 0;
    this.blocks = this._handleBlocks();
    // console.log(JSON.stringify(this.blocks, null, 2));
    return this.blocks;
  },

  _handleBlocks(parentBlock) {
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
        block = new BlockClass('domNode');
        block.addConstants(this._getTagType(this._index + 1));
        blocks.push(block);
        this._index = this._template.indexOf(">", this._index) + 1;
        // @TODO add check if its an self-closing
        block.children = this._setOpen()._handleBlocks(block);
      } else if(this._isCloseTag(this._index)) {
        let closeTag = this._getTagType(this._index + 2);
        if(parentBlock !== undefined && closeTag !== parentBlock.constants[0]) {
          throw new SyntaxError('Missmatch of ' + parentBlock.constants[0] + ' and /' + closeTag);
        }
        break;
      } else {
        const next = this._charsUntilNode(this._index);
        block = new BlockClass('textNode');
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
    while ((result = search.exec(this._template))) {
      occurances.push(result.index);
    }
    return occurances;
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

  _getTagType(position) {
    let entityPositions = [this._template.indexOf(' ', position), this._template.indexOf('>', position), this._template.indexOf('/', position)];
    let smallest;
    for(let i = 0; i < entityPositions.length; i++) {
      const entityPosition = entityPositions[i];
      if(entityPosition !== -1 ) {
        if(smallest === undefined) {
          smallest = entityPosition;
        } else if(entityPosition < smallest){
          smallest = entityPosition;
        }
      }
    }

    if (smallest === undefined) {
      throw new SyntaxError('Tag is not ending: ' + this._template.substring(position, this._template.length));
    }
    return this._template.substring(position, smallest);
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
    let snippet = this._template.substring(position, position + 2);
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