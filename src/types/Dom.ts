import Block from './Block';

class Dom extends Block {
  type: string
  constructor() {
    super();

    this.type = 'dom';
  }
}

export default Dom;
