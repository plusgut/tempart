/*global tempart_precompiler_precompiler, tempart_compiler_tempart, module, window */

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var result = {
    precompile: tempart_precompiler_precompiler.default,
    factory: tempart_compiler_tempart.default
};

if (typeof module === 'object') {
  module.exports = result;
} else {
  window.tempart = result;
}
