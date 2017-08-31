import ParserBlock from '../parserTypes/ParserBlock';
import CompilerBlock from './CompilerBlock';
import document from '../helper/document';
import Environment from '../helper/Environment';

const ELEMENT_INDEX = 0;

class Dom extends CompilerBlock {

  constructor(block: ParserBlock, environment: Environment, parentBlock?: CompilerBlock) {
    super(block, environment, parentBlock);
    this.element = document.createElement(this.getParameterValue(ELEMENT_INDEX));
    this.appendChildren();
    this.appendToParent(this.element);
  }
}

export default Dom;
