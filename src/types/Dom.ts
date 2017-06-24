import Block     from './Block';
import State     from '../helper/State';
import util      from '../helper/util';
import Parameter from '../helper/Parameter';

class Dom extends Block {
  public type: string;

  constructor(state: State) {
    super(state);

    this.ensureParameters();

    state.incrementIndex(); // Skipping <
    let name = '';
    let current = '';
    let isOpenQuote = false;
    while (util.isEndTag(state) === false) {
      if (state.index >= state.templateString.length) {
        throw new Error('Could not find end of tag');
      } else if (util.isSpace(state) && isOpenQuote === false) {
        this.addValueToParameter(current, name);
        current = '';
      } else if (util.isQuote(state)) {
        if (isOpenQuote) {
          this.addValueToParameter(current, name);
          current = '';
          name = '';
        } else {
          if (current[current.length - 1] === '=') {
            name = current.slice(0, current.length - 1);
            current = '';
          } else {
            throw new Error('Your attribute in the dom has no =');
          }

        }
        isOpenQuote = !isOpenQuote;
      } else {
        current += state.getCurrentChar();
      }
      // @TODO add selfclosing check
      state.incrementIndex();
    }

    if (current) {
      this.addValueToParameter(current, name);
    }

    state.incrementIndex(); // Skipping >

    state.openBlocks.push(this);
    this.type = 'dom';
  }

  private addValueToParameter(current: string, name: string) {
    let parameter;
    if (this.isVariable(current)) {
      parameter = new Parameter('variable', current.slice(2, current.length - 2).split('.'));
    } else {
      parameter = new Parameter('constant', [current]);
    }

    if (name !== '') {
      parameter.name = name;
    }

    this.parameters.push(parameter);
  }

  private isVariable(value: string) { // @TODO this code shouldnt be here, but probably in util
    return value.slice(0, 2) === '{{' && value.slice(value.length - 2, value.length) === '}}';
  }

  public closeTag() {
    let tagName = '';
    this.state.incrementIndex().incrementIndex(); // It needs to skip </
    while (this.state.getCurrentChar() !== '>') {
      if (this.state.index >= this.state.templateString.length) {
        throw new Error('No end of tag found');
      }
      tagName += this.state.getCurrentChar();
      this.state.incrementIndex();
    }

    // @TODO add variable-possiblity via parameters[0]
    if (this.parameters[0].value[0] !== tagName) {
      throw new Error('Missmatch of tags!');
    }
    this.state.closeOpenBlock();
    this.state.incrementIndex();
  }
}

export default Dom;
