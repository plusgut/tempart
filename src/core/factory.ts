import ParserBlock from '../parserTypes/ParserBlock';
import CompilerBlock from '../compilerTypes/CompilerBlock';
import document from '../helper/document';
import compiler from '../helper/compiler';

export default function (prefix: string, blocks: ParserBlock[]) {

  class Template {
    templateBlocks: ParserBlock[];
    roots: CompilerBlock[];
    prefix: string;

    constructor(prefix: string) {
      this.prefix = prefix;
    }

    compile() {
      this.roots = this.templateBlocks.map(compiler);
      console.log(this.roots);
      return {
        html: this.roots.map((block: CompilerBlock) => {
          return document.getOuterHTML(block.element);
        }).join(''),
      };      
    }
  }

  Template.prototype.templateBlocks = blocks;

  return Template;
}
