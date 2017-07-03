import ParserBlock from '../parserTypes/ParserBlock';
import CompilerBlock from '../compilerTypes/CompilerBlock';
import document from '../helper/document';
import compiler from '../helper/compiler';

export default function (prefix: string, block: ParserBlock) {

  class Template {
    templateBlock: ParserBlock;
    root: CompilerBlock;
    prefix: string;

    constructor(prefix: string) {
      this.prefix = prefix;
    }

    compile() {
      this.root = compiler(this.templateBlock);
      return {
        html: document.getOuterHTML(this.root.element),
      };      
    }
  }

  Template.prototype.templateBlock = block;

  return Template;
}
