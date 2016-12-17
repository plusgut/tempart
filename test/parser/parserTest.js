/* global describe, it, expect, tempart */

// jshint varstmt: false
// jscs:disable requireTrailingComma

var parser = tempart.parser;

describe('Tests the functionality of the parser', function () {
  it('static test', function () {
    expect(parser('<div>foo</div>')).toEqual([{
      type: 'domNode',
      constants: ['div'],
      parameters: [{
        exec: 'constants',
        value: 0,
      }],
      children: [{
        type: 'textNode',
        constants: ['foo'],
        parameters: [{
          exec: 'constants',
          value: 0,
        }],
      }]
    }]);
  });

  it('static test with tree', function () {
    expect(parser('<div>foo<div>bar</div></div>')).toEqual([{
      type: 'domNode',
      constants: ['div'],
      parameters: [{
        exec: 'constants',
        value: 0,
      }],
      children: [{
        type: 'textNode',
        constants: ['foo'],
        parameters: [{
          exec: 'constants',
          value: 0,
        }],
      }, {
        type: 'domNode',
        constants: ['div'],
        parameters: [{
          exec: 'constants',
          value: 0,
        }],
        children: [{
          type: 'textNode',
          constants: ['bar'],
          parameters: [{
            exec: 'constants',
            value: 0,
          }],
        }]
      }]
    }]);
  });

  it('variable in domNode', function () {
    expect(parser('<div>{{$variable}}</div>')).toEqual([{
      type: 'variableNode',
      constants: ['div'],
      variables: [['variable']],
      parameters: [{
        exec: 'variables',
        value: 0,
      }, {
        exec: 'constants',
        value: 0,
      }]
    }]);
  });

  it('variable and text domNode', function () {
    expect(parser('<div>static{{$variable}}</div>')).toEqual([{
      type: 'domNode',
      constants: ['div'],
      parameters: [{
        exec: 'constants',
        value: 0,
      }],
      children: [{
        type: 'textNode',
        constants: ['static'],
        parameters: [{
          exec: 'constants',
          value: 0,
        }],
      }, {
        type: 'variableNode',

        // constants: ['span'],
        variables: [['variable']],
        parameters: [{
          exec: 'variables',
          value: 0,
        }]
      }]
    }]);
  });

  it('static test for properties', function () {
    expect(parser('<div class="classValue"checked id="idValue">foo</div>')).toEqual([{
      type: 'domNode',
      constants: ['div', 'classValue', 'checked', 'idValue'],
      parameters: [{
        exec: 'constants',
        value: 0,
      }, {
        name: 'class',
        exec: 'constants',
        value: 1,
      }, {
        exec: 'constants',
        value: 2,
      }, {
        name: 'id',
        exec: 'constants',
        value: 3,
      }],
      children: [{
        type: 'textNode',
        constants: ['foo'],
        parameters: [{
          exec: 'constants',
          value: 0,
        }],
      }]
    }]);
  });

  it('throw error with missmatch', function () {
    expect(function () {
      tempart.parser('<div>foo</span>');
    }).toThrow(new SyntaxError('Missmatch of div and /span'));

    expect(function () {
      tempart.parser('<div>foo<div>bar</span></span>');
    }).toThrow(new SyntaxError('Missmatch of div and /span'));
  });

  it('throw error with not ending node', function () {
    expect(function () {
      tempart.parser('<div');
    }).toThrow(new SyntaxError('Tag is not ending: div'));
  });
});
