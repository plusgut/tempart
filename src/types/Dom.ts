import Block from './Block';

class Dom extends Block {
  public type: string;

  constructor() {
    super();

    this.type = 'dom';
  }
}

export default Dom;
