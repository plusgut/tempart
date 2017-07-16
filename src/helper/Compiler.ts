import ParserBlock   from '../parserTypes/ParserBlock';
import CompilerBlock from '../compilerTypes/CompilerBlock';
import Dom           from '../compilerTypes/Dom';
import Variable      from '../compilerTypes/Variable';
import Content       from '../compilerTypes/Content';
import Environment   from './Environment';

class Compiler {
  private environment: Environment;
  constructor(environment: Environment) {
    this.environment = environment;
  }

  public create(block: ParserBlock): CompilerBlock {
    switch (block.type) {
      case 'dom': {
        return new Dom(block, this.environment);
      }
      case 'content': {
        return new Content(block, this.environment);
      }
      case 'variable': {
        return new Variable(block, this.environment);
      }
      default: {
        throw new Error('Unknown type ' + block.type);
      }
    }
  }
}

export default Compiler;
