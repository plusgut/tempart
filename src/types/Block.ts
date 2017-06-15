import State from '../helper/State';
import Parameter from '../helper/Parameter';

abstract class Block {
  public abstract type: string;
  public abstract closeTag(): void;
  public state: State;
  public id: number;
  public constants: string[];
  public variables: string[];
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
    this.ensureConstants().ensureParameters();
    const length = this.constants.push(value);
    this.parameters.push(new Parameter('constants', length - 1));
  }

  public addVariable(value: string) {
    this.ensureVariables().ensureParameters();

    const length = this.variables.push(value);
    this.parameters.push(new Parameter('variables', length - 1));
  }

  private ensureConstants() {
    if (this.constants === undefined) {
      this.constants = [];
    }
    return this;
  }

  private ensureVariables() {
    if (this.variables === undefined) {
      this.variables = [];
    }
    return this;
  }

  private ensureParameters() {
    if (this.parameters === undefined) {
      this.parameters = [];
    }
    return this;
  }
}

export default Block;
