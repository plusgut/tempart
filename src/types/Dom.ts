import Block from './Block';
import State from '../helper/State';

class Dom extends Block {
  public type: string;

  constructor(state: State) {
    super(state);

    state.openTag = true;
    state.openBlocks.push(this);
    this.type = 'dom';
  }

  public closeTag() {
    let tagName = '';
    this.state.incrementIndex().incrementIndex(); // It needs to skip </
    while (this.state.getCurrentChar() !== '>') {
      if (this.state.index >= this.state.templateString.length) {
        throw new Error('No end of tag found');
      }
      tagName += this.state.getCurrentChar();
      this.state.incrementIndex();
    }
    if (this.constants[0] !== tagName) { // @TODO add variable-possiblity via parameters[0]
      throw new Error('Missmatch of tags!');
    }
    this.state.closeOpenBlock();
    this.state.incrementIndex();
  }
}

export default Dom;
