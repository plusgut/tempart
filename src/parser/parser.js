import BlockClass from './blockClass';
import version from '../version';

const containerType = 'span';

function Precompiler(template) {
  this._template = template;
  this._increment = 0;
}

Precompiler.prototype = {
  _quotes: ['"', '\'', '”', '’'], // @TODO check for completion
  parse() {
    this._positions = this._indexOfAllNodes();
    this._index = 0;
    this.blocks = this._handleBlocks();

    if (this.blocks.length !== 1) {
      throw 'Something really went wrong, on highest level it should never be more then one node';
    }

    this._addIds(this.blocks[0]);

    return {
      version: version,
      template: this.blocks[0],
    };
  },

  _addIds(block) {
    block.setId(++this._increment);
    if (block.children) {
      block.children.forEach(this._addIds.bind(this));
    }

    return this;
  },

  _handleBlocks(parentBlock) {
    let blocks = [];
    let hasMustacheNode = false;
    let isOpenTag = false;
    while (this._index < this._template.length) {
      if (this._isOpenMustache(this._index)) {
        hasMustacheNode = true;
        this._handleMustacheNode(blocks, isOpenTag);
      } else if (this._isOpenTag(this._index)) {
        isOpenTag = true;
        this._handleOpenTag(blocks);
      } else if (this._isCloseTag(this._index)) {
        isOpenTag = false;
        this._handleCloseTag(parentBlock);
        break;
      } else {
        this._handleTextNode(blocks);
      }
    }

    this._compressBlocks(hasMustacheNode, blocks, parentBlock)
        ._handleRootBlock(blocks, parentBlock);

    return blocks;
  },

  _handleMustacheNode(blocks, isOpenTag) {
    if (isOpenTag) {
      // This should theoreticly never be executed
      throw 'This should already be handled by _handleOpenTag';
    } else if (this._template[this._index + 2].search(/[a-z]/i) === 0) {
      this._handleVariableBlock(blocks);
    } else {
      throw 'Handling Mustache - blocks is currently not implemented';
    }

    return this;
  },

  _handleRootBlock(blocks, parentBlock) {
    const firstBlock = blocks[0];
    if (parentBlock === undefined && firstBlock.type === 'text') {
      let container = new BlockClass('dom');
      container.pushParameter('constants', containerType);
      container.children = [firstBlock];
      blocks.pop();
      blocks.push(container);
    }

    return this;
  },

  _handleVariableBlock(blocks) {
    const end = this._template.indexOf('}}', this._index);
    let block = new BlockClass('variable');
    block.pushParameter('variables', this._template.substring(this._index + 2, end).split('.'));
    block.pushParameter('constants', containerType);
    this._index = this._index + end + 3;
    blocks.push(block);

    return this;
  },

  _handleOpenTag(blocks) {
    let block = new BlockClass('dom');
    block.pushParameter('constants', this._getTagType(this._index + 1));
    this._parseAttributes(block);

    // @TODO add validation check for block e.g. img has no alt-attribute

    blocks.push(block);

    // @TODO add check if its an self-closing
    let children = this._handleBlocks(block);
    if (children.length) {
      block.children = children;
    }

    return this;
  },

  _parseAttributes(block) {
    // @TODO make this nicelooking
    const startAttributes = this._getTagStart(this._index);
    const endTag = this._getTagEnd(this._index);
    if (this._hasAttributes(startAttributes, endTag)) {
      this._index = startAttributes;

      let currentAttributeName = '';
      let currentAttributeValue = '';
      while (this._index <= this._template.length) {
        const currentChar = this._template[this._index];
        if (currentChar  === '>') {
          this._addAttribute(block, currentAttributeName, currentAttributeValue);
          break;
        } else if (currentChar === ' ') {
          if (currentAttributeName) {
            this._addAttribute(block, currentAttributeName, currentAttributeValue);
            currentAttributeName = '';
            currentAttributeValue = '';
          }
        } else if (currentChar === '=') {
          this._index++;
          if (this._quotes.indexOf(this._template[this._index]) !== -1) {
            this._index++;

            // @TODO this needs to be fixed for variable handling
          }

          currentAttributeValue = this._template[this._index];
        } else if (currentChar === '"') {
          // @TODO add all quote possibilities
          this._addAttribute(block, currentAttributeName, currentAttributeValue);
          currentAttributeName = '';
          currentAttributeValue = '';
        } else {
          if (currentAttributeValue) {
            currentAttributeValue += currentChar;
          } else {
            currentAttributeName += currentChar;
          }
        }

        this._index++;
      }

    } else {
      this._index = endTag;
    }

    this._index++;

    return this;
  },

  _addAttribute(block, attributeName, attributeValue) {
    // @TODO add variable-handling
    let type = 'constants';
    if (attributeValue) {
      if (this._isMustache(attributeValue)) {
        type = 'variables';
        attributeValue = this._removeMustache(attributeValue).split('.');
      }

      block.pushParameter(type, attributeValue, attributeName);
    } else if (attributeName) {
      if (this._isMustache(attributeName)) {
        type = 'variables';
        attributeName = this._removeMustache(attributeName).split('.');
      }

      block.pushParameter(type, attributeName);
    }

    return this;
  },

  _handleCloseTag(parentBlock) {
    let closeTag = this._getTagType(this._index + 2);
    if (parentBlock !== undefined && closeTag !== parentBlock.constants[0]) {
      throw new SyntaxError('Missmatch of ' + parentBlock.constants[0] + ' and /' + closeTag);
    }

    return this;
  },

  _handleTextNode(blocks) {
    const next = this._charsUntilNode(this._index);
    let block = new BlockClass('text');
    block.pushParameter('constants', this._template.substring(this._index, this._index + next));
    this._index = this._index + next;
    blocks.push(block);

    return this;
  },

  _compressBlocks(hasMustacheNode, blocks, parentBlock) {
    if (hasMustacheNode === true &&
        blocks.length === 1 &&
        parentBlock &&
        parentBlock.type === 'dom'
      ) {

      // @TODO improve, in case its a callee or something like that
      parentBlock.unshiftParameter('variables', blocks[0].variables[0]);
      parentBlock.setType('variable');
      blocks.length = 0;
    }

    return this;
  },

  _indexOfAllNodes() {
    return this._indexOfAll(this._template, /<|{{/g);
  },

  _indexOfAll(string, search) {
    let occurances = [];
    let result;
    while ((result = search.exec(string))) {
      occurances.push(result.index);
    }

    return occurances;
  },

  _getTagType(position) {
    let entityPositions = [
      this._template.indexOf(' ', position),
      this._template.indexOf('>', position),
      this._template.indexOf('/', position),
    ];

    // @TODO move to a seperate function
    let smallest;
    for (let i = 0; i < entityPositions.length; i++) {
      const entityPosition = entityPositions[i];
      if (entityPosition !== -1) {
        if (smallest === undefined) {
          smallest = entityPosition;
        } else if (entityPosition < smallest) {
          smallest = entityPosition;
        }
      }
    }

    if (smallest === undefined) {
      const tagName = this._template.substring(position, this._template.length);
      throw new SyntaxError('Tag is not ending: ' + tagName);
    }

    return this._template.substring(position, smallest);
  },

  _getTagStart(position) {
    return this._template.indexOf(' ', position);
  },

  _getTagEnd(position) {
    return this._template.indexOf('>', position);
  },

  _hasAttributes(startAttributes, endTag) {
    return startAttributes !== -1 && startAttributes < endTag;
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

  _isMustache(snippet) {
    return snippet[0] === '{' &&
           snippet[1] === '{' &&
           snippet[snippet.length - 2] === '}' &&
           snippet[snippet.length - 1];
  },

  _isOpenMustache(position) {
    let snippet = this._template.substring(position, position + 2);
    return snippet[0] === '{' && snippet[1] === '{';
  },

  // _isCloseMustache(position) {
  //   let snippet = this._template.substring(position, position + 3);
  //   return snippet[0] === '{' && snippet[1] === '{' && snippet[2] === '/';
  // },

  // _isElseMustache(position) {
  //   let elseString = '{{#else';
  //   let snippet = this._template.substring(position, elseString.length);
  //   return snippet === elseString;
  // },

  _removeMustache(snippet) {
    return snippet.substring(2, snippet.length - 2);
  },
};

export default function precompiler(template) {
  return new Precompiler(template).parse();
}
