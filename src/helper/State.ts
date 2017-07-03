import ParserBlock from '../parserTypes/ParserBlock';
import Container   from '../parserTypes/Container';
import util        from './util';

class State {
  public allBlocks: ParserBlock[];
  public openBlocks: ParserBlock[];
  public templateString: string;
  public index: number;
  public root: ParserBlock;
  private compressPipe: (block: ParserBlock) => ParserBlock;
  private idCount: number;

  constructor(templateString: string) {
    this.idCount = 0;
    this.index = 0;
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

  public decrementIndex() {
    this.index -= 1;
    return this;
  }

  private incrementId() {
    this.idCount += 1;
    return this;
  }

  public compress(block: ParserBlock) {
    let result = block;
    result = this.compressPipe(block);

    if (result.children) {
      result.children = <ParserBlock[]>result.children.map(this.compress.bind(this));
    }

    return result;
  }

  public addIds(block: ParserBlock): ParserBlock {
    this.incrementId();
    block.id = this.idCount;

    return block;
  }

  public treeShake(block: ParserBlock): ParserBlock {
    if (this.shouldDeleteContainer(block) === true) {
      return block.children[0];
    } else {
      return block;
    }
  }

  public compressVariables(block: ParserBlock) {
    if (block.type === 'dom' &&
        block.children &&
        block.children.length === 1 &&
        block.children[0].type === 'variable') {
      const parameter = block.children[0].parameters.shift();
      block.parameters.unshift(parameter);
      block.type = 'variable';

      delete block.children;
    }

    return block;
  }

  private deleteCircular (block: ParserBlock): ParserBlock {
    delete block.state;
    return block;
  }

  public getContainerElement() {
    return 'span';
  }

  private shouldDeleteContainer(block: ParserBlock) {
    return (block.containerElement === true && block.children.length === 1) &&
// When a block is consistent of an text element, the wrapping container should not be deleted
      !(block === this.root && block.children[0].type === 'content');
  }
}

export default State;
