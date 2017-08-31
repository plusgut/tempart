import ParserBlock   from '../parserTypes/ParserBlock';
import CompilerBlock from '../compilerTypes/CompilerBlock';
import Dom           from '../compilerTypes/Dom';
import Variable      from '../compilerTypes/Variable';
import Content       from '../compilerTypes/Content';
import Each          from '../compilerTypes/Each';
import Environment   from './Environment';

class Compiler {
  private types: {
    [key: string]: typeof CompilerBlock,
  };

  private environment: Environment;
  constructor(environment: Environment) {
    this.environment = environment;

    this.types = {
      dom: Dom,
      content: Content,
      variable: Variable,
      each: Each,
    };
  }

  public create(block: ParserBlock, parentBlock?: CompilerBlock): CompilerBlock {
    if (this.types[block.type] !== undefined) {
      return new this.types[block.type](block, this.environment, parentBlock);
    } else {
      throw new Error('Unknown type ' + block.type);
    }
  }
}

export default Compiler;
