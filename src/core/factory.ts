import ParserBlock from '../parserTypes/ParserBlock';
import CompilerBlock from '../compilerTypes/CompilerBlock';
import document from '../helper/document';
import Environment from '../helper/Environment';

export default function (prefix: string, blocks: ParserBlock[]) {

  class Template {
    templateBlocks: ParserBlock[];
    roots: CompilerBlock[];
    prefix: string;

    constructor(prefix: string) {
      this.prefix = prefix;
    }

    compile(state: any) {
      const environment = new Environment(state, {});
      this.roots = this.templateBlocks.map(environment.compiler.create.bind(environment.compiler));
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
