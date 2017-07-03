import ParserBlock   from '../parserTypes/ParserBlock';
import CompilerBlock from '../compilerTypes/CompilerBlock';
import Dom           from '../compilerTypes/Dom';
import Variable      from '../compilerTypes/Variable';
import Content       from '../compilerTypes/Content';

export default function create(block: ParserBlock): CompilerBlock {
  switch (block.type) {
    case 'dom': {
      return new Dom(block);
    }
    case 'content': {
      return new Content(block);
    }

    case 'variable': {
      return new Variable(block);
    }
    default: {
      throw new Error('Unknown type ' + block.type);
    }
  }
}
