/*global tempart_parser_parser, tempart_compiler_tempart, module, window */

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var result = {
    parser: tempart_parser_parser.default,
    factory: tempart_compiler_tempart.default
};

if (typeof module === 'object') {
  module.exports = result;
} else {
  window.tempart = result;
}
