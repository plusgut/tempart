/* global describe, it, expect, tempart */

// jshint varstmt: false
// jscs:disable requireTrailingComma
// jscs:disable maximumLineLength

describe('Tests the functionality of the parser', function () {
  it('static test', function () {
    expect(parse('<div>foo</div>')).toEqual([{
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
    }]);
  });

  it('static text', function () {
    expect(parse('foo')).toEqual([{
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
    }]);
  });

  it('static test with tree', function () {
    expect(parse('<div>foo<div>bar</div></div>')).toEqual([{
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
    }]);
  });

  it('variable in domNode', function () {
    expect(parse('<div>{{@variable}}</div>')).toEqual([{
      type: 'dom',
      id: 1,
      parameters: [{
        exec: 'constant',
        value: ['div'],
      }],
      children: [{
        type: 'variable',
        id: 2,
        parameters: [{
          exec: 'attribute',
          value: ['variable'],
        }]
      }]
    }]);
  });

  it('nested variable in domNode', function () {
    expect(parse('<div>{{@vari.able}}</div>')).toEqual([{
      type: 'dom',
      id: 1,
      parameters: [{
        exec: 'constant',
        value: ['div'],
      }],
      children: [{
        type: 'variable',
        id: 2,
        parameters: [{
          exec: 'attribute',
          value: ['vari', 'able'],
        }]
      }]
    }]);
  });

  it('variable and text domNode', function () {
    expect(parse('<div>static{{@variable}}</div>')).toEqual([{
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
        type: 'dom',
        id: 3,
        containerElement: true,
        parameters: [{
          exec: 'constant',
          value: ['span'],
        }],
        children: [{
          type: 'variable',
          id: 4,
          parameters: [{
            exec: 'attribute',
            value: ['variable'],
          }]
        }]
      }]
    }]);
  });

  it('state in domNode', function () {
    expect(parse('<div>{{$variable}}</div>')).toEqual([{
      type: 'dom',
      id: 1,
      parameters: [{
        exec: 'constant',
        value: ['div'],
      }],
      children: [{
        type: 'variable',
        id: 2,
        parameters: [{
          exec: 'state',
          value: ['variable'],
        }]
      }]
    }]);
  });

  it('nested state in domNode', function () {
    expect(parse('<div>{{$vari.able}}</div>')).toEqual([{
      type: 'dom',
      id: 1,
      parameters: [{
        exec: 'constant',
        value: ['div'],
      }],
      children: [{
        type: 'variable',
        id: 2,
        parameters: [{
          exec: 'state',
          value: ['vari', 'able'],
        }]
      }]
    }]);
  });

  it('state and text domNode', function () {
    expect(parse('<div>static{{$variable}}</div>')).toEqual([{
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
        type: 'dom',
        id: 3,
        containerElement: true,
        parameters: [{
          exec: 'constant',
          value: ['span'],
        }],
        children: [{
          type: 'variable',
          id: 4,
          parameters: [{
            exec: 'state',
            value: ['variable'],
          }]
        }]
      }]
    }]);
  });

  it('static test for properties', function () {
    expect(parse('<div class="classValue"checked id="idValue">foo</div>')).toEqual([{
      type: 'dom',
      id: 1,
      parameters: [{
        exec: 'constant',
        value: ['div'],
      }, {
        name: 'class',
        exec: 'constant',
        value: ['classValue'],
      }, {
        exec: 'constant',
        value: ['checked'],
      }, {
        name: 'id',
        exec: 'constant',
        value: ['idValue']
      }],
      children: [{
        type: 'content',
        id: 2,
        parameters: [{
          exec: 'constant',
          value: ['foo'],
        }],
      }]
    }]);
  });

  it('variable test for properties', function () {
    expect(parse('<div class={{$class.variable}} id={{@id.variable}}>foo</div>')).toEqual([{
      type: 'dom',
      id: 1,
      parameters: [{
        exec: 'constant',
        value: ['div'],
      }, {
        name: 'class',
        exec: 'state',
        value: ['class', 'variable'],
      }, {
        name: 'id',
        exec: 'attribute',
        value: ['id', 'variable'],
      }],
      children: [{
        type: 'content',
        id: 2,
        parameters: [{
          exec: 'constant',
          value: ['foo'],
        }],
      }]
    }]);
  });

  it('each parsing', function () {
    // @TODO fix this wrong test, doesnt work correctly with closing right now
    // expect(parse('<ul>{{#each $todos as ~todo}}<li>{{~todo}}</li></ul>')).toEqual([{
    expect(parse('<ul>{{#each $todos as ~todo}}<li>{{~todo}}</li></ul>')).toEqual([{
      type: 'dom',
      id: 1,
      parameters: [{
        exec: 'constant',
        value: ['ul'],
      }],
      children: [{
        type: 'each',
        id: 2,
        parameters: [{
          exec: 'state',
          value: ['todos']
        }, {
          exec: 'constant',
          value: ['as']
        }, {
          exec: 'local',
          value: ['todo']
        }],
        children: [{
          type: 'dom',
          id: 3,
          parameters: [{
            exec: 'constant',
            value: ['li'],
          }],
          children: [{
            type: 'variable',
            id: 4,
            parameters: [{
              exec: 'local',
              value: ['todo'],
            }],
          }]
        }],
      }],
    }]);
  });

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
  if(window.foo) debugger;

  try {
    return JSON.parse(JSON.stringify(template));
  }  catch (err) {
    console.log(template);
    debugger;
    throw err;
  }
}
