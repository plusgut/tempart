import ParserBlock from '../parserTypes/ParserBlock';
import CompilerBlock from '../compilerTypes/CompilerBlock';
import Container from '../compilerTypes/Container';
import elementContainer from '../helper/elementContainer';

export default function (prefix: string, block: ParserBlock) {
  class Template {
    templateBlock: ParserBlock;
    root: CompilerBlock;
    prefix: string;
    constructor(prefix: string) {
      this.prefix = prefix;
    }

    compile() {
      this.root = new Container(this.templateBlock);
      return {
        html: elementContainer.getOuterHTML(this.root.element),
      };      
    }
  }

  Template.prototype.templateBlock = block;

  return Template;
}
