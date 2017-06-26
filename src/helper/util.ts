import State from './State';
import Parameter from './Parameter';
import constants from '../helper/constants';

export default {
  isPartial(state: State): boolean {
    return false;
  },

  /**
   * checks for opening a new tag
   * @param state
   */
  isNewDomTag(state: State): boolean {
    return state.getCurrentChar() === '<' && state.templateString[state.index + 1] !== '/';
  },

  /**
   * checks for closing tag'</
   * @param state
   */
  isNewDomCloseTag(state: State): boolean {
    return state.getNextChars(2) === '</';
  },

  /**
   * checks for the end of new tag >
   * @param state
   */
  isEndTag(state: State): boolean {
    return state.getCurrentChar() === '>';
  },

  isAttribute(state: State): boolean {
    return state.getNextChars(3) === '{{@';
  },

  isState(state: State): boolean {
    return state.getNextChars(3) === '{{$';
  },

  isClosingMustache(state: State): boolean {
    return state.getNextChars(2) === '}}';
  },

  isQuote(state: State) {
    return ['"', '\'', '`'].indexOf(state.getCurrentChar()) !== -1;
  },

  isSpace(state: State) {
    return state.getCurrentChar() === ' ';
  },

  /**
   * checks for special chars
   */
  isText(state: State): boolean {
    return this.isPartial(state)         === false &&
           this.isNewDomTag(state)       === false &&
           this.isNewDomCloseTag(state)  === false &&
           this.isEndTag(state)          === false &&
           this.isAttribute(state)       === false &&
           this.isState(state)           === false &&
           this.isClosingMustache(state) === false;
  },

  getParameter(state: State): Parameter {
    let type = '';
    if (this.isState(state)) {
      type = 'state';
    } else if (this.isAttribute(state)) {
      type = 'attribute';
    } else {
      throw 'Unknown Parameter type';
    }

    state.incrementIndex().incrementIndex().incrementIndex();

    let variableName = '';

    while (this.isClosingMustache(state) === false) {
      if (state.index >= state.templateString.length) {
        throw new Error('No end of variable found');
      }

      variableName += state.getCurrentChar();
      state.incrementIndex();
    }


    // Skipping }}
    state.incrementIndex().incrementIndex();

    const parameter = new Parameter(type, variableName.split(constants.VARIABLE_DELIMITER));

    return parameter;
  },

  /**
   * queues functions to call them and return the new data
   */
  pipe(...funcs: {(value: any): any}[]) {
    return (value: any) => {
      let result = value;
      for (let i = 0; i < funcs.length; i += 1) {
        result = funcs[i](result);
      }
      return result;
    };
  },
};
