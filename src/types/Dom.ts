import Block from './Block';
import State from '../helper/State';

class Dom extends Block {
  public type: string;

  constructor(state: State) {
    super();

    this.type = 'dom';
  }
}

export default Dom;
