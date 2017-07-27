import parser from './core/parser';
import factory from './core/factory';
import ParserBlock from './parserTypes/ParserBlock';
import error from './error/error';
import constants from './helper/constants';

interface template {
  template: ParserBlock[];
  version: string;
}

const tempart = {
  version: constants.VERSION,
  parse(templateString: string): template {
    return {
      template: parser(templateString),
      version: constants.VERSION,
    };
  },
  factory(prefix: string, template: template) {
    if (!prefix) {
      error.throwPrefixMissing();
    } else if (!template) {
      error.throwTemplateMissing();
    } else if (!template.version) {
      throw error.throwVersionMissing();
    } else if (template.version !== this.version) {
      throw error.throwVersionMissmatch(template.version, constants.VERSION);
    } else {
      return factory(prefix, template.template);
    }
  },
};

export default tempart;
(<any>window).tempart = tempart;
