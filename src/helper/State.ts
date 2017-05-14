import Block from '../types/Block';

class State {
  allBlocks: Array<Block>
  openBlocks: Array<Block>
  templateString: string
  index: number
  constructor(templateString: string, rootElement: Block) {
    this.index = 0;
    this.templateString = templateString;
    this.openBlocks = [rootElement];
  }

  getLastBlock() {
    if(this.openBlocks.length === 0) {
      throw new Error('You are trying to close something, which is not existent');
    }

    return this.openBlocks[this.openBlocks.length - 1];
  }

  getNextChars(length: number) {
    return this.templateString.slice(this.index, this.index + length);
  }

  getCurrentChar(): string {
    return this.templateString[this.index];
  }

  incrementIndex() {
    this.index++;
  }
}

export default State;