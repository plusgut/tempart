import ParserBlock from '../parserTypes/ParserBlock';
import CompilerBlock from './CompilerBlock';
import elementContainer from '../helper/elementContainer';

const ELEMENT_INDEX = 0;

class Container extends CompilerBlock{
  constructor(block: ParserBlock) {
    super(block);
    this.element = elementContainer.create(this.getParameterValue(ELEMENT_INDEX)[0]);
  }
}

export default Container;
