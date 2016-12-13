var parser = tempart.parser;

describe('Tests the functionality of the parser', function() {
  it('static test', function() {
    expect(parser('<div>foo</div>')).toEqual([{
        type: 'domNode',
        constants: ['div'],
        children: [{
            type: 'textNode',
            constants: ['foo']
        }]
    }]);
  });

  it('static test with tree', function() {
    expect(parser('<div>foo<div>bar</div></div>')).toEqual([{
        type: 'domNode',
        constants: ['div'],
        children: [{
            type: 'textNode',
            constants: ['foo']
          }, {
            type: 'domNode',
            constants: ['div'],
            children: [{
                type: 'textNode',
                constants: ['bar']
            }]
        }]
    }]);
  });

  it('throw error with missmatch', function() {
    expect(function() {
        tempart.parser('<div>foo</span>');
    }).toThrow(new SyntaxError('Missmatch of div and /span'));

    expect(function() {
        tempart.parser('<div>foo<div>bar</span></span>');
    }).toThrow(new SyntaxError('Missmatch of div and /span'));
  });

  it('throw error with not ending node', function() {
    expect(function() {
        tempart.parser('<div');
    }).toThrow(new SyntaxError('Tag is not ending: div'));
  });
});