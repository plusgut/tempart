import State from './State';

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

  /**
   * checks for special chars
   */
  isText(state: State): boolean {
    // should check for < > and { }
    return state.getCurrentChar() !== '<' && state.getCurrentChar() !== '>';
    // && state.getNextChars(2) !== '{{';
  },

  isVariable(state: State): boolean {
    return false;
  },

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
