import parser from './core/parser';
import factory from './core/factory';
import ParserBlock from './parserTypes/ParserBlock';

interface template {
  template: ParserBlock[];
  version: number;
}

const tempart =  {
  version: 0.4, // @TODO should be coming out of package.json
  parse(templateString: string): template {
    return {
      template: parser(templateString),
      version: this.version,
    };
  },
  factory(prefix: string, template: template) {
    if (!template.version) {
      throw new Error('No template version given');
    } else if (template.version !== this.version) {
      throw new Error('Version ' + template.version + ' is not compatible with ' + this.version);
    } else {
      return factory(prefix, template.template);
    }
  },
};

export default tempart;
(<any>window).tempart = tempart;
