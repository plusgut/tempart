import ParserBlock from '../parserTypes/ParserBlock';
import CompilerBlock from '../compilerTypes/CompilerBlock';

// This is a *abstract* class, but 
class Template {
  templateBlocks: ParserBlock[];
  roots: CompilerBlock[];
  prefix: string;
  path: string;

  constructor(prefix: string, state: any, props: any) {
    prefix;
    state;
    props;
    throw new Error('Do not call the abstract Template directly');
  }

  public getHtml() {}
}

export default Template;
