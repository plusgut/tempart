import State from '../helper/State';
import Parameter from '../helper/Parameter';

abstract class Block {
  public abstract type: string;
  public abstract closeTag(): void;
  public state: State;
  public id: number;
  public constants: string[];
  public variables: string[];
  public paramenters: Parameter[];
  public children: Block[];
  public elseChildren: Block[];
  public containerElement: boolean;

  constructor(state: State) {
    this.state = state;
    this.containerElement = false;
    this.constants = [];
    this.variables = [];
  }

  public setId(id: number) {
    this.id = id;
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
    const length = this.constants.push(value);
    this.paramenters.push(new Parameter(value, length - 1));
  }

  public addVariable(value: string) {
    const length = this.variables.push(value);
    this.paramenters.push(new Parameter(value, length - 1));
  }
}

export default Block;
