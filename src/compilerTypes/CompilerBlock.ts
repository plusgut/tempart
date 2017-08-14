import ParserBlock from '../parserTypes/ParserBlock';
import Element from  '../helper/Element';
import Parameter from  '../helper/Parameter';
import Environment from  '../helper/Environment';

class CompilerBlock {
  public block: ParserBlock;
  public children: CompilerBlock[];
  public element: Element | HTMLElement | Text;
  public environment: Environment;

  constructor(block: ParserBlock, environment: Environment) {
    this.block = block;
    this.environment = environment;
  }

  public getElement() {
    // @TODO check if cache exists else get it from dom
  }

  public getParameterValue(index: number): string {
    const parameter = this.getParameter(index);
    switch (parameter.exec) {
      case 'constant': {
        return parameter.value[0];
      }
      case 'state': {
        return this.environment.getValue(parameter);
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
        const compilerBlock = this.environment.compiler.create(this.block.children[i]);
        this.children.push(compilerBlock);

        // These checks are only needed for typesafety
        if (this.element instanceof HTMLElement && (
            compilerBlock.element instanceof HTMLElement ||
            compilerBlock.element instanceof Text)) {
          this.element.appendChild(compilerBlock.element);
        } else if (this.element instanceof Element && compilerBlock.element instanceof Element) {
          this.element.appendChild(compilerBlock.element);
        }
      }
    }
  }

  private ensureChildren() {
    if (this.children === undefined) {
      this.children = [];
    }
  }
}

export default CompilerBlock;
