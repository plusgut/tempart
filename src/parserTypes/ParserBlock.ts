import State from '../helper/State';
import Parameter from '../helper/Parameter';

abstract class Block {
  public abstract type: string;
  public abstract closeTag(): void;
  public state: State;
  public id: number;
  public parameters: Parameter[];
  public children: Block[];
  public hasChildren: boolean;
  public parent: Block;
  public elseChildren: Block[];
  public containerElement: boolean;

  constructor(state: State) {
    this.state = state;
     // Needed because root elements have no parents
    if (state.openBlocks && state.openBlocks.length) {
      this.parent = state.getCurrentBlock();
    }
  }

  public addChild(block: Block) {
    if (this.children === undefined) {
      this.children = [];
    }
    this.children.push(block);
  }

  public addElseChild(block: Block) {
    if (this.elseChildren === undefined) {
      this.elseChildren = [];
    }
    this.elseChildren.push(block);
  }

  public addConstant(value: string) {
    this.ensureParameters();
    this.parameters.push(new Parameter('constant', [value]));
  }

  public ensureParameters() {
    if (this.parameters === undefined) {
      this.parameters = [];
    }
    return this;
  }
}

export default Block;
