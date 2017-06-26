import Block     from './Block';
import State     from '../helper/State';
import util      from '../helper/util';
import constants from '../helper/constants';

class Variable extends Block {
  public type: string;

  constructor(state: State) {
    super(state);

    this.type = 'variable';

    this.ensureParameters();
    this.parameters.push(util.getParameter(state));
    
    this.addConstant(this.state.getContainerElement());
  }

  public closeTag() {
    throw new Error('Closing a variable is not possible');
  }

  public addChild() {
    throw new Error('Variables can\'t handle children');
  }

}

export default Variable;
