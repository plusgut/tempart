import ParserBlock from '../parserTypes/ParserBlock';
import CompilerBlock from './CompilerBlock';

class Variable extends CompilerBlock {

  constructor(block: ParserBlock) {
    super(block);

  }
}

export default Variable;
