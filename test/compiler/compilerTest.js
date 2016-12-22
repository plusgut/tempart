/* global describe, it, expect, tempart */

// jshint varstmt: false
// jscs:disable requireTrailingComma
// jscs:disable maximumLineLength

function check(template, result, data) {
  var Template = tempart.factory('path', tempart.parser(template));
  var templateInstance = new Template('prefix-');
  expect(templateInstance.clean(data).html).toEqual(result);
}

describe('Tests the functionality of the compiler', function () {
  it('static test', function () {
    check('<div>foo</div>', '<div data-snew-id="prefix-1">foo</div>', {});
  });

  it('static test with attributes', function () {
    check('<div id="bar">foo</div>', '<div id="bar" data-snew-id="prefix-1">foo</div>', {});
  });

  it('check if error gets thrown when not correctly called', function () {
    var Template = tempart.factory('path', { version: tempart.version });
    expect(function () {
      Template('foo');
    }).toThrow(new Error('Tempart has to be called with new'));
  });
});
