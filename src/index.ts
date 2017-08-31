import parser from './core/parser';
import factory from './core/factory';
import ParserBlock from './parserTypes/ParserBlock';
import error from './error/error';
import constants from './helper/constants';

const tempart = {
  version: constants.VERSION,
  parse(templateString: string): templateAst {
    return {
      template: parser(templateString),
      version: constants.VERSION,
    };
  },
  factory(prefix: string, template: templateAst) {
    if (!prefix) {
      error.throwPrefixMissing();
    } else if (!template) {
      error.throwTemplateMissing();
    } else if (!template.version) {
      throw error.throwVersionMissing();
    } else if (template.version !== this.version) {
      error.throwVersionMissmatch(template.version, constants.VERSION);
    }

    return factory(prefix, template.template);
  },
};

export interface templateAst {
  template: ParserBlock[];
  version: string;
}

export default tempart;
(<any>window).tempart = tempart;
