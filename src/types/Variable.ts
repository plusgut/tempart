import Block     from './Block';
import State     from '../helper/State';
import util      from '../helper/util';
import constants from '../helper/constants';

class Variable extends Block {
  public type: string;

  constructor(state: State, type: string) {
    super(state);

    this.type = 'variable';

    // Skipping {{$
    this.state.incrementIndex().incrementIndex().incrementIndex();

    let variableName = '';

    while (util.isClosingMustache(state) === false) {
      if (this.state.index >= this.state.templateString.length) {
        throw new Error('No end of variable found');
      }

      if (/[A-z|.]/.test(state.getCurrentChar()) === true) {
        variableName += state.getCurrentChar();
      } else {
        throw new Error('Disallowed character in variable');
      }

      this.state.incrementIndex();
    }


    // Skipping }}
    this.state.incrementIndex().incrementIndex();
    if (type === 'attribute') {
      this.addAttribute(variableName.split(constants.VARIABLE_DELIMITER));
    } else if (type === 'state') {
      this.addState(variableName.split(constants.VARIABLE_DELIMITER));
    } else {
      // Please make an github issue and tell me how you got here
      throw new Error('Variable got no correct state');
    }
    
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
