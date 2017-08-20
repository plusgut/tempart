import ParserBlock from '../parserTypes/ParserBlock';
import CompilerBlock from './CompilerBlock';
import Environment from '../helper/Environment';

class Each extends CompilerBlock{
  constructor(block: ParserBlock, environment: Environment) {
    super(block, environment);
  }
}

export default Each;
