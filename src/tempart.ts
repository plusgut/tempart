import parser from './core/parser';

debugger;

const tempart =  {
  version: 0.4,
  parser: parser,
  factory() {

  }
};

export default tempart;
(<any>window).tempart = tempart;
