import State from '../helper/State';
import Parameter from '../helper/Parameter';

abstract class Block {
  public abstract type: string;
  public abstract closeTag(): void;
  public state: State;
  public id: number;
  public parameters: Parameter[];
  public children: Block[];
  public elseChildren: Block[];
  public containerElement: boolean;

  constructor(state: State) {
    this.state = state;
  }

  public addChild(block: Block) {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(block);
  }

  public addElseChild(block: Block) {
    if (!this.elseChildren) {
      this.elseChildren = [];
    }
    this.elseChildren.push(block);
  }

  public addConstant(value: string) {
    this.ensureParameters();
    this.parameters.push(new Parameter('constant', [value]));
  }

  public addAttribute(value: string[]) {
    this.ensureParameters();
    this.parameters.push(new Parameter('attribute', value));
  }

  public addState(value: string[]) {
    this.ensureParameters();

    this.parameters.push(new Parameter('states', value));
  }

  private ensureParameters() {
    if (this.parameters === undefined) {
      this.parameters = [];
    }
    return this;
  }
}

export default Block;
