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
      } else if (this.state.getCurrentChar() === '=') {
        name = current;
        current = '';
        this.state.incrementIndex();
  
        if (util.isState(state) === true || util.isAttribute(state) === true) {
          const parameter = util.getParameter(state);
          parameter.name = name;
          this.parameters.push(parameter);
          name = '';
        }
        this.state.decrementIndex();
      } else if (util.isQuote(state)) {
        if (isOpenQuote) {
          this.addValueToParameter(current, name);
          name = '';
          current = '';
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
    if (current) {
      const parameter = new Parameter('constant', [current]);
      if (name) {
        parameter.name = name;
      }
      this.parameters.push(parameter);
    }
  }

  public closeTag() {
    let tagName = '';
    this.state.incrementIndex().incrementIndex(); // It needs to skip </
    while (util.isEndTag(this.state) === false) {
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
