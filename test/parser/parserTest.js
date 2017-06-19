/* global describe, it, expect, tempart, jasmine */

// jshint varstmt: false
// jscs:disable requireTrailingComma
// jscs:disable maximumLineLength

describe('Tests the functionality of the parser', function () {
  it('static test', function () {
    expect(parse('<div>foo</div>')).toEqual({
      type: 'dom',
      id: 1,
      parameters: [{
        exec: 'constant',
        value: ['div'],
      }],
      children: [{
        type: 'content',
        id: 2,
        parameters: [{
          exec: 'constant',
          value: ['foo'],
        }],
      }]
    });
  });

  it('static text', function () {
    expect(parse('foo')).toEqual({
      type: 'dom',
      id: 1,
      containerElement: true,
      parameters: [{
        exec: 'constant',
        value: ['span'],
      }],
      children: [{
        type: 'content',
        id: 2,
        parameters: [{
          exec: 'constant',
          value: ['foo'],
        }],
      }]
    });
  });

  it('static test with tree', function () {
    expect(parse('<div>foo<div>bar</div></div>')).toEqual({
      type: 'dom',
      id: 1,
      parameters: [{
        exec: 'constant',
        value: ['div'],
      }],
      children: [{
        type: 'content',
        id: 2,
        parameters: [{
          exec: 'constant',
          value: ['foo'],
        }],
      }, {
        type: 'dom',
        id: 3,
        parameters: [{
          exec: 'constant',
          value: ['div'],
        }],
        children: [{
          type: 'content',
          id: 4,
          parameters: [{
            exec: 'constant',
            value: ['bar'],
          }],
        }]
      }]
    });
  });

  it('variable in domNode', function () {
    expect(parse('<div>{{@variable}}</div>')).toEqual({
      type: 'variable',
      id: 1,
      parameters: [{
        exec: 'attribute',
        value: ['variable'],
      }, {
        exec: 'constant',
        value: ['div'],
      }]
    });
  });

  it('variable in domNode', function () {
    expect(parse('<div>{{@vari.able}}</div>')).toEqual({
      type: 'variable',
      id: 1,
      parameters: [{
        exec: 'attribute',
        value: ['vari', 'able'],
      }, {
        exec: 'constant',
        value: ['div'],
      }]
    });
  });

  it('variable and text domNode', function () {
    expect(parse('<div>static{{@variable}}</div>')).toEqual({
      type: 'dom',
      id: 1,
      parameters: [{
        exec: 'constant',
        value: ['div'],
      }],
      children: [{
        type: 'content',
        id: 2,
        parameters: [{
          exec: 'constant',
          value: ['static'],
        }],
      }, {
        type: 'variable',
        id: 3,
        parameters: [{
          exec: 'attribute',
          value: ['variable'],
        }, {
          exec: 'constant',
          value: ['span'],
        }]
      }]
    });
  });

  it('state in domNode', function () {
    expect(parse('<div>{{$variable}}</div>')).toEqual({
      type: 'variable',
      id: 1,
      parameters: [{
        exec: 'state',
        value: ['variable'],
      }, {
        exec: 'constant',
        value: ['div'],
      }]
    });
  });

  it('nested state in domNode', function () {
    expect(parse('<div>{{$vari.able}}</div>')).toEqual({
      type: 'variable',
      id: 1,
      parameters: [{
        exec: 'state',
        value: ['vari', 'able'],
      }, {
        exec: 'constant',
        value: ['div'],
      }]
    });
  });

  it('state and text domNode', function () {
    expect(parse('<div>static{{$variable}}</div>')).toEqual({
      type: 'dom',
      id: 1,
      parameters: [{
        exec: 'constant',
        value: ['div'],
      }],
      children: [{
        type: 'content',
        id: 2,
        parameters: [{
          exec: 'constant',
          value: ['static'],
        }],
      }, {
        type: 'variable',
        id: 3,
        parameters: [{
          exec: 'state',
          value: ['variable'],
        }, {
          exec: 'constant',
          value: ['span'],
        }]
      }]
    });
  });

  // it('static test for properties', function () {
  //   expect(parse('<div class="classValue"checked id="idValue">foo</div>')).toEqual({
  //     type: 'dom',
  //     id: 1,
  //     constants: ['div', 'classValue', 'checked', 'idValue'],
  //     parameters: [{
  //       exec: 'constant',
  //       value: 0,
  //     }, {
  //       name: 'class',
  //       exec: 'constant',
  //       value: 1,
  //     }, {
  //       exec: 'constant',
  //       value: 2,
  //     }, {
  //       name: 'id',
  //       exec: 'constant',
  //       value: 3,
  //     }],
  //     children: [{
  //       type: 'content',
  //       id: 2,
  //       constants: ['foo'],
  //       parameters: [{
  //         exec: 'constant',
  //         value: 0,
  //       }],
  //     }]
  //   });
  // });

  // it('variable test for properties', function () {
  //   expect(parse('<div class="{{classVariable}}"{{variable}} id="{{idVariable}}">foo</div>')).toEqual({
  //     type: 'dom',
  //     id: 1,
  //     constants: ['div'],
  //     variables: [['classVariable'], ['variable'], ['idVariable']],
  //     parameters: [{
  //       exec: 'constant',
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
  //         exec: 'constant',
  //         value: 0,
  //       }],
  //     }]
  //   });
  // });

  // it('throw error with missmatch', function () {
  //   expect(function () {
  //     parse('<div>foo</span>');
  //   }).toThrow(new SyntaxError('Missmatch of div and /span'));

  //   expect(function () {
  //     parse('<div>foo<div>bar</span></span>');
  //   }).toThrow(new SyntaxError('Missmatch of div and /span'));
  // });

  // it('throw error with not ending node', function () {
  //   expect(function () {
  //     parse('<div');
  //   }).toThrow(new SyntaxError('Tag is not ending: div'));
  // });
});

function parse(templateString) {
  var template = tempart.parse(templateString).template;
  debugger;
  try {
    return JSON.parse(JSON.stringify(template));
  }  catch (err) {
    console.log(template);
    debugger;
    throw err;
  }
}
