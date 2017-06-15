import Block from '../types/Block';
import Container from '../types/Container';

class State {
  public allBlocks: Block[];
  public openBlocks: Block[];
  public templateString: string;
  public index: number;
  public root: Block;
  public openTag: boolean;

  constructor(templateString: string) {
    this.index = 0;
    this.openTag = false;
    this.templateString = templateString;
    this.root = new Container(this);
    this.openBlocks = [this.root];
  }

  public closeOpenBlock() {
    if (this.openBlocks.length === 0) {
      throw new Error('You are trying to close an not opened Block');
    } else {
      this.openBlocks.pop();
    }
  }

  public getCurrentBlock() {
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
    return this;
  }

  public treeShake(block: Block): Block {
    delete block.state;
    if (block.containerElement === true && block.children.length === 1) {
      return this.treeShake(block.children[0]);
    } else {
      for (let i = 0; block.children && i < block.children.length; i += 1) {
        block.children[i] = this.treeShake(block.children[i]);
      }
      return block;
    }
  }

  public getContainerElement() {
    return 'div';
  }
}

export default State;
