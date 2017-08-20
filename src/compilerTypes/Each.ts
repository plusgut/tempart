import ParserBlock from '../parserTypes/ParserBlock';
import CompilerBlock from './CompilerBlock';
import Environment from '../helper/Environment';
import State from '../helper/State';

const ITERATE_INDEX = 0;
const KEY_INDEX = 2;

class EachParserEntity extends ParserBlock {
  type: string;
  public closeTag() {

  }
}

class EachCompilerEntity extends CompilerBlock {
  constructor(block: ParserBlock, environment: Environment, parentBlock?: CompilerBlock) {
    super(block, environment, parentBlock);
    this.appendChildren();
  }

  getElement() {
    return this.parentBlock.getElement();
  }
}

class Each extends CompilerBlock{
  constructor(block: ParserBlock, environment: Environment, parentBlock?: CompilerBlock) {
    super(block, environment, parentBlock);
    this.ensureChildren();
    const iterate = this.getParameterValue(ITERATE_INDEX);
    const iteratePath = this.getParameter(ITERATE_INDEX).value;
    const state = new State('');

    for (let i = 0; i < iterate.length; i += 1) {
      const keyParts = this.getParameter(KEY_INDEX).value;
      if(keyParts.length > 1) {
        throw new Error('Local values can\t be nested');
      } else {
        if (typeof keyParts[0] === 'string') {
          const path = iteratePath.slice(0, iteratePath.length);
          path.push(i + '');
          environment.setLocal(keyParts[0], path);
          
          const parserBlock = new EachParserEntity(state);
          parserBlock.children = block.children;
          this.children.push(new EachCompilerEntity(block, environment, this.parentBlock));
        } else {
          throw new Error('why isnt the key in your each a string?');
        }
      }
    }
  }

  getElement() {
    return this.parentBlock.getElement();
  }
}

export default Each;
