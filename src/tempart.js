/*global tempart_parser_parser, tempart_compiler_compiler, module, window */

// jshint varstmt: false
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var result = {
  parser: tempart_parser_parser.default,
  factory: tempart_compiler_compiler.default,
};

if (typeof module === 'object') {
  module.exports = result;
} else {
  window.tempart = result;
}
