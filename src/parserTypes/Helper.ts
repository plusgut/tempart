import ParserBlock from './ParserBlock';
import State from '../helper/State';
import util from '../helper/util';

class Helper extends ParserBlock {
  public type: string;

  constructor(state: State) {
    super(state);

    this.hasChildren = util.isMustacheHelperWithChildren(state);
    state.incrementIndex().incrementIndex();
    if (this.hasChildren === true) {
      this.state.openBlocks.push(this);
      state.incrementIndex();
    }

    let buffer = '';
    while (util.isClosingMustache(state) === false) {
      if (state.index >= state.templateString.length) {
        throw new Error('Could not find end of mustache helper');
      } else if (state.getCurrentChar() === ' ') {
        if (buffer !== '') {
          this.handleBuffer(buffer);
          buffer = '';
        }
      } else {
        buffer += state.getCurrentChar();
      }
      state.incrementIndex();
    }
    this.handleBuffer(buffer);
    state.incrementIndex().incrementIndex();
  }

  private handleBuffer(buffer: string) {
    if (buffer !== '') {
      if (this.type === undefined) {
        this.setType(buffer);
      } else {
        this.ensureParameters();
        this.parameters.push(util.generateParameter(buffer));
      }
    }
  }

  private setType(name: string) {
    this.type = name;
  }

  public closeTag() {
    if (this.hasChildren === true) {
      this.state.incrementIndex().incrementIndex().incrementIndex();
      let buffer = '';
      while (util.isClosingMustache(this.state) === false) {
        if (this.state.index > this.state.templateString.length) {
          throw new Error('The mustache helper ' + this.type + 'got not closed');
        }
        buffer += this.state.getCurrentChar();
        this.state.incrementIndex();
      }
      if (buffer !== this.type) {
        // @TODO improve errorhandling
        throw new Error('The mustache helper ' + this.type + 'got not closed');
      }
      this.state.incrementIndex().incrementIndex(); // needed for closing mustache }}
      this.state.openBlocks.pop();
    } else {
      throw new Error('You can\'t close a selfclosing block');
    }
  }
}

export default Helper;
