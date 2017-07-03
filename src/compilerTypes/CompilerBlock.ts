import ParserBlock from '../parserTypes/ParserBlock';
import Element from  '../helper/Element';

class CompilerBlock {
  public block: ParserBlock;
  public children: CompilerBlock[];
  public element: Element | HTMLElement | Text;

  constructor(block: ParserBlock) {
    this.block = block;
  }

  public getElement() {
    // @TODO check if cache exists else get it from dom
  }

  public getParameterLength() {
    return this.block.parameters.length;
  }

  public getParameterValue(index: number) {
    const parameter = this.getParameter(index);
    return parameter.value;
  }

  public getParameter(index: number) {
    return this.block.parameters[index];
  }

  public appendChildren() {
    if (this.block.children) {
      this.ensureChildren();
      for (let i = 0; i < this.block.children.length; i += 1) {
        const compilerBlock = compiler(this.block.children[i]);
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

import compiler from '../helper/compiler';
