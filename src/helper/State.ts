import Block from '../types/Block';
import Container from '../types/Container';
import util from './util';

class State {
  public allBlocks: Block[];
  public openBlocks: Block[];
  public templateString: string;
  public index: number;
  public root: Block;
  public openTag: boolean;
  private compressPipe: (block: Block) => Block;
  private idCount: number;

  constructor(templateString: string) {
    this.idCount = 0;
    this.index = 0;
    this.openTag = false;
    this.templateString = templateString;
    this.root = new Container(this);
    this.openBlocks = [this.root];

    this.compressPipe = util.pipe(
      this.treeShake.bind(this),
      this.compressVariables.bind(this),
      this.addIds.bind(this),
      this.deleteCircular.bind(this),
    );
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
      debugger;
      throw new Error('You are trying to do something, on an not existing block');
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

  private incrementId() {
    this.idCount += 1;
    return this;
  }

  public compress(block: Block) {
    let result = block;
    result = this.compressPipe(block);

    if (result.children) {
      result.children = <Block[]>result.children.map(this.compress.bind(this));
    }

    return result;
  }

  public addIds(block: Block): Block {
    this.incrementId();
    block.id = this.idCount;

    return block;
  }

  public treeShake(block: Block): Block {
    if (this.shouldDeleteContainer(block) === true) {
      return block.children[0];
    } else {
      return block;
    }
  }

  public compressVariables(block: Block) {
    // if (block.type === 'dom' &&
    //     block.children.length === 1 &&
    //     block.children[0].type === 'variable') {
    //   const parameter = block.children[0].parameters.pop();
    //   let variable;


    //   delete block.children;
    // }

    return block;
  }

  private deleteCircular (block: Block): Block {
    delete block.state;
    return block;
  }

  public getContainerElement() {
    return 'span';
  }

  private shouldDeleteContainer(block: Block) {
    return (block.containerElement === true && block.children.length === 1) &&
// When a block is consistent of an text element, the wrapping container should not be deleted
      !(block === this.root && block.children[0].type === 'content');
  }
}

export default State;
