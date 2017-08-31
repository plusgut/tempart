import ParserBlock from '../parserTypes/ParserBlock';
import CompilerBlock from '../compilerTypes/CompilerBlock';
import document from '../helper/document';
import Environment from '../helper/Environment';
import error from '../error/error';
import ITemplate from './ITemplate';

export default function (path: string, blocks: ParserBlock[]): typeof ITemplate {
  class Template implements ITemplate {
    templateBlocks: ParserBlock[];
    roots: CompilerBlock[];
    prefix: string;
    path: string;

    constructor(prefix: string, state: any, props: any) {
      if (this instanceof Template) {
        this.prefix = prefix;

        const environment = new Environment(state, props);
        this.roots = this.templateBlocks.map((parserBlock) => {
          return environment.compiler.create(parserBlock);
        });
      } else {
        error.throwCallError();
      }
    }

    public getHtml() {
      return this.roots.map((block: CompilerBlock) => {
        return document.getOuterHTML(block.element);
      }).join('');
    }
  }

  Template.prototype.templateBlocks = blocks;
  Template.prototype.path = path;

  return Template;
}
