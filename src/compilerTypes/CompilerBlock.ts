import ParserBlock from '../parserTypes/ParserBlock';
import Element from '../helper/Element';

class CompilerBlock{
  public block: ParserBlock;
  public children: CompilerBlock[];
  public element: Element | HTMLElement;

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
}

export default CompilerBlock;
