import ParserBlock from '../parserTypes/ParserBlock';
import CompilerBlock from './CompilerBlock';
import document from '../helper/document';

const ELEMENT_INDEX = 0;

class Dom extends CompilerBlock {

  constructor(block: ParserBlock) {
    super(block);
    this.element = document.createText(this.getParameterValue(ELEMENT_INDEX)[0]);
    this.appendChildren();
  }
}

export default Dom;
