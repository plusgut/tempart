import parser from './core/parser';

const tempart =  {
  parse(templateString: string) {
    return {
      template: parser(templateString),
      version: this.version,
    };
  },
  version: 0.4,
  factory() {

  },
};

export default tempart;
(<any>window).tempart = tempart;
