import State from '../helper/State';
import Block from './Block';

class Container extends Block {
  type: string;

  constructor(state: State) {
    super(state);

    this.type = 'dom';
    this.addConstant(state.getContainerElement());
    this.containerElement = true;
  }

  public closeTag() {
    this.state.closeOpenBlock();
    this.state.getCurrentBlock().closeTag();
  }
}

export default Container;
