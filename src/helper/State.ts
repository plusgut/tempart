import Block from '../types/Block';
import Dom from '../types/Dom';

function createRootElement(state: State): Dom {
  const rootBlock = new Dom(state);
  rootBlock.root = true;
  return rootBlock;
}

class State {
  public allBlocks: Block[];
  public openBlocks: Block[];
  public templateString: string;
  public index: number;
  public root: Block;

  constructor(templateString: string) {
    this.index = 0;
    this.templateString = templateString;
    this.root = createRootElement(this);
    this.openBlocks = [this.root];
  }

  public getLastBlock() {
    if (this.openBlocks.length === 0) {
      throw new Error('You are trying to close something, which is not existent');
    }

    return this.openBlocks[this.openBlocks.length - 1];
  }

  public getNextChars(length: number) {
    return this.templateString.slice(this.index, this.index + length);
  }

  public getCurrentChar(): string {
    return this.templateString[this.index];
  }

  public incrementIndex() {
    this.index += 1;
  }
}

export default State;
