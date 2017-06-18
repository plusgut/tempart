/* global describe, it, expect, tempart, jasmine */

// jshint varstmt: false
// jscs:disable requireTrailingComma
// jscs:disable maximumLineLength

describe('Tests the functionality of the parser', function () {
  it('static test', function () {
    expect(parse('<div>foo</div>')).toEqual({
      type: 'dom',
      id: 1,
      constants: ['div'],
      parameters: [{
        exec: 'constants',
        value: 0,
      }],
      children: [{
        type: 'content',
        id: 2,
        constants: ['foo'],
        parameters: [{
          exec: 'constants',
          value: 0,
        }],
      }]
    });
  });

  it('static text', function () {
    expect(parse('foo')).toEqual({
      type: 'dom',
      id: 1,
      constants: ['span'],
      containerElement: true,
      parameters: [{
        exec: 'constants',
        value: 0,
      }],
      children: [{
        type: 'content',
        id: 2,
        constants: ['foo'],
        parameters: [{
          exec: 'constants',
          value: 0,
        }],
      }]
    });
  });

  // it('static test with tree', function () {
  //   expect(tempart.parser('<div>foo<div>bar</div></div>').template).toEqual({
  //     type: 'dom',
  //     id: 1,
  //     constants: ['div'],
  //     parameters: [{
  //       exec: 'constants',
  //       value: 0,
  //     }],
  //     children: [{
  //       type: 'content',
  //       id: 2,
  //       constants: ['foo'],
  //       parameters: [{
  //         exec: 'constants',
  //         value: 0,
  //       }],
  //     }, {
  //       type: 'dom',
  //       id: 3,
  //       constants: ['div'],
  //       parameters: [{
  //         exec: 'constants',
  //         value: 0,
  //       }],
  //       children: [{
  //         type: 'content',
  //         id: 4,
  //         constants: ['bar'],
  //         parameters: [{
  //           exec: 'constants',
  //           value: 0,
  //         }],
  //       }]
  //     }]
  //   });
  // });

  // it('variable in domNode', function () {
  //   expect(tempart.parser('<div>{{variable}}</div>').template).toEqual({
  //     type: 'variable',
  //     id: 1,
  //     constants: ['div'],
  //     variables: [['variable']],
  //     parameters: [{
  //       exec: 'variables',
  //       value: 0,
  //     }, {
  //       exec: 'constants',
  //       value: 0,
  //     }]
  //   });
  // });

  // it('variable and text domNode', function () {
  //   expect(tempart.parser('<div>static{{variable}}</div>').template).toEqual({
  //     type: 'dom',
  //     id: 1,
  //     constants: ['div'],
  //     parameters: [{
  //       exec: 'constants',
  //       value: 0,
  //     }],
  //     children: [{
  //       type: 'content',
  //       id: 2,
  //       constants: ['static'],
  //       parameters: [{
  //         exec: 'constants',
  //         value: 0,
  //       }],
  //     }, {
  //       type: 'variable',
  //       id: 3,

  //       constants: ['span'],
  //       variables: [['variable']],
  //       parameters: [{
  //         exec: 'variables',
  //         value: 0,
  //       }, {
  //         exec: 'constants',
  //         value: 0,
  //       }]
  //     }]
  //   });
  // });

  // it('static test for properties', function () {
  //   expect(tempart.parser('<div class="classValue"checked id="idValue">foo</div>').template).toEqual({
  //     type: 'dom',
  //     id: 1,
  //     constants: ['div', 'classValue', 'checked', 'idValue'],
  //     parameters: [{
  //       exec: 'constants',
  //       value: 0,
  //     }, {
  //       name: 'class',
  //       exec: 'constants',
  //       value: 1,
  //     }, {
  //       exec: 'constants',
  //       value: 2,
  //     }, {
  //       name: 'id',
  //       exec: 'constants',
  //       value: 3,
  //     }],
  //     children: [{
  //       type: 'content',
  //       id: 2,
  //       constants: ['foo'],
  //       parameters: [{
  //         exec: 'constants',
  //         value: 0,
  //       }],
  //     }]
  //   });
  // });

  // it('variable test for properties', function () {
  //   expect(tempart.parser('<div class="{{classVariable}}"{{variable}} id="{{idVariable}}">foo</div>').template).toEqual({
  //     type: 'dom',
  //     id: 1,
  //     constants: ['div'],
  //     variables: [['classVariable'], ['variable'], ['idVariable']],
  //     parameters: [{
  //       exec: 'constants',
  //       value: 0,
  //     }, {
  //       name: 'class',
  //       exec: 'variables',
  //       value: 0,
  //     }, {
  //       exec: 'variables',
  //       value: 1,
  //     }, {
  //       name: 'id',
  //       exec: 'variables',
  //       value: 2,
  //     }],
  //     children: [{
  //       type: 'content',
  //       id: 2,
  //       constants: ['foo'],
  //       parameters: [{
  //         exec: 'constants',
  //         value: 0,
  //       }],
  //     }]
  //   });
  // });

  // it('throw error with missmatch', function () {
  //   expect(function () {
  //     tempart.tempart.parser('<div>foo</span>');
  //   }).toThrow(new SyntaxError('Missmatch of div and /span'));

  //   expect(function () {
  //     tempart.tempart.parser('<div>foo<div>bar</span></span>');
  //   }).toThrow(new SyntaxError('Missmatch of div and /span'));
  // });

  // it('throw error with not ending node', function () {
  //   expect(function () {
  //     tempart.tempart.parser('<div');
  //   }).toThrow(new SyntaxError('Tag is not ending: div'));
  // });
});

function parse(templateString) {
  var template = tempart.parser(templateString).template;
  debugger;
  try {
    return JSON.parse(JSON.stringify(template));
  }  catch (err) {
    console.log(template);
    debugger;
    throw err;
  }
}
