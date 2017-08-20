import ParserBlock from '../parserTypes/ParserBlock';
import Parameter from  '../helper/Parameter';
import Environment from  '../helper/Environment';

class CompilerBlock {
  public block: ParserBlock;
  public children: CompilerBlock[];
  public element?: Element | Text;
  public parentBlock?: CompilerBlock;
  public environment: Environment;

  constructor(block: ParserBlock, environment: Environment, parentBlock?: CompilerBlock) {
    this.block = block;
    this.environment = environment;
    this.parentBlock = parentBlock;
  }

  public getElement() {
    // @TODO check if cache exists else get it from dom
    return this.element;
  }

  public getParameterValue(index: number): any {
    const parameter = this.getParameter(index);
    switch (parameter.exec) {
      case 'constant': {
        return parameter.value[0];
      }
      case 'state': {
        return this.environment.getValue(parameter);
      }
      case 'local': {
        if (this.environment.local[parameter.value[0]]) {
          const key = this.environment.local[parameter.value[0]];
          const stateParameter = new Parameter('state', key);
          return this.environment.getValue(stateParameter);
        } else {
          throw new Error('Environment has no local ' + parameter.value[0]);
        }

      }
      default: {
        throw new Error('Don\'t know the type ' + parameter.exec);
      }
    }
  }

  public subscribe(index: number, callback: () => void) {
    const parameter = this.getParameter(index);

    switch (parameter.exec) {
      case 'state': {
        return this.environment.subscribe(parameter, callback);
      }
    }
  }

  public getParameter(index: number) {
    return this.block.parameters[index];
  }

  public appendChildren() {
    if (this.block.children) {
      this.ensureChildren();
      for (let i = 0; i < this.block.children.length; i += 1) {
        const compilerBlock = this.environment.compiler.create(this.block.children[i], this);
        this.children.push(compilerBlock);
      }
    }
  }

  public ensureChildren() {
    if (this.children === undefined) {
      this.children = [];
    }
  }

  public appendToParent(element: Element | Text) {
    if (this.parentBlock) {
      const parentElement = this.parentBlock.getElement();
      if (parentElement instanceof Element) {
        parentElement.appendChild(element);
      }
    }
  }
}

export default CompilerBlock;
