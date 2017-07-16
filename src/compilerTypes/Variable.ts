import ParserBlock from '../parserTypes/ParserBlock';
import CompilerBlock from './CompilerBlock';
import document from '../helper/document';
import Environment from '../helper/Environment';

const VARIABLE_INDEX = 0;

class Variable extends CompilerBlock {

  constructor(block: ParserBlock, environment: Environment) {
    super(block, environment);
    this.element = document.createText(this.getParameterValue(VARIABLE_INDEX));
  }
}

export default Variable;
