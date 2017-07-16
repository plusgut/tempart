import ParserBlock from './ParserBlock';
import State       from '../helper/State';
import util        from '../helper/util';

class Variable extends ParserBlock {
  public type: string;

  constructor(state: State) {
    super(state);

    this.type = 'variable';

    this.ensureParameters();
    this.parameters.push(util.getParameter(state));
  }

  public closeTag() {
    throw new Error('Closing a variable is not possible');
  }

  public addChild() {
    throw new Error('Variables can\'t handle children');
  }

}

export default Variable;
