/*global tempart_lexer_lexer, tempart_compiler_tempart, module, window */

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var result = {
    lexer: tempart_lexer_lexer.default,
    factory: tempart_compiler_tempart.default
};

if (typeof module === 'object') {
  module.exports = result;
} else {
  window.tempart = result;
}
